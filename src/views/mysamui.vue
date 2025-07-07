<template>
    <p>ข้อมูลเป็นปัจจุบันเมื่อ</p>
    <p>{{ currentDateTime }}</p>
    <p>กรุณากด รีเฟรส เมื่อค้องการอับเดทข้อมูล</p>
    <table style="width: 100%;">
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
              <td style="color: isRecentlyUpdated(item.updatedAt) ? 'green' : ''; text-align: center">{{ item.idshow }}</td>
              <td >{{ item.nameservice }}</td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td >{{ item.ab}}{{ item.numbershow }}</td>
            </tr>

          </table>
        </td>

      </tr>
    </table>

    <table>
            <tr>
              <h2>ภาษีที่ดินและสิ่งปลูกสร้าง</h2>
            </tr>
            <tr v-for="item in collection1Data.filter(item => item.idshow === 11)" :key="item._id">
              <td style="text-align: center" >{{ item.ab}}{{ item.numbershow }}</td>
            </tr>

            </table>
          <table>
        <tr>
          <th><h3>ค่าธรรมเนียม/อื่นๆ</h3></th>
        </tr>
        <tr>
          <th><h3>ช่อง 9 คิวที่</h3></th>
        </tr>
              <!-- <tr v-for="item in collection1Data.filter(item => item.idshow === 11)" :key="item._id">
                <div >{{ item.numbershow }}</div>
              </tr> -->
              <tr v-for="item in collection1Data.filter(item => item.idshow === 9)" :key="item._id">
              <td style="text-align: center">
              <div >{{ item.ab}}{{ item.numbershow }}</div>
              </td>
  </tr>
  
      </table>
  
      <table>
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
                <td >{{ item.numbershow }}</td>
              </tr> -->
              <tr v-for="item in collection1Data.filter(item => item.idshow === 10)" :key="item._id">
              <td style="text-align: center" >{{ item.ab}}{{ item.numbershow }}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
 
  </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { API_URLS } from '../config/api.js';
     
    const currentDateTime = ref('');
    const collection1Data = ref([]);
    const collection2Data = ref([]);
  
    const fetchData = async () => {
      console.log('🔗 Fetching data from:', {
        onboardshows: API_URLS.ONBOARDSHOWS,
        onboardlandnums: API_URLS.ONBOARDLANDNUMS
      });
      
      const [collection1Response, collection2Response] = await Promise.all([
        axios.get(API_URLS.ONBOARDSHOWS),
        axios.get(API_URLS.ONBOARDLANDNUMS),
      ]);
      collection1Data.value = collection1Response.data;
      collection2Data.value = collection2Response.data;
      console.log('📊 Data received:', {
        onboardshows: collection1Data.value,
        onboardlandnums: collection2Data.value
      });

    };
  
    onMounted(() => {
      fetchData();
      setInterval(fetchData, 50000);
      const now = new Date();
      currentDateTime.value = now.toString();
  
  
    });
       
  
  </script>
  
  
  
