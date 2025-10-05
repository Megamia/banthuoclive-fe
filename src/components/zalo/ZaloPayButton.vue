<template>
  <button @click="payWithZalo" class="zalopay-btn">
    Thanh toán bằng ZaloPay
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
  background: #0068ff;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.zalopay-btn:hover {
  opacity: 0.95;
}
</style>
