<template>
  <div style="display: flex; width: 100%;">
    <ul style="width: 50%;">
      <li v-for="item in collection1Data.filter(item => item.idshow < 9).sort((a, b) => a.idshow - b.idshow)" :key="item._id" :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.idshow }} {{ item.nameservice }}   {{ item.numbershow }}</li>
    </ul>
    <ul style="width: 50%;">
      <li v-for="item in collection2Data.sort((a, b) => a.idshow - b.idshow)" :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.idshow }} {{ item.numbershow }}</li>
    </ul>
  </div>
</template>





<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const collection1Data = ref([]);
    const collection2Data = ref([]);

    const fetchData = async () => {
      const [collection1Response, collection2Response] = await Promise.all([
        axios.get('https://koh-samui.com:50100/onboardshows'),
        axios.get('https://koh-samui.com:50100/onboardlands'),
      ]);
      collection1Data.value = collection1Response.data;
      collection2Data.value = collection2Response.data;
    };

    onMounted(() => {
      fetchData();
      setInterval(fetchData, 1000);
    });

    const isRecentlyUpdated = (updatedAt) => {
      const updatedTime = new Date(updatedAt);
      return (Date.now() - updatedTime.getTime()) < 15000;
    };

    return {
      collection1Data,
      collection2Data,
      isRecentlyUpdated,
    };
  },
};
</script>