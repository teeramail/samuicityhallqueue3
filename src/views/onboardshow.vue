<template>
  <div>
    <input type="text" v-model="idFilter" placeholder="Filter by idshow (separate by comma)">
    <div v-for="item in filteredUsers" :key="item._id">
      <v-card>
        <v-card-actions>
          <v-btn icon @click="increment(item)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <div>{{ item.numbershow }}</div> 
          <v-btn icon @click="decrement(item)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>{{ item.nameservice }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";

export default defineComponent({
  setup() {
    const users = ref([]);
    const idFilter = ref(''); // added new property
    onMounted(async () => {
      const res = await axios.get("https://koh-samui.com:50100/onboardshows");
      users.value = res.data;
      console.log(res);
    });

    function increment(item) {
      console.log(`labelshow id: ${item.idshow}`);

      axios.put("https://koh-samui.com:50100/onboardshows", {
        idshow: item.idshow
      }).then(() => {
        axios.get("https://koh-samui.com:50100/onboardshows")
        .then(res => {
            users.value = res.data;
        });
      }).catch(error => {
        console.error(error);
      });
    }

    function decrement(item) {
      console.log(`labelshow id: ${item.idshow}`);

      try {
        axios.put("https://koh-samui.com:50100/onboardshows", {
          idshow: item.idshow
        });
      } catch (error) {
        console.error(error);
      }

      item.numbershow--;
    }

    // computed property
    const filteredUsers = computed(() => {
      if (!idFilter.value) return users.value;
      
      const idArr = idFilter.value.split(',').map(id => Number(id));
      return users.value.filter(user => idArr.includes(user.idshow));
    });

    
  return {
    users,
    idFilter, // added new property
    increment,
    decrement,
    filteredUsers // added new computed property
  }
}
});
</script>
