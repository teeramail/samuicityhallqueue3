<template>
    <div>
      <ul>
        <li v-for="item in sortedItems" :key="item._id">{{ item.nameservice }} คิวที่ {{ item.ab }}{{ item.numbershow }}</li>
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
  </script>
  