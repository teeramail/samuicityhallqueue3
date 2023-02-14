<template>
  <div><h3>ภาษีป้าย/แก้ไขข้อมูล/ค่าธรรมเนียมอื่น</h3></div>
  <div>
    <input type="text" v-model="idFilter" placeholder="Filter by id (separate by comma)">
    <div v-for="item in filteredUsers" :key="item._id">
      <v-card>
        <v-card-actions>
          <v-btn icon @click="increment(item)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <div>{{ item.numbershow }} ช่อง {{ item.idshow }}  รอ {{ specificDifference }}</div> 
        </v-card-actions>
        <v-card-text>{{ item.nameservice }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, onMounted, ref, computed } from "vue";
import axios from "axios";

const users = ref([]);
const idFilter = ref('');
const specificDifference = ref(null);

const props = defineProps({
  idFilter: {
    type: String,
    default : ''
  }
});

idFilter.value = props.idFilter;

    
    onMounted(async () => {
      const res = await axios.get("https://koh-samui.com:50100/onboardshows");
      users.value = res.data;
    });
   
  async function increment(item) {
  const rescomb = await axios.get("https://koh-samui.com:50100/combine-record");
  specificDifference.value = rescomb.data.find(combine => combine.idshow === item.idshow).difference;
  // console.log("specificDifference:", specificDifference);
  if (specificDifference.value >= 1) {
    await axios.put("https://koh-samui.com:50100/onboardshows", {
      idshow: item.idshow
    });
    const res = await axios.get("https://koh-samui.com:50100/onboardshows");
    users.value = res.data;
    const rescomb = await axios.get("https://koh-samui.com:50100/combine-record");
    specificDifference.value = rescomb.data.find(combine => combine.idshow === item.idshow).difference;
  }
}


    // computed property
    const filteredUsers = computed(() => {
      if (!idFilter.value) return users.value;
      
      const idArr = idFilter.value.split(',').map(id => Number(id));
      return users.value.filter(user => idArr.includes(user.idshow));
    });

    
</script>
