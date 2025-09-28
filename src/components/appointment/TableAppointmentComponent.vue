<template>
  <a-flex class="flex-1">
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      class="flex flex-1"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'queue_number'">
          {{ record?.queue_number || "null" }}
        </template>
        <template v-else-if="column.dataIndex === 'doctor_name'">
          <router-link
            :to="`/detail-appointment/${record?.doctor_id}`"
            class="hover:bg-transparent"
          >
            {{ record?.doctor_name || "null" }}
          </router-link>
        </template>
        <!-- <template v-else-if="column.dataIndex === 'user_email'">
          {{ record.user_email }}
        </template> -->
        <template v-else-if="column.dataIndex === 'doctor_phone'">
          {{ record?.doctor_phone || "null" }}
        </template>
        <template v-else-if="column.dataIndex === 'location'">
          Phòng {{ record?.clinic_name || "null" }},
          {{ record?.clinic_location || "null" }}
        </template>
        <template v-else-if="column.dataIndex === 'meeting_time'">
          {{ record?.meeting_time || "null" }}
        </template>
      </template>
    </a-table>
  </a-flex>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const columns = [
  {
    title: "Số",
    dataIndex: "queue_number",
    sorter: (a, b) => a.queue_number - b.queue_number,
    width: "10%",
  },
  {
    title: "Tên bác sĩ",
    dataIndex: "doctor_name",
    sorter: (a, b) => a.doctor_name.localeCompare(b.doctor_name),
    // width: "30%",
  },
  //   {
  //     title: "Email dùng đăng ký",
  //     dataIndex: "user_email",
  //     sorter: (a, b) => a.user_email.localeCompare(b.user_email),
  //     // width: "30%",
  //   },
  {
    title: "SĐT bác sĩ",
    dataIndex: "doctor_phone",
    sorter: (a, b) => a.doctor_phone.localeCompare(b.doctor_phone),
    // width: "50%",
  },
  {
    title: "Địa điểm",
    dataIndex: "location",
    // width: "50%",
  },
  {
    title: "Thời gian khám",
    dataIndex: "meeting_time",
    sorter: (a, b) => new Date(a.meeting_time) - new Date(b.meeting_time),
    // width: "30%",
  },
];

const dataSource = ref([]);
const loading = ref(false);
const current = ref(1);
const pageSize = ref(10);

const pagination = computed(() => ({
  total: dataSource.value.length,
  current: current.value,
  pageSize: pageSize.value,
}));

const fetchDataAppointment = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  loading.value = true;
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_URL_API_APPOINTMENT
      }/getDataAppointmentByUserid/${user.id}`
    );
    if (response.data.status === 1 && response.data?.data) {
      dataSource.value = response.data.data || [];
    } else {
      Modal.error({
        title: "Lấy thông tin thất bại!",
        content: `${response.data.message}`,
      });
    }
  } catch (e) {
    console.error("Error: ", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDataAppointment();
});

const handleTableChange = (pagination, filters, sorter) => {
  current.value = pagination.current;
  pageSize.value = pagination.pageSize;
};
</script>

<style scoped>
:deep(.ant-spin-nested-loading) {
  width: 100%;
}
</style>
