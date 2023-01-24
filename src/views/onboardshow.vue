<template>
  <div v-for="item in users" :key="item._id">
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
</template>


<script>
  import { defineComponent, onMounted, ref } from "vue";
  import axios from "axios";

  export default defineComponent({
    setup() {
      const users = ref([]);
      const labelshow = ref({});
      onMounted(async () => {
        const res = await axios.get("http://koh-samui.com:50100/onboardshows");
        users.value = res.data;
        console.log(res);
      });

      function increment(item) {
  console.log(`labelshow id: ${item.idshow}`);

  axios.put("http://koh-samui.com:50100/onboardshows", {
    idshow: item.idshow
  }).then(() => {
    axios.get("http://koh-samui.com:50100/onboardshows")
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
          axios.put("http://koh-samui.com:50100/onboardshowsminus", {
            idshow: item.idshow
          });
        } catch (error) {
          console.error(error);
        }

        item.numbershow--;
      }

      return {
        users,
        labelshow,
        increment,
        decrement
      }
    }
  });
</script>
