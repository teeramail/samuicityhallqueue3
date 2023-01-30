<template>
    <input type="text" v-model="idFilter" placeholder="Filter by id (separate by comma)">
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
  
    export default defineComponent({
      setup() {
        const users = ref([]);
        const labelshow = ref({});
        onMounted(async () => {
          const res = await axios.get("https://koh-samui.com:50100/onboardlands");
          users.value = res.data;
          console.log(res);
        });
  


        function increment(item) {
       axios.put("https://koh-samui.com:50100/onboardlandnums", {
        idshow: item.idshow
    }).then(() => {
        axios.get("https://koh-samui.com:50100/onboardlands")
        .then(res => {
            users.value = res.data;
        });
    }).catch(error => {
        console.error(error);
    });

  }

    const filteredUsers = computed(() => {
  if (!idFilter.value) return users.value;
  
  const idArr = idFilter.value.split(',')
    .map(id => {
      const numId = Number(id);
      return isNaN(numId) ? id : numId;
    });
  return users.value.filter(user => idArr.includes(user.idshow));
});  

      
  
        return {
          users,
          labelshow,
          filteredUsers,
          increment
        }
      }
    });
  </script>
  