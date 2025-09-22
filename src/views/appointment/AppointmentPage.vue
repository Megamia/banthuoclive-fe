<template>
  <a-flex class="gap-[30px] flex-col">
    <a-flex class="gap-[20px]">
      <div class="flex flex-col gap-[10px]">
        <span>Chuyên khoa</span>
        <a-select
          v-model:value="ChooseSpecialties"
          class="w-[100px] min-w-[100%] max-w-[150px]"
          @change="handleChangeSpecialties"
        >
          <a-select-option
            v-for="spec in specialties"
            :key="spec.id"
            :value="spec.id"
          >
            {{ spec.name }}
          </a-select-option>
        </a-select>
      </div>
      <div class="flex flex-col gap-[10px]">
        <span>Bác sĩ</span>
        <a-select
          v-model:value="ChooseDoctors"
          class="w-[100px] min-w-[100%] max-w-[150px]"
          @change="handleChangeDoctors"
        >
          <a-select-option v-for="doc in doctors" :key="doc.id" :value="doc.id">
            {{ doc.name }}
          </a-select-option>
        </a-select>
      </div>
    </a-flex>

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
    <div>
      <button @click="handleCreateAppointment">Đặt lịch</button>
    </div>
  </a-flex>
</template>

<script setup>
import { computed, ref } from "vue";
import axios from "axios";
import { Modal } from "ant-design-vue";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const specialties = ref([]);
const doctors = ref([]);
const schedules = ref([]);

const ChooseSpecialties = ref(null);
const ChooseDoctors = ref(null);

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

const handleCreateAppointment = async () => {
  const dataUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const meetingDateTime = dayjs(
    selectedDate.value.date + " " + selectedTime.value,
    "DD/MM/YYYY HH:mm"
  ).format("YYYY-MM-DD HH:mm:ss");
  if (!ChooseSpecialties.value) {
    Modal.error({
      title: "Đặt lịch thất bại!",
      content: "Vui lòng chọn chuyên khoa bạn muốn khám.",
    });
    return;
  }
  if (!ChooseDoctors.value) {
    Modal.error({
      title: "Đặt lịch thất bại!",
      content: "Vui lòng chọn bác sĩ bạn muốn khám.",
    });
    return;
  }
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

  const dataDoctor = doctors.value.find((d) => d.id === ChooseDoctors.value);
  const nameSpecialty = specialties.value.find(
    (s) => s.id === ChooseSpecialties.value
  );
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
    doctor_id: dataDoctor.id,
    meeting_time: meetingDateTime,
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/createAppointment`,
      {
        data: dataToCreateNewAppointment,
      }
    );
    console.log(response.data);

    if (response.data.status === 1) {
      const dataAppointment = response.data.data;
      Modal.success({
        title: "Đặt lịch thành công!",
        content: `Bạn đã đặt lịch với bác sĩ ${dataDoctor.name} chuyên khoa ${nameSpecialty.name}
      vào lúc ${selectedTime.value}, ${selectedDate.value.weekdayLabel} ngày ${selectedDate.value.date} với số thứ tự khám là ${dataAppointment.queue_number}`,
      });
    } else if (response.data.status === 0)
      Modal.error({
        title: "Đặt lịch thất bại!",
        content: `${response.data.message}`,
      });
  } catch (e) {
    console.log("Error: ", e);
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

const fetchDataSpecilaties = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/specialties`
    );
    if (response.data.status === 1) {
      specialties.value = response.data.specialties;
      ChooseSpecialties.value = specialties.value[0]?.id || null;
      if (ChooseSpecialties.value) {
        await fetchDataDoctors();
      }
    }
  } catch (e) {
    console.log("Error: ", e);
  }
};

const fetchDataDoctors = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/specialties/${
        ChooseSpecialties.value
      }/doctors`
    );
    if (response.data.status === 1) {
      doctors.value = response.data.doctors;
      ChooseDoctors.value = doctors.value[0]?.id || null;
      if (ChooseDoctors.value) {
        await fetchDataSchedules();
      }
    } else {
      doctors.value = [];
      ChooseDoctors.value = null;
    }
  } catch (e) {
    console.log("Error: ", e);
  }
};

const fetchDataSchedules = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_APPOINTMENT}/doctors/${
        ChooseDoctors.value
      }/schedules`
    );
    if (response.data.status === 1) {
      schedules.value = response.data.schedules || [];
    } else {
      schedules.value = [];
    }
  } catch (e) {
    console.log("Error: ", e);
  }
};

const handleChangeSpecialties = async () => {
  await fetchDataDoctors();
};
const handleChangeDoctors = async () => {
  await fetchDataSchedules();
};

fetchDataSpecilaties();
</script>
