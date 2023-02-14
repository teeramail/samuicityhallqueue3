<template>
  <div><h3>ภาษีที่ดิน</h3></div>
  <input type="text" v-model="idFilter" placeholder="Filter by id (separate by comma)">
  <div v-for="item in filteredUsers.sort((a, b) => a.idshow - b.idshow)" :key="item._id">
    <v-card>
      <v-card-actions>
        <v-btn icon @click="increment(item)">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <div>{{ item.numbershow }}  @{{ item.idshow }}  #{{ specificDifference }} </div> 
      </v-card-actions>
      <v-card-text>{{ item.nameservice }}</v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, computed } from "vue";
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
  const res = await axios.get("https://koh-samui.com:50100/onboardlands");
  users.value = res.data;
  
});

async function increment(item) {
  const rescomb = await axios.get("https://koh-samui.com:50100/combine-record");
  specificDifference.value = rescomb.data.find(combine => combine.idshow === 11).difference;
  // console.log("specificDifference:", specificDifference);
  if (specificDifference.value >= 1) {
    await axios.put("https://koh-samui.com:50100/onboardlandnums", {
      idshow: item.idshow
    });
    const res = await axios.get("https://koh-samui.com:50100/onboardlands");
    users.value = res.data;
    const rescomb = await axios.get("https://koh-samui.com:50100/combine-record");
    specificDifference.value = rescomb.data.find(combine => combine.idshow === 11).difference;
    console.log(specificDifference.value)
  }
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
 

</script>

<script>
const idFilter = 8 // <= sizes can be accessed in setup scope

export default {}
</script>

