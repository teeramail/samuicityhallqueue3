<template>
  <div class="center">
    <ul>
      <li v-for="item in filteredItems" :key="item._id">กำลังให้บริการ คิวที่ {{ item.numbershow }}</li>
      <li><v-btn @click="fetchItems">คลิกเพื่ออัปเดทล่าสุด</v-btn></li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const items = ref([]);

const fetchItems = async () => {
  const response = await axios.get('https://koh-samui.com:50200/onboardshows');
  items.value = response.data;
};

onMounted(() => {
  fetchItems();
  setInterval(fetchItems, 3900);
});

const sortedItems = computed(() => {
  return items.value.sort((a, b) => a.idshow - b.idshow);
});

const filteredItems = computed(() => {
  return sortedItems.value.filter((item) => item.idshow === 1);
});
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  font-size: 1.5rem;
  margin: 0.5rem;
}
</style>
