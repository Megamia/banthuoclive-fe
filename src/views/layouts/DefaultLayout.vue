<template>
  <!-- eslint-disable vue/no-v-model-argument -->
  <div>
    <a-flex
      class="justify-center bg-[#007BFF] sticky top-0 z-50 border-b-[1px] border-white"
      v-if="!isHidden"
    >
      <HeaderComponent />
    </a-flex>
    <main
      class="flex flex-col flex-1 gap-[100px] items-center mb-[50px] container p-0"
    >
      <slot></slot>
    </main>
    <button
      class="group fixed top-[70%] right-[2%] z-[90] bg-red-600 rounded-full border border-gray-600 flex items-center overflow-hidden transition-all duration-300 w-[50px] hover:w-[160px]"
      @click="hanldeOpenChatBot"
    >
      <div
        class="w-[50px] h-[50px] flex items-center justify-center text-white text-[28px] shrink-0"
      >
        🤖
      </div>

      <span
        class="ml-2 whitespace-nowrap text-white text-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        ChatBot
      </span>
    </button>

    <div
      class="fixed top-[85%] right-[2%] bg-[#2268DE] isolate z-[9999] p-2 rounded-lg border-[1px] border-gray-600"
    >
      <button
        class="text-[30px] text-white max-md:text-[20px]"
        @click="hanldeHiddenHeader"
      >
        {{ isHidden ? "Hiện header" : "Ẩn header" }}
      </button>
    </div>
    <a-modal v-model:open="openChat" @ok="handleOk" :style="{ top: '50px' }">
      <ChatBotComponent />
    </a-modal>
    <a-flex class="justify-center bg-[#EAEBF4] bottom-0">
      <FooterComponent />
    </a-flex>
  </div>
  <!-- eslint-disable vue/no-v-model-argument -->
</template>

<script setup>
import ChatBotComponent from "@/components/chatBot/ChatBotComponent.vue";
import FooterComponent from "@/components/home/FooterComponent.vue";
import HeaderComponent from "@/components/home/HeaderComponent.vue";
import { ref } from "vue";

const openChat = ref(false);
const isHidden = ref(false);
const hanldeOpenChatBot = () => {
  openChat.value = true;
};

const hanldeHiddenHeader = () => {
  isHidden.value = !isHidden.value;
};
const handleOk = () => {
  openChat.value = false;
};
</script>

<style>
.container {
  --bs-gutter-x: 1.5rem !important;
  --bs-gutter-y: 0 !important;
  width: 100% !important;
  padding-right: calc(var(--bs-gutter-x) * 0.5) !important;
  padding-left: calc(var(--bs-gutter-x) * 0.5) !important;
  margin-right: auto !important;
  margin-left: auto !important;
}

@media (min-width: 0) {
  .container {
    max-width: 576px !important;
  }
}

@media (min-width: 576px) {
  .container {
    max-width: 720px !important;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 960px !important;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 1140px !important;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1320px !important;
  }
}

@media (min-width: 1400px) {
  .container {
    max-width: 1440px !important;
  }
}
</style>
