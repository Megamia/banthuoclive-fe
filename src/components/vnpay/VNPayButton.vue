<template>
  <button
    @click="payWithVnpay"
    class="vnpay-btn flex justify-center items-center"
  >
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSutP9weqAPNNrV0V616bloZn2fwAdAOHqnFQ&s"
      class="w-[120px] h-[35px]"
      alt="VNPAY"
    />
  </button>
</template>

<script setup>
import axios from "axios";

const props = defineProps({
  amount: { type: Number, required: true },
  formState: { type: Object, required: true },
});

const payWithVnpay = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_URL_API}/vnpay/create-order`,
      {
        amount: props.amount,
        orderInfo: "Thanh toán đơn hàng test",
      }
    );

    const payUrl = res.data?.data?.payUrl || res.data?.redirectUrl;

    if (!payUrl) {
      console.error("Không có payUrl trong response:", res.data);
      return;
    }

    window.location.href = payUrl;
  } catch (err) {
    if (err.response) {
      console.error("Error create VNPAY order - response:", {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers,
      });
    } else if (err.request) {
      console.error("Error create VNPAY order - no response:", err.request);
    } else {
      console.error("Error create VNPAY order - setup:", err.message);
    }
  }
};
</script>

<style scoped>
.vnpay-btn {
  background: transparent;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  transition: all 0.3s ease;
}

.vnpay-btn:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
}

.vnpay-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 8px rgba(0, 102, 204, 0.25);
}
</style>
