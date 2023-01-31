<template>
  <table class="tax-tables">
    <tr>
      <th>ภาษีป้าย</th>
      <th>ภาษีที่ดิน</th>
    </tr>
    <tr>
      <td>
        <table>
          <thead>
            <tr>
              <th>ช่องบริการ</th>
              <th>หมู่</th>
              <th>หมายเลขคิว</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in collection1Data.filter(item => item.idshow < 9).sort((a, b) => a.idshow - b.idshow)" :key="item._id">
              <td :class="{ 'updated': isRecentlyUpdated(item.updatedAt) }">{{ item.idshow }}</td>
              <td :class="{ 'updated': isRecentlyUpdated(item.updatedAt) }">{{ item.nameservice }}</td>
              <td :class="{ 'updated': isRecentlyUpdated(item.updatedAt) }">{{ item.numbershow }}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td>
        <table>
          <thead>
            <tr>
              <th>ช่องบริการ</th>
              <th>หมายเลขคิว</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in collection2Data.sort((a, b) => a.idshow - b.idshow)" :class="{ 'updated': isRecentlyUpdated(item.updatedAt) }">
              <td>{{ item.idshow }}</td>
              <td>{{ item.numbershow }}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
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
