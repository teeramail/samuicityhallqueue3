<template>
  <div>
    <div v-for="item in filteredUsers" :key="item._id" style="margin-top: 25%;">
        <v-row class="text-center">
          <v-col cols="12" class="my-5">
            <div class="display-1 ">{{ item.numbershow }}</div> 
          </v-col>
        </v-row>
        <v-card-text>{{ item.nameservice }}</v-card-text>
    </div>
    <button @click="printContent" class="btn btn-primary">PrintA</button>
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

template {
   border-bottom: none;
}

.number-show-container {
  position: relative;
  top: 25%;
}

@media print {
            /* Style the content to be printed */
            .print-section {
                font-size: 12px;
                font-family: Arial;
            }
        }
</style>

