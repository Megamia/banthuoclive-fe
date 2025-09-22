<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <header class="flex  items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Demo: Đặt lịch khám</h1>
        <div class="flex items-center gap-3">
          <label class="text-sm text-gray-600">Chuyển sang Admin</label>
          <input type="checkbox" v-model="isAdminView" class="toggle" />
        </div>
      </header>

      <main class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Booking form -->
        <section class="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h2 class="text-lg font-semibold mb-4">1. Chọn thông tin khám</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Chuyên khoa</label
              >
              <select
                v-model="selectedSpecialty"
                class="w-full border rounded p-2"
              >
                <option v-for="s in specialties" :key="s" :value="s">
                  {{ s }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Bác sĩ</label>
              <select
                v-model="selectedDoctorId"
                class="w-full border rounded p-2"
              >
                <option
                  v-for="d in doctorsBySpecialty"
                  :key="d.id"
                  :value="d.id"
                >
                  {{ d.name }} — {{ d.clinic }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Ngày khám</label>
              <input
                type="date"
                v-model="selectedDate"
                class="w-full border rounded p-2"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm text-gray-600 mb-1"
              >Chọn giờ (30 phút)</label
            >
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

          <hr class="my-4" />

          <h3 class="text-lg font-semibold mb-3">2. Thông tin bệnh nhân</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              v-model="patientName"
              placeholder="Họ tên"
              class="p-2 border rounded"
            />
            <input
              v-model="phone"
              placeholder="Số điện thoại"
              class="p-2 border rounded"
            />
            <input
              v-model="email"
              placeholder="Email (không bắt buộc)"
              class="p-2 border rounded"
            />
            <input
              v-model="symptoms"
              placeholder="Mô tả triệu chứng (tùy chọn)"
              class="p-2 border rounded"
            />
          </div>

          <div class="mt-4 flex gap-3">
            <button
              @click="handleBook"
              class="px-4 py-2 bg-green-600 text-white rounded shadow"
            >
              Xác nhận đặt lịch
            </button>
            <button @click="resetForm" class="px-4 py-2 border rounded">
              Làm lại
            </button>
          </div>
        </section>

        <!-- Appointment list -->
        <aside class="bg-white p-6 rounded-2xl shadow-sm">
          <h2 class="text-lg font-semibold mb-3">My Appointments</h2>
          <div class="space-y-3 max-h-[60vh] overflow-y-auto">
            <div v-if="appointments.length === 0" class="text-sm text-gray-500">
              Bạn chưa có lịch hẹn nào.
            </div>

            <div
              v-for="a in appointments"
              :key="a.id"
              class="border rounded p-3"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium">
                    {{ a.specialty }} — {{ a.doctorName }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ prettyDate(a.date) }} • {{ a.time }}
                  </div>
                  <div class="text-sm text-gray-600">{{ a.clinic }}</div>
                  <div class="text-sm mt-2">
                    Bệnh nhân: {{ a.patientName }} • {{ a.phone }}
                  </div>
                </div>
                <div class="text-right">
                  <div
                    :class="[
                      'text-sm font-semibold',
                      a.status === 'Pending'
                        ? 'text-yellow-600'
                        : a.status === 'Confirmed'
                        ? 'text-green-600'
                        : 'text-red-600',
                    ]"
                  >
                    {{ a.status }}
                  </div>
                  <div class="mt-2 flex flex-col gap-2">
                    <a
                      v-if="a.status === 'Confirmed'"
                      :href="toGoogleCalendarUrl(a)"
                      target="_blank"
                      class="text-sm underline"
                      >Thêm vào Google Calendar</a
                    >
                    <button
                      v-if="!isAdminView && a.status === 'Pending'"
                      @click="accept"
                      class="text-sm underline"
                    >
                      Chờ xác nhận
                    </button>
                    <div v-if="isAdminView" class="flex gap-2">
                      <button
                        @click="adminConfirm(a.id)"
                        class="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                      >
                        Xác nhận
                      </button>
                      <button
                        @click="adminCancel(a.id)"
                        class="px-2 py-1 text-sm border rounded"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const specialties = [
  "Nội tổng quát",
  "Tim mạch",
  "Nhi khoa",
  "Da liễu",
  "Sản phụ khoa",
];
const mockDoctors = [
  {
    id: 1,
    name: "TS.BS Nguyễn Văn A",
    specialty: "Nội tổng quát",
    clinic: "Phòng khám A - Q1",
  },
  {
    id: 2,
    name: "ThS.BS Trần Thị B",
    specialty: "Tim mạch",
    clinic: "Bệnh viện B - Q3",
  },
  {
    id: 3,
    name: "BS.CK2 Lê Văn C",
    specialty: "Nhi khoa",
    clinic: "Phòng khám C - Q5",
  },
  {
    id: 4,
    name: "BS. Nguyễn Thị D",
    specialty: "Da liễu",
    clinic: "Phòng khám D - Q4",
  },
];

const selectedSpecialty = ref(specialties[0]);
const selectedDoctorId = ref(mockDoctors[0].id);
const selectedDate = ref(
  new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
);
const selectedTime = ref("09:00");

const patientName = ref("");
const phone = ref("");
const email = ref("");
const symptoms = ref("");

const appointments = ref([]);
const isAdminView = ref(false);

const doctorsBySpecialty = computed(() =>
  mockDoctors.filter((d) => d.specialty === selectedSpecialty.value)
);

function generateTimeSlots(dateStr, doctorId) {
  const base = new Date(dateStr + "T09:00:00");
  const slots = [];
  for (let i = 0; i < 16; i++) {
    const slot = new Date(base.getTime() + i * 30 * 60000);
    const hh = slot.getHours().toString().padStart(2, "0");
    const mm = slot.getMinutes().toString().padStart(2, "0");
    slots.push({ time: `${hh}:${mm}`, available: i % 5 !== 0 });
  }
  return slots;
}

const availableSlots = computed(() =>
  generateTimeSlots(selectedDate.value, selectedDoctorId.value)
);

function resetForm() {
  patientName.value = "";
  phone.value = "";
  email.value = "";
  symptoms.value = "";
  selectedTime.value = "09:00";
}

function handleBook() {
  if (!patientName.value || !phone.value) {
    alert("Vui lòng nhập họ tên và số điện thoại.");
    return;
  }
  const doctor = mockDoctors.find((d) => d.id === selectedDoctorId.value);
  const appointment = {
    id: Date.now(),
    doctorId: doctor.id,
    doctorName: doctor.name,
    clinic: doctor.clinic,
    specialty: doctor.specialty,
    date: selectedDate.value,
    time: selectedTime.value,
    patientName: patientName.value,
    phone: phone.value,
    email: email.value,
    symptoms: symptoms.value,
    status: "Pending",
  };
  appointments.value.unshift(appointment);
  resetForm();
  alert(
    "Đặt lịch thành công — trạng thái: Pending. (Demo: admin phải xác nhận)"
  );
}

function adminConfirm(id) {
  appointments.value = appointments.value.map((a) =>
    a.id === id ? { ...a, status: "Confirmed" } : a
  );
}
function adminCancel(id) {
  appointments.value = appointments.value.map((a) =>
    a.id === id ? { ...a, status: "Cancelled" } : a
  );
}

function prettyDate(dStr) {
  return new Date(dStr + "T00:00:00").toLocaleDateString();
}

function toGoogleCalendarUrl(appointment) {
  const start = new Date(`${appointment.date}T${appointment.time}:00`);
  const end = new Date(start.getTime() + 30 * 60000);
  const pad = (n) => n.toString().padStart(2, "0");
  const toGCalFormat = (dt) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(
      dt.getUTCDate()
    )}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
  const dates = `${toGCalFormat(start)}/${toGCalFormat(end)}`;
  const details = encodeURIComponent(
    `Bác sĩ: ${appointment.doctorName}\nPhòng khám: ${appointment.clinic}\nTriệu chứng: ${appointment.symptoms}`
  );
  const text = encodeURIComponent(
    `Khám: ${appointment.specialty} - ${appointment.doctorName}`
  );
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
}
const accept = () => {
  alert("abc");
};
</script>
