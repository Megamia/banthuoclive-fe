<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-center font-bold text-[30px]">TÌM KIẾM SẢN PHẨM BẰNG AI</h1>
    <div class="flex flex-1 justify-center text-2xl font-bold">
      ⚠️ Hình ảnh chỉ mang tính chất tham khảo, sản phẩm có thể không đúng.
    </div>
    <div class="flex flex-row gap-[30px]">
      <input type="file" @change="handleFileUpload" class="flex" />
      <button
        @click="ClearAll"
        class="bg-[red] px-2 text-white rounded hover:font-bold"
      >
        Xóa bỏ
      </button>
    </div>
    <!-- <input
      type="text"
      v-model="imageUrl"
      placeholder="Image URL"
      class="border-[1px] p-[5px]"
    /> -->

    <button
      @click="analyzeImage"
      class="bg-[#007BFF] p-[10px] rounded-md text-white text-[20px]"
    >
      Phân tích hình ảnh
    </button>

    <div v-if="error" class="text-red-500">{{ error }}</div>
    <p v-if="isLoading" class="text-blue-500 text-center">
      Đang nhận diện hình ảnh...
    </p>

    <div v-else-if="isAnalyzed">
      <div class="text-[30px] flex flex-col gap-[10px]">
        <h3>
          Tên sản phẩm:
          <span>{{ productNamesWithConfidence }}</span>
        </h3>
      </div>

      <div class="text-[30px] flex flex-col gap-[20px]">
        <div v-if="productsFromDB.length > 0" class="flex flex-col gap-4">
          <h3>Sản phẩm tìm được trong kho:</h3>
          <div class="flex gap-4 flex-wrap overflow-hidden">
            <div
              v-for="product in productsFromDB"
              :key="product.id"
              class="text-center flex-1 border p-4 flex items-center flex-col gap-[10px] min-h-[200px] overflow-hidden"
            >
              <img
                :src="
                  product.image?.cloudinary_url ||
                  product.image?.path ||
                  'https://via.placeholder.com/100'
                "
                class="w-24 h-24 object-cover"
                alt="product image"
              />
              <a
                :href="`product/${product.slug}`"
                class="text-sm font-bold capitalize hover:bg-white hover:text-[#2268DE] nameProduct"
                >{{ product.name }}</a
              >
              <p class="text-sm text-red-500">
                {{ formatCurrency(product.price) }}
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Không tìm thấy sản phẩm trong kho.</p>
        </div>
      </div>

      <button
        @click="fetchTikiProducts(filteredConcepts.map((c) => c.name))"
        class="bg-[#007BFF] text-white p-2 rounded-md mt-5"
      >
        Tìm trên Tiki
      </button>

      <div class="text-[30px] flex flex-col gap-[20px]">
        <div v-if="similarProducts.length > 0" class="flex flex-col">
          <h3 class="mb-[10px]">Sản phẩm tương tự trên Tiki:</h3>
          <div class="flex gap-4 flex-wrap overflow-hidden">
            <div
              v-for="product in similarProducts"
              :key="product.id"
              class="flex flex-col p-4 min-w-[150px] flex-1 min-h-[200px] max-h-[300px] text-center items-center gap-[10px] border"
            >
              <img
                :src="product.imageUrl"
                class="w-24 h-24 object-cover"
                alt="similar product"
              />
              <p class="text-sm font-bold nameProduct">
                {{ product.name }}
              </p>
              <p class="text-sm text-red-500">{{ product.price }}</p>
              <a
                :href="product.link"
                target="_blank"
                class="text-blue-500 whitespace-nowrap text-[20px] hover:bg-[white] hover:underline"
                >Xem trên Tiki</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-else-if="!first_attempt" class="text-gray-500 text-center">
      Chưa nhận diện được sản phẩm này!!
    </p>
  </div>
</template>

<script setup>
import { getDataFromIndexedDB } from "@/store/indexedDB";
import { ref, computed } from "vue";

const imageUrl = ref("");
const result = ref(null);
const similarProducts = ref([]);
const productsFromDB = ref([]);
const isLoading = ref(false);
const isAnalyzed = ref(false);
const error = ref(null);
const first_attempt = ref(true);
const fileInputRef = ref(null);

const ClearAll = () => {
  productsFromDB.value = [];
  result.value = null;
  error.value = null;
  isAnalyzed.value = false;
  isLoading.value = false;
  imageUrl.value = null;

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result.split(",")[1];
    imageUrl.value = `data:${file.type};base64,${base64String}`;
  };
  reader.readAsDataURL(file);
};

const categoryMapping = {
  Vitamin: "vitamin & khoáng chất",
  "cải thiện chức năng tăng cường": "cải thiện tăng cường chức năng",
  "thuốc tiêu hóa gan mật": "thuốc tiêu hoá & gan mật",
  "cơ xương khớp": "cơ-xương-khớp",
  medicine: "Thuốc",
  health: "Sức khỏe",
};

const normalizeText = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const getReliableConcepts = (concepts) => {
  if (!concepts || !concepts.length) return [];

  const sorted = [...concepts].sort((a, b) => b.value - a.value);
  const maxValue = sorted[0].value;

  if (maxValue < 0.15) return [];

  return sorted.filter((c) => c.value >= maxValue * 0.5);
};

const analyzeImage = async () => {
  if (isLoading.value) return; 

  if (!imageUrl.value) {
    error.value = "Vui lòng cung cấp ảnh!";
    return;
  }

  error.value = null;
  isLoading.value = true;
  isAnalyzed.value = true;
  result.value = null;
  productsFromDB.value = [];
  first_attempt.value = false;

  try {
    const dataProduct = await getDataFromIndexedDB("products");

    let clarifaiResponse = await callClarifaiAPI("thuoc");

    if (!clarifaiResponse) {
      throw new Error("Không tìm thấy kết quả từ mô hình!");
    }

    result.value = clarifaiResponse;

    const concepts = result.value.outputs[0].data.concepts;
    const reliableConcepts = getReliableConcepts(concepts);

    const normalizedConcepts = reliableConcepts.map((c) =>
      normalizeText(categoryMapping[c.name] || c.name)
    );

    productsFromDB.value = dataProduct.filter((item) => {
      const categoryName = normalizeText(item.category?.name || "");
      return normalizedConcepts.some((concept) =>
        categoryName.includes(concept)
      );
    });
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const callClarifaiAPI = async (modelId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_API_CLARIFAI}/getDataClarifai`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId,
          imageBase64: imageUrl.value.split(",")[1],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Backend error");
    }

    const data = await response.json();

    if (data.status?.code !== 10000 || !data.outputs?.[0]?.data?.concepts) {
      return null;
    }

    return data;
  } catch (err) {
    console.error(err);
    error.value = "Không thể phân tích ảnh.";
    return null;
  }
};

const filteredConcepts = computed(() => {
  const concepts = result.value?.outputs?.[0]?.data?.concepts || [];
  return getReliableConcepts(concepts);
});

const productNamesWithConfidence = computed(() => {
  if (!filteredConcepts.value.length) return "Không tìm thấy";
  return filteredConcepts.value
    .map((c) => `${c.name} (${(c.value * 100).toFixed(2)}%)`)
    .join(", ");
});

const fetchTikiProducts = async (keywords) => {
  let allProducts = [];

  for (const keyword of keywords) {
    try {
      const response = await fetch(
        `https://tiki.vn/api/v2/products?limit=6&q=${encodeURIComponent(
          keyword
        )}`,
        { method: "GET" }
      );

      if (!response.ok) continue;

      const data = await response.json();
      if (!data?.data) continue;

      allProducts.push(...data.data);
    } catch (err) {
      console.error("Lỗi khi fetch từ khóa:", keyword, err);
      continue;
    }
  }

  const uniqueProducts = Array.from(
    new Map(allProducts.map((p) => [p.id, p])).values()
  );

  const medicineKeywords = [
    "thuốc",
    "viên",
    "capsule",
    "tablet",
    "dược phẩm",
    "medicine",
    "thuoc",
  ];

  const excludedKeywords = [
    "sách",
    "book",
    "guide",
    "textbook",
    "paperback",
    "stories",
    "novel",
  ];

  similarProducts.value = uniqueProducts
    .filter((product) => {
      const name = product.name.toLowerCase();
      const categories =
        product.categories?.map((c) => c.name.toLowerCase()) || [];

      const nameHasMedicine = medicineKeywords.some((kw) => name.includes(kw));
      const categoryHasMedicine = categories.some((cat) =>
        medicineKeywords.some((kw) => cat.includes(kw))
      );

      const isBook = excludedKeywords.some((kw) => name.includes(kw));

      return (nameHasMedicine || categoryHasMedicine) && !isBook;
    })
    .map((product) => ({
      id: product.id,
      imageUrl:
        product.thumbnail_url ||
        "https://img.freepik.com/premium-vector/no-data-concept-illustration_86047-488.jpg",
      name: product.name,
      price:
        typeof product.price === "number"
          ? product.price.toLocaleString() + " VND"
          : "Liên hệ",
      link: `https://tiki.vn/${product.url_path}`,
    }));
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
</script>

<style scoped>
.nameProduct {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 100%;
  max-height: 100px;
}
</style>
