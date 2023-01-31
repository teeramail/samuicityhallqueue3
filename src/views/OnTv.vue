<template>
 <table style="width: 100%;">
    <tr>
      <th colspan="2">ภาษีป้ายและที่ดินใช้ช่องบริการเดียวกัน</th>
    </tr>
    <tr>
      <td style="width: 50%;">
        <table>
          <tr>
            <h2>ภาษีป้าย</h2>
          </tr>
          <tr>
            <th>ช่องบริการ</th>
            <th>หมู่</th>
            <th>หมายเลขคิว</th>
          </tr>
          <tr v-for="item in collection1Data.filter(item => item.idshow < 9).sort((a, b) => a.idshow - b.idshow)" :key="item._id">
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.idshow }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.nameservice }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.numbershow }}</td>
          </tr>
        </table>
      </td>
      <td style="width: 50%;">
        <table>
          <tr>
            <th>ช่องบริการ</th>
            <th>หมายเลขคิว</th>
          </tr>
          <tr v-for="item in collection2Data.sort((a, b) => a.idshow - b.idshow)" :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.idshow }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.numbershow }}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <th colspan="2">Part 2</th>
    </tr>
    <tr>
      <td colspan="2">
        <table style="width: 50%;">
          <tr>
            <th>ID Show</th>
            <th>Name Service</th>
            <th>Number Show</th>
          </tr>
          <tr v-for="item in collection1Data.filter(item => item.idshow === 9)" :key="item._id">
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.idshow }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.nameservice }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.numbershow }}</td>
          </tr>
        </table>
      </td>
    </tr>


    <tr>
      <td colspan="2">
        <table style="width: 50%;">
          <tr v-for="item in collection1Data.filter(item => item.idshow === 9)" :key="item._id">
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.idshow }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.nameservice }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.numbershow }}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <table style="width: 50%;">
          <tr v-for="item in collection1Data.filter(item => item.idshow === 10)" :key="item._id">
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.idshow }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.nameservice }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.numbershow }}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <table style="width: 50%;">
          <tr v-for="item in collection1Data.filter(item => item.idshow === 11)" :key="item._id">
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.idshow }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.nameservice }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.numbershow }}</td>
          </tr>
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
