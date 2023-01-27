<template>
  <div v-for="item in filteredUsers" :key="item._id">
    <v-card>
      <v-card-actions class="d-flex justify-center my-25">
        <div class="display-1 text-center">{{ item.numbershow }}</div> 
      </v-card-actions>
      <v-card-text>{{ item.nameservice }}</v-card-text>
    </v-card>
  </div>
</template>

<script>
  import { defineComponent, onMounted, ref, computed } from "vue";
  import axios from "axios";
  import { useRoute } from 'vue-router'
  //import router from "@/router"

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
        console.log( route.params.idshow);
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


      return {
        users,
        filteredUsers,
        labelshow,
        increment
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
</style>

