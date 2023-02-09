<template>
  <div class="center-elements">
    <div class="print-section" v-for="item in filteredUsers" :key="item._id" style="margin-top: 5%;">
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
 

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router'
import router from "@/router"

export default defineComponent({
    setup() {
        const route = useRoute()
        const users = ref([]);
        const labelshow = ref({});
        const filteredUsers = computed(() => {
            return users.value.filter(item => item.idshow === parseInt(route.params.idshow));
        });

        onMounted(async () => {
            const res = await axios.get("https://koh-samui.com:50100/regisshow");
            users.value = res.data;
            increment();
        });


        setTimeout(() => {
        router.push({ name: 'about' })
        }, 30000)


        function increment() {
            console.log(`labelshow id: ${route.params.idshow}`);

            axios.put("https://koh-samui.com:50100/regisshow", {
                idshow: route.params.idshow
            }).then(() => {
                axios.get("https://koh-samui.com:50100/regisshow")
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
        router.push({ name: 'about' })
        }

        return {
            users,
            filteredUsers,
            labelshow,
            increment,
            navigateToAbout,
            printContent
        }
    }
});

</script>


<style>
  /* General styles for the template */
  template {
    border-bottom: none;
  }

  .number-show-container {
    position: relative;
    top: 5%;
  }

  .bigger-text {
  font-size: 10em;
  }

  /* Styles for when the content is printed */
  @media print {
    /* Style the content to be printed */
    .print-section {
      font-size: 30px;
      font-family: Arial;
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





