<template>
    <div>
      <p v-if="loading">Loading...</p>
      <p v-else-if="error">Error: {{ error }}</p>
      <ul v-else>
        <li v-for="item in data" :key="item.id">{{ item.name }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const data = ref([]);
      const error = ref(null);
      const loading = ref(false);
  
      const fetchData = async () => {
        try {
          loading.value = true;
          const res = await axios.get('https://koh-samui.com:50100/onboardshows');
          data.value = res.data;
        } catch (err) {
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 10000);
        onBeforeUnmount(() => clearInterval(intervalId));
      });
  
  
      return { data, error, loading };
    },
  };
  </script>
  