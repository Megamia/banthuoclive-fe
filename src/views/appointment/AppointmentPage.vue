<template>
  <div class="flex gap-[20px]">
    <div v-for="item in data" :key="item.id">
      <div
        class="flex flex-col min-h-[100px] gap-[20px] p-[10px] border-[1px] border-gray-300"
      >
        <a-image
          :width="200"
          :src="item.image?.cloudinary_url || item.image?.path"
        />

        <div>
          <router-link
            :to="`/detail-appointment/${item.id}`"
            class="cursor-pointer hover:bg-transparent  hover:font-bold"
          >
            {{ item.name }}
          </router-link>
        </div>

        <div
          v-if="item.short_description"
          v-html="item.short_description"
          class="capitalize"
        ></div>
        <div v-else class="text-gray-400 italic">No data</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const data = ref([]);

const fetchData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/getAllDoctor`
    );
    if (response.data.status === 1) {
      data.value = response.data.data;
    } else {
      Modal.error({
        title: "Xảy ra lỗi khi lấy thông tin các bác sĩ",
        content: `${response.data.message}`,
      });
    }
  } catch (e) {
    console.log("error: ", e);
  }
};
onMounted(() => {
  fetchData();
});
</script>

<style scoped></style>
