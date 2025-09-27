<template>
  <a-flex vertical class="gap-[30px] mt-[30px]">
    <a-flex class="gap-[100px]">
      <a-flex vertical class="gap-[10px] min-w-[300px] items-center">
        <a-image
          :width="200"
          :src="
            doctors?.image?.cloudinary_url ||
            doctors?.image?.path ||
            `https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg`
          "
        />
        <span class="items-center justify-center gap-[5px] text-[20px]">
          Tên bác sĩ:
          <span class="capitalize font-bold">
            {{ doctors?.name }}
          </span>
        </span>
        <span class="items-center justify-center gap-[5px] text-[20px]">
          Kinh nghiệm:
          <span class="capitalize font-bold"> {{ experienceYears }} năm </span>
        </span>
      </a-flex>
      <a-flex vertical class="gap-[30px]">
        <a-flex vertical class="gap-[10px]">
          <div class="section-title">Giới thiệu:</div>
          <div class="section-content">
            <div
              v-if="doctors?.short_description"
              v-html="doctors?.short_description"
              class="capitalize"
            ></div>
            <div v-else class="text-gray-400 italic">No data</div>
          </div>
        </a-flex>

        <a-flex vertical class="gap-[10px]">
          <div class="section-title">Sở trường chuyên môn:</div>
          <div class="section-content">
            <div
              v-if="doctors?.specialty_description"
              v-html="doctors?.specialty_description"
              class="capitalize"
            ></div>
            <div v-else class="text-gray-400 italic">No data</div>
          </div>
        </a-flex>

        <a-flex vertical class="gap-[10px]">
          <div class="section-title">Quá trình công tác:</div>
          <div class="section-content">
            <div
              v-if="doctors?.work_process"
              v-html="doctors?.work_process"
              class="capitalize"
            ></div>
            <div v-else class="text-gray-400 italic">No data</div>
          </div>
        </a-flex>
      </a-flex>
    </a-flex>
    <a-flex vertical class="">
      <a-flex class="gap-[30px]">
        <div
          :style="{
            width: '300px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
          }"
        >
          <a-calendar
            v-model:value="value1"
            :fullscreen="false"
            @panelChange="onPanelChange"
            @change="handleChangeDay"
          />
        </div>
        <div>
          <div class="mt-4">
            <label class="block text-sm text-gray-600 mb-1">
              Chọn giờ (30 phút)
            </label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="s in availableSlots"
                :key="s.time"
                :disabled="!s.available"
                @click="selectedTime = s.time"
                :class="[
                  'p-2 rounded border text-sm',
                  !s.available
                    ? 'opacity-40 cursor-not-allowed'
                    : selectedTime === s.time
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white',
                ]"
              >
                {{ s.time }}
              </button>
            </div>
          </div>
        </div>
      </a-flex>
    </a-flex>
    <div>
      <button @click="handleCreateAppointment">Đặt lịch</button>
    </div>
  </a-flex>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { Modal } from "ant-design-vue";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "./DetailAppointmentPage.css";

dayjs.locale("vi");

const route = useRoute();

const id = route.params.id;
const doctors = ref(null);
const schedules = ref([]);

const selectedTime = ref(null);

const value1 = ref(dayjs());
const selectedDate = ref({
  raw: value1.value.toDate(),
  date: value1.value.format("DD/MM/YYYY"),
  weekday: value1.value.day() === 0 ? 7 : value1.value.day(),
  weekdayLabel: value1.value.format("dddd"),
});

function isAvailable(timeStr) {
  if (!schedules.value.length || !selectedDate.value) return false;

  const [h, m] = timeStr.split(":").map(Number);
  const slotMinutes = h * 60 + m;

  return schedules.value.some((sch) => {
    if (Number(sch.day_of_week) !== selectedDate.value.weekday) return false;

    const [sh, sm] = sch.start_time.split(":").map(Number);
    const startMinutes = sh * 60 + sm;

    const [eh, em] = sch.end_time.split(":").map(Number);
    const endMinutes = eh * 60 + em;

    return slotMinutes >= startMinutes && slotMinutes < endMinutes;
  });
}

function generateTimeSlots() {
  const base = dayjs().hour(9).minute(0).second(0);

  const slots = [];
  for (let i = 0; i < 16; i++) {
    const slot = base.add(i * 30, "minute");
    const timeStr = slot.format("HH:mm");
    slots.push({ time: timeStr, available: isAvailable(timeStr) });
  }
  return slots;
}

const availableSlots = computed(() => generateTimeSlots());

const experienceYears = computed(() => {
  if (!doctors.value?.experience_year) return 0;

  const startYear = dayjs(doctors.value.experience_year).year();
  const currentYear = dayjs().year();

  return currentYear - startYear;
});

const handleCreateAppointment = async () => {
  const dataUser = JSON.parse(localStorage.getItem("user") || "{}");
  const meetingDateTime = dayjs(
    selectedDate.value.date + " " + selectedTime.value,
    "DD/MM/YYYY HH:mm"
  ).format("YYYY-MM-DD HH:mm:ss");
  if (!selectedDate.value) {
    Modal.error({
      title: "Đặt lịch thất bại!",
      content: "Vui lòng chọn thứ bạn muốn khám.",
    });
    return;
  }
  if (!selectedTime.value) {
    Modal.error({
      title: "Đặt lịch thất bại!",
      content: "Vui lòng chọn thời gian bạn muốn khám.",
    });
    return;
  }

  // Modal.success({
  //   title: "Đặt lịch thành công!",
  //   content: `Bạn đã đặt lịch với bác sĩ ${dataDoctor.name} chuyên khoa ${nameSpecialty.name}
  //     vào lúc ${selectedTime.value}, ${selectedDate.value.weekdayLabel} ngày ${selectedDate.value.date}`,
  // });
  // console.log(
  //   "appointment: ",
  //   "\n",
  //   dataDoctor.name,
  //   "\n",
  //   nameSpecialty.name,
  //   "\n",
  //   selectedTime.value,
  //   "\n",
  //   selectedDate.value.weekdayLabel,
  //   "\n",
  //   selectedDate.value.date
  // );
  const dataToCreateNewAppointment = {
    user_id: dataUser.id,
    doctor_id: id,
    meeting_time: meetingDateTime,
  };

  const modalWait = Modal.info({
    title: "Đang xử lý yêu cầu.",
    content: "Vui lòng chờ trong giây lát",
    okButtonProps: { disabled: true },
  });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/createAppointment`,
      {
        data: dataToCreateNewAppointment,
      }
    );
    modalWait.destroy();

    if (response.data.status === 1) {
      const dataAppointment = response.data.data;
      Modal.success({
        title: "Đặt lịch thành công!",
        content: `Bạn đã đặt lịch với bác sĩ ${doctors.value.name} 
      vào lúc ${selectedTime.value}, ${selectedDate.value.weekdayLabel} ngày ${selectedDate.value.date} với số thứ tự khám là ${dataAppointment?.queue_number}`,
      });
    } else if (response.data.status === 0)
      Modal.error({
        title: "Đặt lịch thất bại!",
        content: `${response.data.message}`,
      });
  } catch (e) {
    modalWait.destroy();

    if (e.response) {
      Modal.error({
        title: "Đặt lịch thất bại!",
        content: e.response.data.message || "Có lỗi xảy ra!",
      });
    } else {
      Modal.error({
        title: "Đặt lịch thất bại!",
        content: "Không thể kết nối đến server!",
      });
    }
  }
};
const onPanelChange = (value) => {};
const handleChangeDay = (value) => {
  const date = value.$d;
  selectedDate.value = {
    raw: date,
    date: dayjs(date).format("DD/MM/YYYY"),
    weekday: dayjs(date).day() === 0 ? 7 : dayjs(date).day(),
    weekdayLabel: dayjs(date).format("dddd"),
  };
};

const fetchDataDoctors = async () => {
  const modalWait = Modal.info({
    title: "Đang tải thông tin bác sĩ.",
    content: "Vui lòng chờ trong giây lát",
    okButtonProps: { disabled: true },
  });
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_APP_URL_API_APPOINTMENT
      }/getAllDataDoctorById/${id}`
    );
    if (response.data.status === 1) {
      doctors.value = response.data.data;
      localStorage.setItem("doctor", JSON.stringify(doctors.value));
      await fetchDataSchedules();
    } else {
      Modal.error({
        title: "Xảy ra lỗi khi lấy thông tin các bác sĩ",
        content: `${response.data.message}`,
      });
    }
    modalWait.destroy();
  } catch (e) {
    modalWait.destroy();
    Modal.error({
      title: "Xảy ra lỗi khi lấy thông tin các bác sĩ",
      content: `${response.data.message}`,
    });
    console.log("Error: ", e);
  }
};

const fetchDataSchedules = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/doctors/${id}/schedules`
    );
    if (response.data.status === 1) {
      schedules.value = response.data.data;
    } else {
      Modal.error({
        title: "Xảy ra lỗi khi lấy thông tin lịch làm việc",
        content: `${response.data.message}`,
      });
    }
  } catch (e) {
    console.log("Error: ", e);
  }
};

onMounted(() => {
  fetchDataDoctors();
});
</script>
