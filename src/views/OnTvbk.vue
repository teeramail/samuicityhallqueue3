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
             <!-- <td >{{ item.idshow }}</td> -->
            <td >{{ item.idshow }}</td>
            <td >{{ item.nameservice }}</td>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td >{{ item.numbershow }}</td>
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
          <tr v-for="item in collection2Data.sort((a, b) => a.idshow - b.idshow)" >
            <td >{{ item.idshow }}</td>
            <td >{{ item.numbershow }}</td>
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
         
            <tr v-for="item in collection1Data.filter(item => item.idshow === 10)" :key="item._id">
            <td style="text-align: center" >{{ item.numbershow }}</td>
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
              <div >{{ item.numbershow }}</div>
            </tr> -->
            <tr v-for="item in collection1Data.filter(item => item.idshow === 11)" :key="item._id">
            <td style="text-align: center">
            <div >{{ item.numbershow }}</div>
            </td>
</tr>

    </table>
  </div>
</div>


</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
   

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
  

        


</script>


