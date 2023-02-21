<template>
  <div class="center-elements">
    <div class="print-section" v-for="item in filteredUsers" :key="item._id" style="margin-top: 5%;">
      
      <v-col cols="12" class="d-flex justify-center">
    <v-img src="@/assets/logosurat.png" width="200" max-width="10%" max-height="10%"></v-img>
  </v-col>
      
      
      <v-row class="text-center">
        <v-col cols="12" >
          <div id="printmobile" ><h2>ใช้มือถือถ่ายคิว</h2></div> 
        </v-col>
      </v-row>

      <v-row class="text-center">
        <v-col cols="12" class="my-5">
          <div id="printnumber" class="display-1 bigger-text">{{ item.ab }}{{ item.numbershow }}</div> 
        </v-col>
      </v-row>

      <v-row class="text-center">
        <v-col cols="12" class="my-5">
         <v-card-text >{{ item.nameservice }}</v-card-text>
        </v-col>
      </v-row>

      <v-row class="text-center"  v-for="item in filtereCombines" :key="item._id">
        <v-col cols="12" class="my-5">
          {{ currentDateTimeA }} คิว {{ item.difference }}
        </v-col>
      </v-row>
     
    </div>

    <v-row class="text-center">
      <v-col cols="12">
        <button @click="printContent" id="printpagebutton" class="btn btn-primary">หรือกดที่นี่เพื่อพิมพ์</button> 
      </v-col>
    </v-row>

    <v-row class="justify-center">
    <v-btn v-on:click="navigateToAbout()" id="aboutback" class="spaced-btn">กลับเมนูหลัก</v-btn>
    </v-row>

  </div>
</template>
 

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router'
import router from "@/router"

const route = useRoute()
const users = ref([]);
const combines = ref([]);
const currentDateTimeA = ref([]);
let timeoutId;


const filteredUsers = computed(() => {
    return users.value.filter(item => item.idshow === parseInt(route.params.idshow));
});
const filtereCombines = computed(() => {
    return combines.value.filter(item => item.idshow === parseInt(route.params.idshow));
});

onMounted(async () => {
  timeoutId = setTimeout(() => {
router.push({ name: 'about' });
}, 30000);

const date = new Date();
const day = date.getDate().toString().padStart(2, '0');
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const hours = date.getHours().toString().padStart(2, '0');
const minutes = date.getMinutes().toString().padStart(2, '0');
currentDateTimeA.value = `${day}/${month}/ ${hours}:${minutes}`;

const res = await axios.get("https://koh-samui.com:50200/regisshow");
users.value = res.data;
increment();
const rescomb = await axios.get("https://koh-samui.com:50200/combine-record");
combines.value = rescomb.data

});

setTimeout(() => {
router.push({ name: 'about' })
}, 30000)

function increment() {
  console.log(`labelshow id: ${route.params.idshow}`);
  axios.put("https://koh-samui.com:50200/regisshow", {
      idshow: route.params.idshow
  }).then(() => {
  axios.get("https://koh-samui.com:50200/regisshow")
    .then(res => {
    users.value = res.data;
    });
  }).catch(error => {
      console.error(error);
  });
}
function printContent() {
    window.print();
}
function navigateToAbout() { 
clearTimeout(timeoutId);     
router.push({ name: 'about' })
}


</script>


<style>
  /* General styles for the template */
  template {
    border-bottom: none;
  }
  
  .my-5 {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .number-show-container {
    position: relative;
    top: 5%;
  }

  .bigger-text {
  font-size: 9em;
  }

  /* Styles for when the content is printed */
  @media print {
    /* Style the content to be printed */
    .print-section {
      font-size: 30px;
      font-family: Arial;
    }
    
    .print-section {
    font-size: 20px; /* smaller font size */
  }
  
    .center-elements {
    display: flex;
    justify-content: center;
    }

    /* Hide the print button */
    #printpagebutton {
      display: none;
    }

    #printmobile {
      display: none;
    }
    #aboutback {
      display: none;
    } 
    #printnumber {
      font-size: 70px;
      font-family: Arial;
    }
    /* Add page break after the print button and v-card-text */
    #printpagebutton, .print-section v-card-text {
      page-break-after: always;
    }
  }
</style>





