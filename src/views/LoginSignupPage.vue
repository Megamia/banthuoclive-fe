<template>
  <div class="w-full bg-gray-100 h-full p-7">
    <div
      class="relative h-[530px] flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl"
    >
      <div
        v-show="isSignUp"
        class="w-full px-6 py-8 md:px-8 lg:w-1/2 animate-fade animate-once"
      >
        <p
          class="mt-3 font-bold text-[30px] text-center text-gray-600 dark:text-gray-200"
        >
          Đăng ký
        </p>

        <form
          class="text-left"
          action="#"
          method="POST"
          @submit.prevent="signup"
        >
          <div class="mt-2">
            <label
              class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              for="LoggingEmailAddress"
              >First Name</label
            >
            <input
              type="text"
              name="first_name"
              id="first_name"
              v-model="dataForm.first_name"
              autocomplete="first_name"
              required=""
              class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div class="mt-2">
            <label
              class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              for="LoggingEmailAddress"
              >Email Address</label
            >
            <input
              type="email"
              name="email"
              id="signup_email"
              v-model="dataForm.email"
              autocomplete="email"
              required=""
              class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div class="mt-2">
            <div class="flex space-x-1">
              <label
                class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                for="loggingPassword"
                >Mật khẩu</label
              >
              <p
                v-if="dataForm.password.length < 8"
                class="text-red-500 text-sm mb-1"
              >
                Ít nhất 8 ký tự
              </p>
              <p
                v-else-if="!/[A-Z]/.test(dataForm.password)"
                class="text-red-500 text-sm mb-1"
              >
                Phải có ít nhất 1 chữ in hoa
              </p>
              <p
                v-else-if="!/\d/.test(dataForm.password)"
                class="text-red-500 text-sm mb-1"
              >
                Phải có ít nhất 1 số
              </p>
            </div>

            <input
              type="password"
              name="password"
              id="signup_password"
              v-model="dataForm.password"
              autocomplete="current-password"
              required=""
              class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div class="mt-2">
            <div class="flex space-x-1">
              <label
                class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                for="loggingPassword"
                >Xác thực mật khẩu</label
              >
              <p v-if="!isPasswordConfirmed" class="text-red-500 text-sm mb-2">
                không chính xác.
              </p>
            </div>

            <input
              type="password"
              name="password_confirmation"
              id="signup_password_confirmation"
              v-model="dataForm.password_confirmation"
              autocomplete="password_confirmation"
              required=""
              class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div class="mt-6">
            <button
              type="submit"
              class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              Đăng ký
            </button>
          </div>
        </form>
        <div class="flex items-center justify-between mt-4">
          <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

          <a
            href="#"
            @click="toggleForm"
            class="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline hover:bg-white"
            >hoặc đăng nhập</a
          >

          <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
        </div>
      </div>
      <div
        class="hidden bg-cover lg:block lg:w-1/2 transform transition-transform duration-700 ease-in-out z-10"
        :class="{
          ' translate-x-full absolute w-[200px] h-[550px] left-0 top-0':
            isSignUp,
          '-translate-x-0': isSignIn,
        }"
        style="
          background-image: url('https://images.baodantoc.vn/uploads/2021/Th%C3%A1ng%207/Ng%C3%A0y_29/Thanh/nha-thuoc-ha-noi.jpg');
        "
      ></div>

      <div
        v-show="isSignIn"
        class="w-full px-6 py-8 md:px-8 lg:w-1/2 animate-fade animate-once"
      >
        <p
          class="mt-3 font-bold text-[30px] text-center text-gray-600 dark:text-gray-200"
        >
          Đăng nhập
        </p>

        <form
          class="space-y-6 text-left"
          action="#"
          method="POST"
          @submit.prevent="login"
        >
          <div class="mt-4">
            <label
              class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
              for="LoggingEmailAddress"
              >Địa chỉ Email</label
            >
            <input
              type="email"
              name="email"
              id="email"
              v-model="dataForm.email"
              autocomplete="email"
              required=""
              class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div class="mt-4">
            <div class="flex">
              <label
                class="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
                for="loggingPassword"
                >Mật khẩu</label
              >
            </div>

            <input
              type="password"
              name="password"
              id="password"
              v-model="dataForm.password"
              autocomplete="current-password"
              required=""
              class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div class="flex flex-1 justify-end">
              <a
                href="#"
                tabindex="-1"
                class="text-xs text-gray-500 dark:text-gray-300 hover:underline"
                >Quên mật khẩu?</a
              >
            </div>
          </div>

          <div class="mt-6">
            <button
              type="submit"
              class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <div class="flex items-center justify-between mt-4">
          <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

          <a
            href="#"
            @click="toggleForm"
            class="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline hover:bg-white"
            >Hoặc đăng ký</a
          >

          <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { Modal } from "ant-design-vue";

const router = useRouter();

const dataForm = ref({
  email: "",
  password: "",
  first_name: "",
  password_confirmation: "",
});

const isSignIn = ref(true);
const isSignUp = ref(false);

const isPasswordValid = computed(() => {
  const password = dataForm.value.password;
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
});

const isPasswordConfirmed = computed(
  () => dataForm.value.password === dataForm.value.password_confirmation
);

const toggleForm = () => {
  isSignIn.value = !isSignIn.value;
  isSignUp.value = !isSignUp.value;
};

let lastLoginAttempt = 0;
let isLoggingIn = false;
let retryDelay = 2000;

const login = async () => {
  if (isLoggingIn) return;

  const now = Date.now();
  if (now - lastLoginAttempt < retryDelay) {
    Modal.error({
      title: `Vui lòng thử lại sau ${retryDelay / 1000} giây!`,
    });
    return;
  }

  isLoggingIn = true;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_USER}/login`,
      {
        email: dataForm.value.email,
        password: dataForm.value.password,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200 && response.data?.user) {
      localStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      Modal.success({
        title: "Đăng nhập thành công!",
      });

      retryDelay = 2000;
      const redirect = router.currentRoute.value.query.redirect || "/";
      router.push(redirect);
    } else {
      Modal.error({
        title: "Sai tài khoản hoặc mật khẩu!",
      });
    }
  } catch (error) {
    Modal.error({
      title: error.response?.data?.message || "Đăng nhập thất bại!",
    });

    retryDelay = Math.min(retryDelay * 2, 10000);
  } finally {
    lastLoginAttempt = Date.now();
    isLoggingIn = false;
  }
};

const signup = async () => {
  // console.log(dataForm.value);
  // console.log(`${import.meta.env.VITE_APP_URL_API_USER}/signup`);

  try {
    const dataToPost = {
      email: dataForm.value.email,
      first_name: dataForm.value.first_name,
      password: dataForm.value.password,
    };
    // console.log("dataToPost: ", dataToPost);

    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_USER}/signup`,
      dataToPost
    );
    if (response.data.status === 1) {
      Modal.success({
        title: "Đăng ký thành công!",
      });
      toggleForm();
    }
    return;
  } catch (error) {
    let errorMessage = "Đăng ký failed! Please check your credentials.";
    if (error.response && error.response.data) {
      errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }
    Modal.error({
      title: `${errorMessage}!`,
    });
  }
};
</script>
