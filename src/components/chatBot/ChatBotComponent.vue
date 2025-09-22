<template>
  <div class="p-5">
    <div class="p-5 border border-gray-400 rounded-lg">
      <h2 class="text-xl font-bold mb-4 text-green-600">Hỏi Chatbot</h2>
      <a-flex vertical class="gap-4">
        <a-flex>
          <input
            v-model="findQuestion"
            placeholder="Nhập sản phẩm cần tìm"
            class="border p-2 w-full"
            @keyup.enter="handleEnter('find', $event)"
            :disabled="loadingFind"
          />
          <button
            @click="askChatbot('find')"
            class="bg-green-500 text-white px-4 py-2 w-[150px] whitespace-nowrap"
            :disabled="loadingFind"
          >
            {{ loadingFind ? "Đang Tìm kiếm..." : "Tìm kiếm" }}
          </button>
        </a-flex>
        <a-flex>
          <input
            v-model="chatQuestion"
            placeholder="Nhập câu hỏi"
            class="border p-2 w-full"
            @keyup.enter="handleEnter('chat', $event)"
            :disabled="loadingChat"
          />
          <button
            @click="askChatbot('chat')"
            class="bg-green-500 text-white px-4 py-2 w-[150px] whitespace-nowrap"
            :disabled="loadingChat"
          >
            {{ loadingChat ? "Đang chat..." : "Chat với AI" }}
          </button>
        </a-flex>
      </a-flex>

      <div
        ref="chatContainer"
        v-if="chatHistory.length"
        class="mt-4 p-4 border rounded-lg bg-gray-100 max-h-80 overflow-y-scroll flex flex-col-reverse"
      >
        <ul>
          <li v-for="(chat, index) in chatHistory" :key="index">
            <div
              v-if="chat.answer !== null"
              class="text-purple-600 whitespace-pre-line capitalize"
            >
              <span class="flex flex-1 justify-end gap-x-1">
                <p class="font-bold">Bạn:</p>
                {{ chat.question }}
              </span>

              <strong>Chatbot:</strong> {{ chat.answer }}
              <div v-for="(item, index) in dataProduct" :key="item.id">
                {{ index + 1 }}.
                <a :href="item.url" target="_blank">{{ item.name }}</a>
                <br />💰 Giá: {{ item.price.toLocaleString() }} VNĐ <br />📦
                Còn: {{ item.stock }} cái
                <p>===================================</p>
              </div>
            </div>
            <p class="text-blue-600 text-end capitalize"></p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import axios from "axios";

const findQuestion = ref("Tìm kiếm ");
const chatQuestion = ref("");
const chatHistory = ref([]);
const chatContainer = ref(null);
const loadingFind = ref(false);
const loadingChat = ref(false);
const dataProduct = ref([]);

const handleEnter = (type, event) => {
  event.preventDefault();
  askChatbot(type);
};

const askChatbot = async (type) => {
  if (
    (type === "find" && loadingFind.value) ||
    (type === "chat" && loadingChat.value)
  ) {
    return;
  }

  let userQuestion =
    type === "find" ? findQuestion.value.trim() : chatQuestion.value.trim();

  if (!userQuestion) {
    alert("Vui lòng nhập câu hỏi!");
    return;
  }

  const newChat = { question: userQuestion, answer: "Đang xử lý..." };
  chatHistory.value.push(newChat);

  if (type === "find") {
    findQuestion.value = "Tìm kiếm ";
    loadingFind.value = true;
  } else {
    chatQuestion.value = "";
    loadingChat.value = true;
  }

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_URL_API_CHATBOT}/chat`,
      { message: userQuestion }
    );

    setTimeout(() => {
      dataProduct.value = data.products;
      newChat.answer = data?.reply || "Không nhận được phản hồi từ chatbot.";
      chatHistory.value = [...chatHistory.value];
    }, 1000);
  } catch (error) {
    console.error("Lỗi khi hỏi chatbot:", error);
    newChat.answer = "Đã xảy ra lỗi!";
  } finally {
    if (type === "find") loadingFind.value = false;
    else loadingChat.value = false;
  }
};

watch(chatHistory, async () => {
  await nextTick(); 
  if (chatContainer.value) {
    chatContainer.value.scrollTop = 0; 
  }
});
</script>
