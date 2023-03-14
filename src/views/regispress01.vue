<template>

  <div class="print-container">
    <div class="images-container">
      <div id="printimagel1">
        <v-col cols="12" class="d-flex justify-center">
          <v-img src="@/assets/images/teacherscoqr.png" width="200" max-width="4cm" max-height="4cm"></v-img>
        </v-col>
      </div>
      

      <div id="printimagel2">
        <v-col cols="12" class="d-flex justify-center">
          <v-img src="@/assets/logosurat.png" width="200" max-width="4cm" max-height="4cm"></v-img>
        </v-col>
      </div>
    </div>
    <div style="text-align: center;"><h3>สแกนคิวอาร์โค้ดดูคิวได้ที่นี่</h3></div>
    <div><img id="qrcode" src="@/assets/images/teacherscoqr.png"> </div>


    <div class="print-section-container">
      <div class="print-section" v-for="item in filteredUsers" :key="item._id" style="margin-top: 5%;">
        <v-row class="text-center">
          <v-col cols="12">
            <div id="printmobile"><h2>ใช้มือถือถ่ายคิว</h2></div>
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="12" class="my-5">
            <div id="printnumber" class="display-1 bigger-text">{{ item.numbershow }}</div>
          </v-col>
        </v-row>



        <v-row class="text-center" v-for="item in filtereCombines" :key="item._id">
          <v-col cols="12" class="my-5">
            {{ currentDateTimeA }}คิว{{ item.difference }}
          </v-col>
        </v-row>

      </div>

      <v-row justify="center" align="center">
      <h1>&nbsp;&nbsp;</h1>
  </v-row>

  <v-row justify="center" align="center">
      <h1>&nbsp;&nbsp;</h1>
  </v-row>

      <!-- <v-row class="justify-center">
          <v-btn @click="printContent" id="printpagebutton" class="big-button1">หรือกดที่นี่เพื่อพิมพ์</v-btn>
      </v-row> -->

      <v-row justify="center" align="center">
      <h1>&nbsp;&nbsp;</h1>
  </v-row>

  <v-row justify="center" align="center">
      <h1>&nbsp;&nbsp;</h1>
  </v-row>

  <v-row justify="center" align="center">
      <h1>&nbsp;&nbsp;</h1>
  </v-row>

      <v-row class="justify-center">
        <v-btn v-on:click="navigateToAbout()" id="aboutback" class="big-button2">กลับเมนูหลัก</v-btn>
      </v-row>

    </div>
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
       // const labelshow = ref({});
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
          await increment();
          const rescomb = await axios.get("https://koh-samui.com:50200/combine-record");
          combines.value = rescomb.data;
          // window.print();
        });


        setTimeout(() => {
        router.push({ name: 'about' })
        }, 3000)

        function increment() {
          axios.put("https://koh-samui.com:50200/regisshow", {
              idshow: route.params.idshow
          }).then(() => {
              axios.get("https://koh-samui.com:50200/regisshow")
                  .then(res => {
                      users.value = res.data;
                      setTimeout(() => {
                      window.print();
                      }, 1200); // Delay the print by 1 second (1000ms)
                      });

          }).catch(error => {
              console.error(error);
          });
        }

        // function printContent() {
        //     window.print();
        // }

        function navigateToAbout() { 
        clearTimeout(timeoutId);     
        router.push({ name: 'about' })
        }

</script>


<style scoped>


  /* General styles for the template */
  template {
    border-bottom: none;
  }
  
  .my-5 {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .images-container {
    display: flex;
    flex-direction: column;
  }
  
  #qrcode {
  display: none;
}

  #printimagel2 {
    order: 1;
  }

  #printimagel1 {
    order: 2;
  }

  .print-section-container {
    position: relative;
    top: 5%;
  }

  .bigger-text {
    font-size: 9em;
  }


  .big-button1 {
  font-size: 70px;
  padding: 70px 80px;
  line-height: 95px;
  display: flex;
  align-items: center;
}
  .big-button2 {
  font-size: 60px;
  padding: 60px 70px;
  line-height: 75px;
  display: flex;
  align-items: center;
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
      max-width: 4.2cm
    }
  
    .center-elements {
      display: flex;
      justify-content: center;
    }

    #qrcode {
    display: block;
    width: 4cm; /* adjust the width as needed */
    height: auto;
  }

    /* Hide the print button */
    #printpagebutton {
      display: none;
    }

    #printimagel2 {
      display: block;
      margin: 0 auto;
      float: left;
      width: 4cm;
      height: auto;
    }

    #printimagel1
    {
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






