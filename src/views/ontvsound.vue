<template>
  <table style="width: 100%;">
    <tr>
      <th colspan="2">ภาษีป้ายและที่ดินใช้ช่องเดียวกัน</th>
    </tr>
    <tr>
      <td style="width: 50%;">
        <table>
          <tr>
            <h2>ภาษีป้าย</h2>
          </tr>
          <tr>
            <th>ช่อง</th>
            <th>หมู่</th>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <th>คิว</th>
          </tr>

          <tr v-for="item in collection1Data.filter(item => item.idshow < 9).sort((a, b) => a.idshow - b.idshow)" :key="item._id">
             <!-- <td :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.idshow }}</td> -->
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''; text-align: center">{{ item.idshow }}</td>
            <td :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.nameservice }}</td>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.numbershow }}</td>
          </tr>
        </table>
      </td>
      <td style="width: 50%;">
        <table>
          <tr>
            <h2>ภาษีที่ดินและสิ่งปลูกสร้าง</h2>
          </tr>
          <tr>
            <th>ช่อง</th>
            <th style="text-align: right">คิว</th>
          </tr>
          <tr v-for="item in collection2Data.sort((a, b) => a.idshow - b.idshow)" :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">
            <!-- <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.idshow }}</td> -->
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''; text-align: center">{{ item.idshow }}</td>
            <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''">{{ item.numbershow }}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>


  <div style="display: flex;">
  <div style="width: 50%;">
    <table style="width: 100%;">
      <tr>
        <th><h3>แก้ไขข้อมูล</h3></th>
      </tr>
      <tr>
        <th><h3>ช่อง 10 คิวที่</h3></th>
      </tr>
      <tr>
        <td>
          <table style="width: 100%;">
            <!-- <tr v-for="item in collection1Data.filter(item => item.idshow === 10)" :key="item._id">
              <td :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.numbershow }}</td>
            </tr> -->
            <tr v-for="item in collection1Data.filter(item => item.idshow === 10)" :key="item._id">
            <td style="text-align: center" :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.numbershow }}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  <div style="width: 50%;">
    <table style="width: 100%;">
      <tr>
        <th><h3>ค่าธรรมเนียม/อื่นๆ</h3></th>
      </tr>
      <tr>
        <th><h3>ช่อง 11 คิวที่</h3></th>
      </tr>
            <!-- <tr v-for="item in collection1Data.filter(item => item.idshow === 11)" :key="item._id">
              <div :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.numbershow }}</div>
            </tr> -->
            <tr v-for="item in collection1Data.filter(item => item.idshow === 11)" :key="item._id">
            <td style="text-align: center">
            <div :style="{ color: isRecentlyUpdated(item.updatedAt) ? 'green' : '' }">{{ item.numbershow }}</div>
            </td>
</tr>

    </table>
  </div>
</div>

<div>
  <playsound :sounds="sounds" />
  </div>  
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import playsound from './test3.vue'
   
  const sounds = ref(['https://koh-samui.com/sound/9.mp3', 'https://koh-samui.com/sound/2.mp3']); 

  const collection1Data = ref([]);
  const collection2Data = ref([]);
  const mcollection1Data = ref([]);
  const mcollection2Data = ref([]);

  const fetchData = async () => {
    const [collection1Response, collection2Response] = await Promise.all([
      axios.get('https://koh-samui.com:50100/onboardshows'),
      axios.get('https://koh-samui.com:50100/onboardlands'),
    ]);
    collection1Data.value = collection1Response.data;
    collection2Data.value = collection2Response.data;

    const currentTime = new Date().getTime();
    const filteredData1 = collection1Response.data.filter(doc => {
      const updatedTime = new Date(doc.updatedAt).getTime();
      return currentTime - updatedTime < 20 * 1000;
    });
    const filteredData2 = collection2Response.data.filter(doc => {
      const updatedTime = new Date(doc.updatedAt).getTime();
      return currentTime - updatedTime < 20 * 1000;
    });

    mcollection1Data.value = filteredData1;
    mcollection2Data.value = filteredData2;
    console.log(mcollection1Data.value);
    console.log(mcollection2Data.value);

    sounds.value = mcollection1Data.value.map(doc => {
      return `https://koh-samui.com/sound/${doc.soundName}.mp3`;
    });

  };

  onMounted(() => {
    fetchData();
    setInterval(fetchData, 1000);


  });
  
      sounds.value = [ 'https://koh-samui.com/sound/A.mp3',
       'https://koh-samui.com/sound/B.mp3',
       'https://koh-samui.com/sound/C.mp3',
      'https://koh-samui.com/sound/D.mp3',
      'https://koh-samui.com/sound/E.mp3', 
      'https://koh-samui.com/sound/F.mp3',
      'https://koh-samui.com/sound/G.mp3',
      'https://koh-samui.com/sound/H.mp3',
      'https://koh-samui.com/sound/I.mp3',]
        

  const isRecentlyUpdated = (updatedAt) => {
    const updatedTime = new Date(updatedAt);
    return (Date.now() - updatedTime.getTime()) < 15000;
  };
  

</script>


