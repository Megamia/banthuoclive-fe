<template>
  <!-- eslint-disable vue/no-v-model-argument -->
  <div
    class="bg-white w-full flex flex-col md:gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]"
  >
    <aside class="py-4 md:w-1/3 lg:w-1/4 md:block">
      <div
        class="sticky flex flex-row max-md:justify-center md:flex-col gap-2 p-4 text-sm md:border-r max-md:border-b border-indigo-100 top-12"
      >
        <h2 class="hidden md:flex pl-3 max-md:mb-4 text-2xl font-semibold">
          Cài đặt
        </h2>
        <button
          href="#"
          class="flex items-center px-3 py-2.5 hover:text-indigo-900 rounded-full"
          :class="
            activePage == 0
              ? 'bg-slate-200 text-indigo-900 font-bold'
              : 'bg-white font-semibold'
          "
          @click="handleChangeActivePage(0)"
        >
          Thông tin tài khoản
        </button>
        <button
          href="#"
          class="flex items-center px-3 py-2.5 hover:text-indigo-900 rounded-full"
          @click="handleChangeActivePage(1)"
          :class="
            activePage == 1
              ? 'bg-slate-200 text-indigo-900 font-bold'
              : 'bg-white font-semibold'
          "
        >
          Đổi mật khẩu
        </button>
        <button
          href="#"
          class="flex items-center px-3 py-2.5 hover:text-indigo-900 rounded-full"
          @click="handleChangeActivePage(2)"
          :class="
            activePage == 2
              ? 'bg-slate-200 text-indigo-900 font-bold'
              : 'bg-white font-semibold'
          "
        >
          Lịch khám của bạn
        </button>
        <button
          href="#"
          class="flex items-center px-3 py-2.5 hover:text-indigo-900 rounded-full"
          @click="handleChangeActivePage(3)"
          :class="
            activePage == 3
              ? 'bg-slate-200 text-indigo-900 font-bold'
              : 'bg-white font-semibold'
          "
        >
          Đơn hàng của bạn
        </button>
      </div>
    </aside>
    <main class="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
      <div class="p-2 md:p-4">
        <div
          v-if="activePage == 0"
          class="w-full px-6 pb-8 md:mt-4 sm:max-w-xl sm:rounded-lg"
        >
          <h2 class="pl-6 text-2xl font-bold sm:text-xl">
            Thông tin tài khoản
          </h2>
          <div class="grid max-w-2xl mx-auto">
            <form @submit.prevent="handleChangeInfo">
              <div class="items-center mt-4 md:mt-8 text-[#202142]">
                <div
                  class="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6"
                >
                  <div class="w-full">
                    <label
                      for="first_name"
                      class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                      >Tên</label
                    >
                    <input
                      type="text"
                      id="first_name"
                      class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="Nhập tên"
                      v-model="profile.first_name"
                      required
                      :disabled="!editMode"
                    />
                  </div>

                  <div class="w-full">
                    <label
                      for="last_name"
                      class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                      >Họ</label
                    >
                    <input
                      type="text"
                      id="last_name"
                      class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="Nhập họ"
                      v-model="profile.last_name"
                      :disabled="!editMode"
                    />
                  </div>
                </div>

                <div class="mb-2 sm:mb-6">
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Email</label
                  >
                  <input
                    type="email"
                    id="email"
                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    v-model="profile.email"
                  />
                </div>
                <div class="mb-2 sm:mb-6">
                  <label
                    for="phone"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Số điện thoại</label
                  >
                  <input
                    type="text"
                    id="phone"
                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    v-model="profile.phone"
                    placeholder="Nhập số điện thoại"
                    @input="validatePhone"
                    :disabled="!editMode"
                  />
                  <p v-if="phoneError" class="text-red-500 text-sm mt-1">
                    {{ phoneError }}
                  </p>
                </div>

                <div class="mb-2 sm:mb-6">
                  <label
                    for="province"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Tỉnh/Thành phố</label
                  >
                  <a-select
                    v-model:value="profile.province"
                    @change="onProvinceChangeByUser"
                    placeholder="Chọn Tỉnh/Thành phố"
                    id="province"
                    :bordered="false"
                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block py-1"
                  >
                    <a-select-option
                      v-for="province in provinces"
                      :key="province.ProvinceID"
                      :value="province.ProvinceID"
                      :disabled="!editMode"
                    >
                      {{ province.ProvinceName }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="mb-2 sm:mb-6">
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Quận/Huyện</label
                  >
                  <a-select
                    v-model:value="profile.district"
                    @change="onDistrictChangeByUser"
                    placeholder="Chọn Quận/Huyện"
                    id="district"
                    :bordered="false"
                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block py-1"
                  >
                    <a-select-option
                      v-for="district in districts"
                      :key="district.DistrictID"
                      :value="district.DistrictID"
                      :disabled="!editMode"
                    >
                      {{ district.DistrictName }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="mb-2 sm:mb-6">
                  <label
                    for="subdistrict"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Xã/Phường/Thị trấn</label
                  >
                  <a-select
                    v-model:value="profile.subdistrict"
                    placeholder="Chọn Xã/Phường/Thị trấn"
                    id="subdistrict"
                    :bordered="false"
                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block py-1"
                  >
                    <a-select-option
                      v-for="ward in wards"
                      :key="ward.WardCode"
                      :value="ward.WardCode"
                      :disabled="!editMode"
                    >
                      {{ ward.WardName }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="mb-2 sm:mb-6">
                  <label
                    for="address"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Địa chỉ đường</label
                  >
                  <input
                    type="text"
                    id="address"
                    class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    v-model="profile.address"
                    placeholder="Nhập địa chỉ đường"
                    :disabled="!editMode"
                  />
                </div>
              </div>
              <div
                class="flex flex-col md:flex-row md:justify-end gap-3 mt-[20px]"
              >
                <div v-if="editMode" class="flex justify-end">
                  <button
                    type="submit"
                    class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  >
                    Lưu
                  </button>
                </div>
                <div class="flex justify-end">
                  <button
                    v-if="editMode"
                    @click="handleEditInfo"
                    type="button"
                    class="text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                  >
                    Thoát
                  </button>
                  <button
                    v-else
                    @click="handleEditInfo"
                    type="button"
                    class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  >
                    Cập nhật thông tin
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div
          v-if="activePage == 1"
          class="w-full px-6 pb-8 md:mt-4 sm:max-w-xl sm:rounded-lg"
        >
          <h2 class="pl-6 text-2xl font-bold sm:text-xl">Đổi mật khẩu</h2>
          <div class="grid max-w-2xl mx-auto">
            <form @submit.prevent="handleChangePassword">
              <div class="items-center max-md:mt-4 md:mt-8 text-[#202142]">
                <input
                  type="text"
                  id="username"
                  name="username"
                  autocomplete="username"
                  style="display: none"
                />
                <div class="mb-2 sm:mb-6">
                  <label
                    for="current_password"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Mật khẩu cũ</label
                  >
                  <div class="relative">
                    <input
                      :type="passwordVisibility.old ? 'text' : 'password'"
                      id="current_password"
                      class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      v-model="passwordForm.current_password"
                      placeholder="Nhập mật khẩu cũ..."
                      autocomplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      tabindex="-1"
                      @click="passwordVisibility.old = !passwordVisibility.old"
                      class="absolute inset-y-0 right-2 flex items-center text-indigo-600"
                    >
                      <CdEye
                        class="text-[20px]"
                        v-if="passwordVisibility.old"
                      />
                      <CdEyeClosed class="text-[20px]" v-else />
                    </button>
                  </div>
                </div>
                <div class="mb-2 sm:mb-6">
                  <label
                    for="new_password"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Mật khẩu mới</label
                  >
                  <div class="relative">
                    <input
                      :type="passwordVisibility.new ? 'text' : 'password'"
                      id="new_password"
                      class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      v-model="passwordForm.new_password"
                      placeholder="Nhập mật khẩu mới..."
                      autocomplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      tabindex="-1"
                      @click="passwordVisibility.new = !passwordVisibility.new"
                      class="absolute inset-y-0 right-2 flex items-center text-indigo-600"
                    >
                      <CdEye
                        class="text-[20px]"
                        v-if="passwordVisibility.new"
                      />
                      <CdEyeClosed class="text-[20px]" v-else />
                    </button>
                  </div>
                </div>
                <div class="mb-2 sm:mb-6">
                  <label
                    for="confirm_password"
                    class="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                    >Xác nhận mật khẩu mới</label
                  >
                  <div class="relative">
                    <input
                      :type="passwordVisibility.confirm ? 'text' : 'password'"
                      id="confirm_password"
                      class="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      v-model="passwordForm.confirm_password"
                      placeholder="Nhập lại mật khẩu mới..."
                      autocomplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      tabindex="-1"
                      @click="
                        passwordVisibility.confirm = !passwordVisibility.confirm
                      "
                      class="absolute inset-y-0 right-2 flex items-center text-indigo-600"
                    >
                      <CdEye
                        class="text-[20px]"
                        v-if="passwordVisibility.confirm"
                      />
                      <CdEyeClosed class="text-[20px]" v-else />
                    </button>
                  </div>
                </div>
                <div class="h-[20px]">
                  <p v-if="errorMessage" class="text-red-600">
                    {{ errorMessage }}
                  </p>
                  <p v-if="successMessage" class="text-green-600">
                    {{ successMessage }}
                  </p>
                </div>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div
          v-if="activePage == 2"
          class="w-full px-6 pb-8 md:mt-4 sm:rounded-lg"
        >
          <TableAppointmentComponent />
        </div>
        <div
          v-if="activePage == 3"
          class="w-full px-6 pb-8 md:mt-4 sm:max-w-xl sm:rounded-lg"
        >
          <a-flex vertical>
            <a-flex>
              <a-form
                :model="formState"
                @finish="handleFindOrder"
                class="flex flex-row gap-[30px]"
              >
                <a-form-item
                  label="Code"
                  name="GHN_Code"
                  :rules="[
                    { required: true, message: 'Code không được để trống!' },
                  ]"
                >
                  <a-input v-model:value="formState.GHN_Code" />
                </a-form-item>

                <a-form-item>
                  <a-button type="primary" html-type="submit"
                    >Tìm kiếm</a-button
                  >
                  <a-button @click="closeFind" v-if="isFind" class="ml-[10px]"
                    >Tắt</a-button
                  >
                </a-form-item>
              </a-form>
              <!-- <input
                placeholder="Mã"
                class="border border-black p-2"
                v-model="GHN_Code"
              />
              <button @click="handleFindOrder">Tìm kiếm</button> -->
            </a-flex>
            <a-flex vertical v-if="dataGHN && isFind">
              <p>Thông tin đơn hàng</p>
              <a-flex vertical>
                <span
                  >Người gửi: {{ dataGHN.from_name }} -
                  {{ dataGHN.from_phone }}</span
                >
                <span
                  >Người nhận:
                  {{ dataInfor ? dataInfor.name : "Chưa có thông tin" }} -
                  {{ dataInfor ? dataInfor.phone : "Chưa có thông tin" }}</span
                >
                <span>Tên sản phẩm: {{ dataGHN.content }}</span>
                <span
                  >Địa chỉ:
                  {{
                    dataInfor
                      ? [
                          dataInfor.address || "Lỗi dữ liệu",
                          dataInfor.ward || "Lỗi dữ liệu",
                          dataInfor.district || "Lỗi dữ liệu",
                          dataInfor.province || "Lỗi dữ liệu",
                        ].join(", ")
                      : "Đang tải..."
                  }}
                </span>
                <span
                  >Loại thanh toán:
                  {{
                    dataGHN.payment_type_ids
                      ? formatPaymentType(dataGHN.payment_type_ids[0])
                      : "Chưa có thông tin"
                  }}</span
                >
                <span>Tiền cod: {{ formatCurrency(dataGHN.cod_amount) }}</span>
                <span>Ghi chú: {{ dataGHN.required_note }}</span>
                <span
                  >Thời gian giao hàng dự kiến:
                  {{ formatDate(dataGHN.leadtime) }}
                </span>
                <span>
                  Trạng thái vận chuyển:
                  {{
                    dataInfor
                      ? formatShippingStatus(dataInfor.shipping_status)
                      : "Chưa có thông tin"
                  }}</span
                >
              </a-flex>
            </a-flex>
            <a-flex
              v-else-if="dataOrder && !isFind"
              vertical
              class="gap-[10px]"
            >
              <a-flex
                v-for="(dataOrderItem, index) in dataOrder"
                :key="dataOrderItem.id"
                vertical
                class="gap-[10px]"
              >
                <a-flex class="items-center">
                  <span>
                    Đơn hàng: {{ dataOrderItem.ghn_order_code }} -
                    {{
                      dataOrderItem ? dataOrderItem.name : "Chưa có thông tin"
                    }}
                  </span>

                  <a-button
                    type="link"
                    @click="toggleDetail(index, dataOrderItem.ghn_order_code)"
                  >
                    {{
                      selectedOrderIndex === index
                        ? "Ẩn chi tiết"
                        : "Xem chi tiết"
                    }}
                  </a-button>
                  <a-button
                    class="border border-[gray]"
                    type="link"
                    @click="
                      handleReceived(
                        index,
                        dataOrderItem.order_code,
                        dataOrderItem.id
                      )
                    "
                    :disabled="isReceived[index]"
                  >
                    Đã nhận được hàng
                  </a-button>
                </a-flex>
                <a-flex v-if="selectedOrderIndex === index" vertical>
                  <span
                    >Người gửi: {{ dataGHN.from_name }} -
                    {{ dataGHN.from_phone }}</span
                  >
                  <span>
                    Người nhận:
                    {{ dataGHN ? dataGHN.to_name : "Chưa có thông tin" }}
                    -
                    {{ dataGHN ? dataGHN.to_phone : "Chưa có thông tin" }}
                  </span>
                  <span>Tên sản phẩm: {{ dataGHN.content }}</span>
                  <span>
                    Địa chỉ:
                    {{
                      dataOrderItem
                        ? [
                            dataOrderItem.property.address || "Lỗi dữ liệu",

                            dataOrderItem.wardName || "Lỗi dữ liệu",

                            dataOrderItem.districtName || "Lỗi dữ liệu",

                            dataOrderItem.provinceName || "Lỗi dữ liệu",
                          ].join(", ")
                        : "Đang tải..."
                    }}
                  </span>

                  <span
                    >Loại thanh toán:
                    {{
                      dataGHN.payment_type_ids
                        ? formatPaymentType(dataGHN.payment_type_ids[0])
                        : "Chưa có thông tin"
                    }}</span
                  >
                  <span
                    >Tiền COD: {{ formatCurrency(dataGHN.cod_amount) }}</span
                  >
                  <span>Ghi chú: {{ dataGHN.required_note }}</span>
                  <span
                    >Thời gian giao hàng dự kiến:
                    {{ formatDate(dataGHN.leadtime) }}</span
                  >
                  <span>
                    Trạng thái vận chuyển:
                    {{ formatShippingStatus(dataOrderItem.status_id) }}
                  </span>
                </a-flex>
              </a-flex>
            </a-flex>
            <a-flex vertical v-else>
              <span>Bạn chưa có đơn hàng</span>
            </a-flex>
          </a-flex>
        </div>
      </div>
    </main>
  </div>
  <!-- eslint-disable vue/no-v-model-argument -->
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref,
  resolveDirective,
  watch,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";
import { CdEye, CdEyeClosed } from "@kalimahapps/vue-icons";
import axios from "axios";
import { Modal } from "ant-design-vue";
import TableAppointmentComponent from "@/components/appointment/TableAppointmentComponent.vue";
import {
  getOrderCached,
  saveOrderCached,
  getProvinceCached,
  saveProvinceCached,
  getDistrictsCached,
  saveDistrictsCached,
  getWardsCached,
  saveWardsCached,
} from "@/store/indexedDB";
const router = useRouter();

const districtCache = new Map();
const wardCache = new Map();

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const activePage = ref(0);
const editMode = ref(false);
const GHN_Code = ref("");
const formState = reactive({
  GHN_Code: "",
});
const dataGHN = ref("");
const dataInfor = ref(null);
const dataOrder = ref([]);
const isFind = ref(false);
const isReceived = ref([]);
const selectedOrderIndex = ref(null);
let isUpdatingProvince = false;
let isUpdatingDistrict = false;

const phoneError = ref("");

const getCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const setCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const validatePhoneValue = (value) => {
  if (!value) {
    phoneError.value = "Số điện thoại là bắt buộc.";
    return false;
  }
  const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  if (!regex.test(value)) {
    phoneError.value =
      "Số điện thoại phải bắt đầu bằng 03, 05, 07, 08, 09 và có 10 số.";
    return false;
  }
  phoneError.value = "";
  return true;
};

const validatePhone = (e) => validatePhoneValue(e.target.value);

const toggleDetail = async (index, code) => {
  if (selectedOrderIndex.value === index) {
    selectedOrderIndex.value = null;
    return;
  }

  selectedOrderIndex.value = index;
  isFind.value = false;

  // 👇 check cache trước
  const cachedOrder = await getOrderCached(code);
  if (cachedOrder) {
    dataInfor.value = cachedOrder;
    return; // ❌ KHÔNG gọi GHN
  }

  // chỉ gọi GHN khi chưa có cache
  await find(code);
};

const handleFindOrder = () => {
  if (!formState.GHN_Code.trim()) {
    Modal.error({
      title: "Tìm kiếm thông tin đơn hàng thất bại.",
      content: "Vui lòng nhập mã đơn hàng!",
    });
    return;
  }

  find(formState.GHN_Code);
  isFind.value = true;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handleReceived = async (index, order_code) => {
  Modal.confirm({
    title: "Hành động này sẽ không thể hoàn tác!!",
    content: "Bạn có chắc chắn muốn xác nhận đã nhận đơn hàng?",
    async onOk() {
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_APP_URL_API_ORDER
          }/updateStatusOrder/${order_code}`
        );

        if (response.data.status === 1) {
          isReceived.value[index] = true;
          dataOrder.value[index].status_id = 2;

          Modal.success({
            title: "Xác nhận thành công!",
            content: response.data.message,
          });

          await sleep(1000);
        } else {
          Modal.error({
            title: "Xác nhận thất bại!",
            content: response.data.message || "Có lỗi xảy ra.",
          });
        }
      } catch (error) {
        Modal.error({
          title: "Xác nhận thất bại!",
          content: "Đã xảy ra lỗi khi gửi yêu cầu tới server.",
        });
      }
    },
    onCancel() {
      Modal.info({
        title: "Đã huỷ xác nhận.",
      });
    },
  });
};

const find = async (code) => {
  const modalWait = Modal.info({
    title: "Đang tìm kiếm đơn hàng của bạn...",
    content: "Vui lòng chờ trong giây lát",
    okButtonProps: { disabled: true },
  });

  try {
    const response = await axios.get(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail`,
      {
        params: { order_code: code },
        headers: {
          Token: import.meta.env.VITE_GHN_API_KEY,
        },
      }
    );

    if (response.status !== 200) throw new Error("GHN error");

    dataGHN.value = response.data.data;

    getDataOrder(dataGHN.value.client_order_code);
  } catch (e) {
    Modal.error({
      title: "Không tìm thấy đơn hàng",
      content: `Mã ${code} không tồn tại`,
    });
  } finally {
    await sleep(1500);
    modalWait.destroy();
  }
};

const closeFind = () => {
  isFind.value = false;
};

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN");
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
const formatPaymentType = (value) => {
  if (value === 1) {
    return "Thanh toán trước (online payment)";
  } else if (value === 2) {
    return "Thanh toán khi nhận hàng (COD)";
  } else {
    return "Hình thức thanh toán khác...";
  }
};
const formatShippingStatus = (value) => {
  if (value === 0) {
    return "Chưa giao";
  } else if (value === 1) {
    return "Đang giao hàng";
  } else if (value === 2) {
    // isReceived.value[index] = true;
    return "Giao hàng thành công";
  }
};

const getDataOrder = async (order_code) => {
  const cachedOrder = await getOrderCached(order_code);
  if (cachedOrder) {
    dataInfor.value = cachedOrder;
    return;
  }

  const res = await axios.get(
    `${import.meta.env.VITE_APP_URL_API_ORDER}/getDataOrder/${order_code}`
  );

  if (res.data.status !== 1) return;

  const data = res.data.dataOrder.property;

  let provinceName = await getProvinceCached(data.province);
  if (!provinceName) {
    provinceName = await fetchProvinceNameById(data.province);
    saveProvinceCached(data.province, provinceName);
  }

  let districts = await getDistrictsCached(data.province);
  if (!districts) {
    districts = await getDistrictsByProvinceId(data.province);
    saveDistrictsCached(data.province, districts);
  }

  let wards = await getWardsCached(data.district);
  if (!wards) {
    wards = await getWardsByDistrictId(data.district);
    saveWardsCached(data.district, wards);
  }

  const district = districts.find(
    (d) => String(d.DistrictID) === String(data.district)
  );

  const ward = wards.find(
    (w) => String(w.WardCode) === String(data.subdistrict)
  );

  const finalData = {
    name: data.name,
    phone: data.phone,
    address: data.address,
    province: provinceName,
    district: district?.DistrictName || "",
    ward: ward?.WardName || "",
    shipping_status: res.data.status_id,
  };

  dataInfor.value = finalData;
  saveOrderCached(order_code, finalData);
};

const getAllDataOrder = async (id) => {
  const modalWait = Modal.info({
    title: "Đang tìm kiếm đơn hàng của bạn...",
    content: "Vui lòng chờ trong giây lát",
    okButtonProps: { disabled: true },
  });
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_ORDER}/getAllDataOrder/${id}`
    );

    modalWait.destroy();
    if (response.data.status === 1) {
      dataOrder.value = response.data.allDataOrder;
      isReceived.value = dataOrder.value.map((order) => order.status_id === 2);

      await loadNamesForOrders();
    } else {
      dataOrder.value = null;
    }

    async function loadNamesForOrders() {
      const promises = dataOrder.value.map(async (order) => {
        order.provinceName = await fetchProvinceNameById(
          order.property.province
        );

        const districtsData = await getDistrictsByProvinceId(
          order.property.province
        );
        const district = districtsData.find(
          (d) => d.DistrictID == order.property.district
        );
        order.districtName = district ? district.DistrictName : "";

        const wardsData = await getWardsByDistrictId(order.property.district);
        const ward = wardsData.find(
          (w) => String(w.WardCode) === String(order.property.subdistrict)
        );
        order.wardName = ward ? ward.WardName : "";
      });

      await Promise.all(promises);
    }
  } catch (e) {
    console.log("Error: ", e);
  }
};

const fetchProvinceNameById = (id) => {
  const province = provinces.value.find((p) => p.ProvinceID == id);
  return province ? province.ProvinceName : "";
};

// const fetchSubdistrictNameById = (id) => {
//   const ward = wards.value.find((w) => String(w.WardCode) === String(id));
//   return ward ? ward.WardName : "";
// };

const fetchDistricts = async (provinceId) => {
  if (districtCache.has(provinceId)) {
    return districtCache.get(provinceId);
  }

  const cached = getCache(`ghn_districts_${provinceId}`);
  if (cached) {
    districtCache.set(provinceId, cached);
    return cached;
  }

  const res = await axios.get(
    `${import.meta.env.VITE_APP_URL_API_GHN}/ghn/districts/${provinceId}`
  );

  const data = res.data?.data || [];
  districtCache.set(provinceId, data);
  setCache(`ghn_districts_${provinceId}`, data);

  return data;
};

const fetchWards = async (districtId) => {
  if (wardCache.has(districtId)) {
    return wardCache.get(districtId);
  }

  const cached = getCache(`ghn_wards_${districtId}`);
  if (cached) {
    wardCache.set(districtId, cached);
    return cached;
  }

  const res = await axios.get(
    `${import.meta.env.VITE_APP_URL_API_GHN}/ghn/wards/${districtId}`
  );

  const data = res.data?.data || [];
  wardCache.set(districtId, data);
  setCache(`ghn_wards_${districtId}`, data);

  return data;
};

const getDistrictsByProvinceId = async (provinceId) => {
  if (!provinceId) return [];
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_GHN}/ghn/districts/${provinceId}`
    );
    return response.data.data || [];
  } catch (e) {
    console.error("Failed to fetch districts:", e);
    return [];
  }
};

const getWardsByDistrictId = async (districtId) => {
  if (!districtId) return [];
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_GHN}/ghn/wards/${districtId}`
    );
    return response.data.data || [];
  } catch (e) {
    console.error("Failed to fetch wards:", e);
    return [];
  }
};

const profile = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  province: null,
  district: null,
  subdistrict: null,
  address: "",
});

const errorMessage = ref("");
const successMessage = ref("");

const passwordVisibility = ref({
  old: false,
  new: false,
  confirm: false,
});

const passwordForm = ref({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const handleEditInfo = () => {
  editMode.value = !editMode.value;
};

const handleChangeActivePage = async (value) => {
  activePage.value = value;

  if (activePage.value !== 3) return;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    Modal.error({
      title: "Phiên đăng nhập đã hết hạn",
      content: "Vui lòng đăng nhập lại",
    });
    router.push("/login");
    return;
  }

  const user = JSON.parse(storedUser);
  await getAllDataOrder(user.id);
};

const fetchProvinces = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_URL_API_GHN}/ghn/provinces`
    );
    if (response.data.status === 1) {
      provinces.value = response.data.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch GHN provinces:", error);
  }
};

const onProvinceChangeByUser = async (provinceId) => {
  profile.value.province = provinceId;

  profile.value.district = null;
  profile.value.subdistrict = null;
  wards.value = [];

  districts.value = await fetchDistricts(provinceId);
};

const onDistrictChangeByUser = async (districtId) => {
  profile.value.district = districtId;

  profile.value.subdistrict = null;

  wards.value = await fetchWards(districtId);
};

const fetchProfile = async (storedUser) => {
  if (!storedUser) return;

  const user = JSON.parse(storedUser);

  profile.value = {
    ...profile.value,
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || null,
    address: user?.address || "",
    province: user?.province ? Number(user.province) : null,
    district: user?.district ? Number(user.district) : null,
    subdistrict: user?.subdistrict ? String(user.subdistrict) : null,
  };

  if (profile.value.province) {
    districts.value = await fetchDistricts(profile.value.province);
  }

  if (profile.value.district) {
    wards.value = await fetchWards(profile.value.district);
  }
};

const handleChangeInfo = async () => {
  if (!validatePhoneValue(profile.value.phone)) return;
  const modalWait = Modal.info({
    title: "Đang xử lý yêu cầu của bạn...",
    content: "Vui lòng chờ trong giây lát",
    okButtonProps: { disabled: true },
  });
  try {
    const token = localStorage.getItem("token");

    const payload = {
      ...profile.value,
      province: profile.value.province ? Number(profile.value.province) : null,
      district: profile.value.district ? Number(profile.value.district) : null,
      subdistrict: profile.value.subdistrict
        ? String(profile.value.subdistrict)
        : null,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_USER}/change-info`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    modalWait.destroy();
    if (response.data.status === 1) {
      Modal.success({
        title: `${response.data.message}`,
      });

      handleEditInfo();

      localStorage.setItem("user", JSON.stringify(response.data.newDataUser));
      fetchProfile(localStorage.getItem("user"));
    } else {
      Modal.error({
        title: "Vui lòng đăng nhập để sử dụng dịch vụ!",
      });
      localStorage.clear("user");
      router.push("/login");
    }
  } catch (error) {
    modalWait.destroy();
    console.log("error: ", error);
    // if (error.response && error.response.status === 401) {
    //   Modal.error({
    //     title: "Bạn chưa đăng nhập. Đang chuyển hướng...!",
    //   });
    //   router.push("/login");
    // } else {
    //   console.log(error);
    // }
  }
};

const handleChangePassword = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    Modal.error({
      title: "Lỗi xác thực người dùng",
      content: "Vui lòng đăng nhập để sử dụng dịch vụ",
    });
    return;
  }
  errorMessage.value = "";
  successMessage.value = "";
  const newPassword = passwordForm.value.new_password;
  const confirmPassword = passwordForm.value.confirm_password;

  if (!/[A-Z]/.test(newPassword)) {
    errorMessage.value = "Mật khẩu mới phải có ít nhất 1 chữ cái in hoa.";
    return;
  }

  if (!/[0-9]/.test(newPassword)) {
    errorMessage.value = "Mật khẩu mới phải có ít nhất 1 chữ số.";
    return;
  }

  if (newPassword !== confirmPassword) {
    errorMessage.value = "Mật khẩu mới không khớp.";
    return;
  }
  const modalWait = Modal.info({
    title: "Đang xử lý yêu cầu của bạn...",
    content: "Vui lòng chờ trong giây lát",
    okButtonProps: { disabled: true },
  });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_USER}/change-password`,
      {
        current_password: passwordForm.value.current_password,
        new_password: passwordForm.value.new_password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    modalWait.destroy();
    if (response.data.status === 1 && response.data.code === 200) {
      Modal.success({
        title: "Xác nhận thành công!",
        content: `${response.data.message}`,
      });
      successMessage.value = response.data.message;
      passwordForm.value.current_password = "";
      passwordForm.value.new_password = "";
      passwordForm.value.confirm_password = "";
    } else {
      Modal.error({
        title: "Xác nhận thất bại!",
        content: `${response.data.message}`,
      });
    }
  } catch (error) {
    modalWait.destroy();
    errorMessage.value = "Có lỗi xảy ra! Vui lòng thử lại.";
    console.log(error);
  }
};

onMounted(() => {
  const storedUser = localStorage.getItem("user");

  fetchProvinces();
  fetchProfile(storedUser);
});
</script>

<style scoped>
.text-red-600 {
  color: red;
}
.text-green-600 {
  color: green;
}
</style>
