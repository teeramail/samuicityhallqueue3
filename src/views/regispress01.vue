<template>
  <div class="center-elements">
    <div class="print-section" v-for="item in filteredUsers" :key="item._id" style="margin-top: 5%;">
      <v-row class="text-center">
        <v-col cols="12" class="my-5">
          <div id="printnumber" class="display-1 bigger-text">{{ item.numbershow }}</div> 
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
        <button @click="printContent" id="printpagebutton" class="btn btn-primary">Print</button> 
      </v-col>
    </v-row>

    <v-row class="justify-center">
    <v-btn v-on:click="navigateToAbout()" class="spaced-btn">กลับเมนูหลัก</v-btn>
    </v-row>

  </div>
</template>
 

<script>

export default defineComponent({
  import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const users = ref([]);
    const filteredUsers = computed(() => {
        return users.value.filter(item => item.idshow === parseInt(route.params.idshow));
    });

    onMounted(async () => {
        const res = await axios.get("https://koh-samui.com:50100/regisshow");
        users.value = res.data;
        console.log(res);
        console.log(route.params.idshow);
        increment();
    });

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

    let timerId = null;

    function startTimer() {
      timerId = setTimeout(() => {
      router.push({ name: 'about' })
        }, 10000);
    }

    startTimer();

    return {
        users,
        filteredUsers,
        increment,
        navigateToAbout,
        startTimer,
        printContent
    }
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
      font-size: 12px;
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
    
    #printnumber {
      font-size: 35px;
      font-family: Arial;
    }

    

    /* Add page break after the print button and v-card-text */
    #printpagebutton, .print-section v-card-text {
      page-break-after: always;
    }
  }
</style>