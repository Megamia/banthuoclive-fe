import { openDB } from "idb";

const dbPromise = openDB("myDatabase", 3, {
  upgrade(db) {
    const stores = [
      "products",
      "detailProduct",
      "cart",
      "compare",
      "category",
      "ghn_provinces",
      "ghn_districts",
      "ghn_wards",
      "orders",
      "doctors",
    ];
    stores.forEach((store) => {
      if (!db.objectStoreNames.contains(store)) {
        db.createObjectStore(store, { keyPath: "id" });
      }
    });
  },
});
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

const isExpired = (timestamp, ttl = DEFAULT_TTL) => {
  return Date.now() - timestamp > ttl;
};

export const getAllDataFromIndexedDB = async () => {
  try {
    const db = await dbPromise;
    const stores = ["products", "detailProduct", "cart", "compare", "category"];
    let allData = {};

    for (const storeName of stores) {
      allData[storeName] = await db.getAll(storeName);
    }

    return allData;
  } catch (error) {
    console.error("❌ Lỗi khi lấy toàn bộ dữ liệu từ IndexedDB:", error);
    return null;
  }
};

export const saveDataToIndexedDB = async (storeName, data) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const timestamp = Date.now();

    if (!Array.isArray(data)) {
      console.error(`❌ Dữ liệu không hợp lệ cho ${storeName}:`, data);
      return;
    }

    await store.clear();

    for (const item of data) {
      const plainItem = JSON.parse(JSON.stringify(item));
      plainItem.timestamp = timestamp;
      store.put(plainItem);
    }


    await tx.done;
  } catch (error) {
    console.error("❌ Lỗi khi lưu dữ liệu vào IndexedDB:", error);
  }
};

export const getDataFromIndexedDB = async (storeName) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const data = await store.getAll();
    await tx.done;
    return data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy dữ liệu từ ${storeName}:`, error);
    return [];
  }
};

export const deleteItemFromIndexedDB = async (storeName, itemId) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction(storeName, "readwrite");
    await tx.objectStore(storeName).delete(itemId);
    await tx.done;
  } catch (error) {
    console.error(
      `❌ Lỗi khi xóa item có ID ${itemId} trong ${storeName}:`,
      error
    );
  }
};

export const clearAllDataFromIndexedDB = async () => {
  try {
    const db = await dbPromise;
    const stores = ["products", "detailProduct", "cart", "compare", "category"];
    const tx = db.transaction(stores, "readwrite");

    await Promise.all(stores.map((store) => tx.objectStore(store).clear()));

    await tx.done;
  } catch (error) {
    console.error("❌ Lỗi khi xóa toàn bộ dữ liệu IndexedDB:", error);
  }
};

export const updateItemInIndexedDB = async (item) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction("cart", "readwrite");
    const store = tx.objectStore("cart");

    const existingItem = await store.get(item.id);

    if (existingItem) {
      existingItem.quantity = item.quantity || existingItem.quantity;
      existingItem.timestamp = Date.now();
      await store.put(existingItem);
    } else {
      item.timestamp = Date.now();
      await store.put(item);
    }

    await tx.done;
  } catch (error) {
    console.error(" Lỗi khi cập nhật phần tử trong giỏ hàng:", error);
  }
};


export const getProvinceCached = async (provinceId) => {
  const db = await dbPromise;
  const store = db.transaction("ghn_provinces").objectStore("ghn_provinces");

  const cached = await store.get(provinceId);
  if (cached && !isExpired(cached.timestamp)) {
    return cached.name;
  }

  return null;
};

export const saveProvinceCached = async (provinceId, name) => {
  const db = await dbPromise;
  await db.put("ghn_provinces", {
    id: provinceId,
    name,
    timestamp: Date.now(),
  });
};
export const getDistrictsCached = async (provinceId) => {
  const db = await dbPromise;
  const store = db.transaction("ghn_districts").objectStore("ghn_districts");

  const cached = await store.get(provinceId);
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data;
  }

  return null;
};

export const saveDistrictsCached = async (provinceId, districts) => {
  const db = await dbPromise;
  await db.put("ghn_districts", {
    id: provinceId,
    data: districts,
    timestamp: Date.now(),
  });
};
export const getWardsCached = async (districtId) => {
  const db = await dbPromise;
  const store = db.transaction("ghn_wards").objectStore("ghn_wards");

  const cached = await store.get(districtId);
  if (cached && !isExpired(cached.timestamp)) {
    return cached.data;
  }

  return null;
};

export const saveWardsCached = async (districtId, wards) => {
  const db = await dbPromise;
  await db.put("ghn_wards", {
    id: districtId,
    data: wards,
    timestamp: Date.now(),
  });
};
export const getOrderCached = async (orderCode) => {
  const db = await dbPromise;
  const store = db.transaction("orders").objectStore("orders");

  const cached = await store.get(orderCode);
  if (cached && !isExpired(cached.timestamp, 5 * 60 * 1000)) {
    return cached.data;
  }

  return null;
};

export const saveOrderCached = async (orderCode, data) => {
  const db = await dbPromise;
  await db.put("orders", {
    id: orderCode,
    data,
    timestamp: Date.now(),
  });
};

export const getDoctorsCached = async () => {
  try {
    const db = await dbPromise;
    const store = db.transaction("doctors").objectStore("doctors");
    const data = await store.getAll();

    if (!data.length) return null;

    const timestamp = data[0]?.timestamp;
    if (!timestamp || isExpired(timestamp)) {
      return null;
    }

    return data;
  } catch (e) {
    console.error(" Lỗi lấy doctors cache:", e);
    return null;
  }
};

export const saveDoctorsCached = async (doctors) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction("doctors", "readwrite");
    const store = tx.objectStore("doctors");
    const timestamp = Date.now();

    await store.clear();

    for (const doctor of doctors) {
      store.put({
        ...JSON.parse(JSON.stringify(doctor)),
        timestamp,
      });
    }

    await tx.done;
  } catch (e) {
    console.error(" Lỗi lưu doctors cache:", e);
  }
};
