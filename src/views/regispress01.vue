<template>
    <div>
      <div class="print-section" v-for="item in filteredUsers" :key="item._id" style="margin-top: 25%;">
          <v-row class="text-center">
            <v-col cols="12" class="my-5">
              <div class="display-1 bigger-text">{{ item.numbershow }}</div> 
            </v-col>
          </v-row>
          <v-card-text>{{ item.nameservice }}</v-card-text>
      </div>
      <!-- delete this button -->
      <button @click="printContent" id="printpagebutton" class="btn btn-primary">Print</button> 

    </div>
  </template>

  
  

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router'

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
        return {
            users,
            filteredUsers,
            labelshow,
            increment,
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
    top: 25%;
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

    /* Hide the print button */
    #printpagebutton {
      display: none;
    }

    /* Add page break after the print button and v-card-text */
    #printpagebutton, .print-section v-card-text {
      page-break-after: always;
    }
  }
</style>





