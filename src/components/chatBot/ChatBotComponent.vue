<template>
  <div class="p-5">
    <div class="p-5 border border-gray-400 rounded-lg relative">
      <h2 class="text-xl font-bold mb-4 text-green-600">
        Chat & Tìm kiếm sản phẩm
      </h2>

      <div class="flex gap-2 mb-4">
        <input
          v-model="userMessage"
          placeholder="Nhập câu hỏi hoặc tìm sản phẩm (ví dụ: 'tìm vitamin c')"
          class="border p-2 w-full rounded"
          @keyup.enter="askChatbot"
          @keyup.arrow-up="fillLastQuestion"
          :disabled="loading"
        />
        <button
          @click="askChatbot"
          class="bg-green-500 text-white px-4 py-2 rounded whitespace-nowrap"
          :disabled="loading"
        >
          {{ loading ? "Đang xử lý..." : "Gửi" }}
        </button>
      </div>

      <div
        ref="chatContainer"
        v-if="chatHistory.length"
        @scroll="checkScrollPosition"
        class="mt-4 p-4 border rounded-lg bg-gray-100 max-h-80 overflow-y-auto"
      >
        <!-- Nút “↓ Mới nhất” -->
        <transition name="fade">
          <button
            v-if="showScrollButton"
            @click="scrollToBottom"
            class="absolute right-[40%] bottom-[10%] bg-green-600 text-white px-3 py-1 rounded-full shadow hover:bg-green-700 transition"
          >
            ↓ Mới nhất
          </button>
        </transition>

        <ul>
          <li v-for="(chat, index) in chatHistory" :key="index">
            <div class="pb-5">
              <div class="flex justify-end text-purple-600 mb-2">
                <p class="font-bold">Bạn:</p>
                <p class="ml-2">{{ chat.question }}</p>
              </div>

              <div class="text-green-700 whitespace-pre-line">
                <strong>Chatbot:</strong> {{ chat.answer }}
              </div>

              <div
                v-if="chat.products && chat.products.length"
                class="mt-3 text-gray-700"
              >
                <div
                  v-for="(item, i) in chat.products"
                  :key="item.id"
                  class="border-b border-dashed border-gray-300 pb-2 mb-2"
                >
                  {{ i + 1 }}.
                  <router-link
                    :to="`/product/${item.slug}`"
                    class="text-blue-600 hover:underline hover:bg-transparent"
                  >
                    {{ item.name }}
                  </router-link>
                  <br />
                  💰 Giá: {{ item.price.toLocaleString() }} VNĐ <br />
                  📦 Còn: {{ item.stock }} cái
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";

const userMessage = ref("");
const chatHistory = ref([]);
const chatContainer = ref(null);
const loading = ref(false);
const showScrollButton = ref(false);

const askChatbot = async () => {
  if (loading.value) return;

  const message = userMessage.value.trim();
  if (!message) {
    alert("Vui lòng nhập tin nhắn!");
    return;
  }

  const newChat = { question: message, answer: "Đang xử lý...", products: [] };
  chatHistory.value.push(newChat);
  userMessage.value = "";
  loading.value = true;

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_CHATBOT}/chat`,
      { message }
    );

    newChat.answer = data.reply || "Không nhận được phản hồi.";
    newChat.products = data.products || [];
    chatHistory.value = [...chatHistory.value];

    await nextTick();
    checkScrollAfterNewMessage();
  } catch (error) {
    console.error("Lỗi chatbot:", error);
    newChat.answer = "Đã xảy ra lỗi khi gửi tin nhắn!";
  } finally {
    loading.value = false;
  }
};

const fillLastQuestion = () => {
  if (chatHistory.value.length) {
    const lastQuestion =
      chatHistory.value[chatHistory.value.length - 1].question;
    userMessage.value = lastQuestion;
  }
};

const checkScrollPosition = () => {
  const container = chatContainer.value;
  if (!container) return;

  const nearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 50;
  showScrollButton.value = !nearBottom;
};

const checkScrollAfterNewMessage = () => {
  const container = chatContainer.value;
  if (!container) return;

  const nearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 50;
  if (!nearBottom) {
    showScrollButton.value = true;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  const container = chatContainer.value;
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }
  showScrollButton.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
