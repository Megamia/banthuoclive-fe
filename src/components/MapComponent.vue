<template>
  <div class="app">
    <button :disabled="loading" @click="relocateUser">Vị trí hiện tại</button>
    <button :disabled="loading" @click="getUserLocation">
      Tìm nhà thuốc gần đây
    </button>

    <div ref="mapContainer" id="map"></div>

    <div v-if="loading" class="loading">Đang tải...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const mapContainer = ref(null);
const loading = ref(false);
const error = ref(null);

let map;
let userMarker = null;
let pharmacyMarkers = [];
let routeLine = null;

/* ================== GEO ================== */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ định vị"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
    });
  });
}

/* ================== MAP ================== */
const loadMap = async () => {
  await nextTick();

  map = L.map(mapContainer.value).setView([21.0285, 105.8542], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
};

/* ================== USER ================== */
const relocateUser = async () => {
  loading.value = true;
  error.value = null;

  try {
    const pos = await getCurrentPosition();
    const { latitude, longitude } = pos.coords;

    if (userMarker) map.removeLayer(userMarker);

    userMarker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup("📍 Vị trí của bạn")
      .openPopup();

    map.setView([latitude, longitude], 15);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

/* ================== SEARCH PHARMACY ================== */
const getUserLocation = async () => {
  loading.value = true;
  error.value = null;

  try {
    const pos = await getCurrentPosition();
    const { latitude, longitude } = pos.coords;
    await searchPharmacies(latitude, longitude);
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
};

const buildPharmacyPopup = (tags, id, lat, lng, uLat, uLng) => {
  return `
    <div style="font-size:14px">
      <b style="font-size:15px">💊 ${tags?.name || "Nhà thuốc"}</b><br/>

      ${tags?.["addr:full"] ? `📍 ${tags["addr:full"]}<br/>` : ""}

      ${
        tags?.["addr:street"]
          ? `📍 ${tags["addr:housenumber"] || ""} ${tags["addr:street"]}<br/>`
          : ""
      }

      ${
        tags?.phone || tags?.["contact:phone"]
          ? `📞 ${tags.phone || tags["contact:phone"]}<br/>`
          : ""
      }

      ${tags?.opening_hours ? `🕒 ${tags.opening_hours}<br/>` : ""}

      ${
        tags?.website || tags?.["contact:website"]
          ? `🌐 <a href="${
              tags.website || tags["contact:website"]
            }" target="_blank">Website</a><br/>`
          : ""
      }

      <button
        id="route-${id}"
        style="margin-top:6px;padding:4px 8px;cursor:pointer"
      >
        🚗 Chỉ đường
      </button>
    </div>
  `;
};

const searchPharmacies = async (lat, lng) => {
  if (!map) return;

  loading.value = true;
  error.value = null;

  pharmacyMarkers.forEach((m) => map.removeLayer(m));
  pharmacyMarkers = [];

  const query = `
    [out:json][timeout:25];
    (
      node["shop"~"pharmacy|chemist|drugstore"](around:3000,${lat},${lng});
      node["amenity"="pharmacy"](around:3000,${lat},${lng});
      way["shop"~"pharmacy|chemist|drugstore"](around:3000,${lat},${lng});
      way["amenity"="pharmacy"](around:3000,${lat},${lng});
    );
    out center;
  `;

  try {
    const res = await fetch("https://overpass.kumi.systems/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: query,
    });

    const data = await res.json();

    if (!data.elements || data.elements.length === 0) {
      error.value = "Không tìm thấy nhà thuốc trong bán kính 3km";
      return;
    }

    data.elements.forEach((item) => {
      const latP = item.lat || item.center.lat;
      const lngP = item.lon || item.center.lon;

      const marker = L.marker([latP, lngP]).addTo(map);

      const popupHtml = buildPharmacyPopup(
        item.tags || {},
        item.id,
        latP,
        lngP,
        lat,
        lng
      );

      marker.bindPopup(popupHtml);

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`route-${item.id}`);
          if (btn) btn.onclick = () => drawRoute(lat, lng, latP, lngP);
        });
      });

      marker.on("popupopen", () => {
        setTimeout(() => {
          const btn = document.getElementById(`route-${item.id}`);
          if (btn) btn.onclick = () => drawRoute(lat, lng, latP, lngP);
        });
      });

      pharmacyMarkers.push(marker);
    });

    map.fitBounds(pharmacyMarkers.map((m) => m.getLatLng()));
  } catch (err) {
    console.error(err);
    error.value = "Lỗi khi gọi Overpass API";
  } finally {
    loading.value = false;
  }
};

/* ================== ROUTE ================== */
const drawRoute = async (startLat, startLng, endLat, endLng) => {
  loading.value = true;

  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);

    routeLine = L.polyline(coords, {
      color: "red",
      weight: 4,
    }).addTo(map);

    map.fitBounds(routeLine.getBounds());
  } catch (err) {
    error.value = "Không thể vẽ đường đi";
  } finally {
    loading.value = false;
  }
};

/* ================== LIFECYCLE ================== */
onMounted(loadMap);
onBeforeUnmount(() => {
  map?.remove();
});
</script>

<style scoped>
#map {
  width: 100vw;
  height: 500px;
}

.app {
  padding: 12px;
  text-align: center;
}

button {
  padding: 10px 14px;
  margin: 5px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

button:disabled {
  background: #aaa;
}

.loading {
  color: #007bff;
  font-weight: bold;
}

.error {
  color: red;
}
</style>
