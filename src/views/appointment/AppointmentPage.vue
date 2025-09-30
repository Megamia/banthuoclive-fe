<template>
  <a-flex vertical class="flex-1 mt-[30px] gap-[20px]">
    <!-- Input + Select filter + Clear -->
    <a-flex class="flex-1 justify-center items-center gap-2 max-md:flex-col">
      <input
        v-model="search"
        type="text"
        placeholder="Tên bác sĩ"
        class="border p-2 rounded"
      />

      <a-select
        v-model:value="selectedSpecialty"
        placeholder="Chọn chuyên khoa"
        style="width: 200px"
        allow-clear
      >
        <a-select-option
          v-for="spec in specialties"
          :key="spec.id"
          :value="spec.id"
        >
          {{ spec.name }}
        </a-select-option>
      </a-select>

      <a-button type="primary" danger ghost @click="btnClearFilter">
        Xóa bộ lọc
      </a-button>
    </a-flex>

    <!-- Danh sách bác sĩ -->
    <div class="flex flex-wrap gap-4 justify-center mt-4">
      <!-- Không có bác sĩ -->
      <div v-if="filteredData.length === 0" class="text-gray-500 italic">
        Không có bác sĩ phù hợp
      </div>

      <!-- Hiển thị bác sĩ (giới hạn số hàng) -->
      <div
        v-else
        v-for="item in filteredDataLimited"
        :key="item.id"
        class="flex flex-col max-w-[300px] items-center min-h-[100px] gap-[20px] p-[10px] border-[1px] border-gray-300"
      >
        <a-image
          :width="200"
          :height="300"
          :src="item.image?.cloudinary_url || item.image?.path"
        />

        <router-link
          :to="`/detail-appointment/${item.id}`"
          class="cursor-pointer font-bold hover:bg-transparent"
        >
          BS {{ item.name }}
        </router-link>

        <div v-if="item.short_description">
          <div
            v-html="item.short_description"
            class="capitalize line-clamp-3"
          ></div>
        </div>
        <div v-else class="text-gray-400 italic">No data</div>
      </div>

      <!-- Nút Xem thêm / Thu gọn -->
      <div
        v-if="filteredData.length > itemsPerRow * rowsToShow"
        class="w-full flex justify-center mt-4"
      >
        <button
          @click="toggleShowAll"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ showAll ? "Thu gọn" : "Xem thêm" }}
        </button>
      </div>
    </div>
  </a-flex>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Modal } from "ant-design-vue";
import axios from "axios";

const doctors = ref([]);
const specialties = ref([]);
const search = ref("");
const selectedSpecialty = ref(null);
const showAll = ref(false);

const itemsPerRow = 4;
const rowsToShow = 2;

const fetchData = async () => {
  const modalWait = Modal.info({
    title: "Đang tải thông tin bác sĩ.",
    content: "Vui lòng chờ trong giây lát",
    okButtonProps: { disabled: true },
  });

  try {
    const [resDoctors, resSpecialties] = await Promise.all([
      axios.get(
        `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/getDataAllDoctor`
      ),
      axios.get(
        `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/getDataAllSpecialties`
      ),
    ]);

    if (resDoctors.data.status === 1) doctors.value = resDoctors.data.data;
    else
      Modal.error({
        title: "Lỗi lấy bác sĩ",
        content: resDoctors.data.message,
      });

    if (resSpecialties.data.status === 1)
      specialties.value = resSpecialties.data.specialties;
    else
      Modal.error({
        title: "Lỗi lấy chuyên khoa",
        content: resSpecialties.data.message,
      });
  } catch (e) {
    Modal.error({ title: "Xảy ra lỗi", content: e.message });
  } finally {
    modalWait.destroy();
  }
};

onMounted(fetchData);

const filteredData = computed(() => {
  return doctors.value.filter((d) => {
    const matchesName = d.name
      .toLowerCase()
      .includes(search.value.toLowerCase());
    const matchesSpec = selectedSpecialty.value
      ? d.specialties_id === selectedSpecialty.value
      : true;
    return matchesName && matchesSpec;
  });
});

const filteredDataLimited = computed(() => {
  if (showAll.value) return filteredData.value;
  return filteredData.value.slice(0, itemsPerRow * rowsToShow);
});

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const btnClearFilter = () => {
  search.value = "";
  selectedSpecialty.value = null;
  showAll.value = false;
};

watch([search, selectedSpecialty], () => {
  showAll.value = false;
});
</script>
