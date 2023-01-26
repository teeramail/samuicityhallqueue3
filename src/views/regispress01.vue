<template>
  <div v-for="item in filteredUsers" :key="item._id">
    <v-card>
      <v-card-actions>
        <v-btn icon @click="increment(item)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <div>{{ item.numbershow }}</div> 
      </v-card-actions>
      <v-card-text>{{ item.nameservice }}</v-card-text>
    </v-card>
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
        return users.value.filter(item => item.idshow === route.params.idshow.value);
      });
      onMounted(async () => {
        const res = await axios.get("https://koh-samui.com:50100/regisshow");
        users.value = res.data;
        console.log(res);
        console.log( route.params.idshow.value);
      });

      function increment(item) {
        console.log(`labelshow id: ${item.idshow}`);

        axios.put("https://koh-samui.com:50100/regisshow", {
          idshow: item.idshow
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
