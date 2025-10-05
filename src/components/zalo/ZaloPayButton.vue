<template>
  <button @click="payWithZalo" class="zalopay-btn flex justify-center items-center ">
    <img
      src="https://upload.wikimedia.org/wikipedia/vi/7/77/ZaloPay_Logo.png"
    class="w-[200px] h-[30px]"
      />
  </button>
</template>

<script setup>
import axios from "axios";

const props = defineProps({
  amount: { type: Number, required: true },
  formState: { type: Object, required: true },
});

const payWithZalo = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_URL_API}/zalopay/create-order`,
      { amount: props.amount, app_user: "user_test" }
    );

    const result = res.data.data ?? res.data;
    const orderUrl = result.order_url ?? null;

    if (!orderUrl) {
      console.error("Không có order_url trong response:", res.data);
      return;
    }

    window.open(orderUrl, "_blank");
  } catch (err) {
    console.error("Error create zalo order:", err);
  }
};
</script>

<style scoped>
.zalopay-btn {
  background: transparent;
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(0, 104, 255, 0.3);
  transition: all 0.3s ease;
}

.zalopay-btn:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 104, 255, 0.4);
}

.zalopay-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(0, 104, 255, 0.25);
}
</style>
