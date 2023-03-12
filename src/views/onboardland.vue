<template>
  <div>
    <h3>กดเรียกคิว</h3>
    <input type="text" v-model="idFilter" placeholder="Filter by id (separate by comma)">
    <div v-for="item in filteredUsers.sort((a, b) => a.idshow - b.idshow)" :key="item._id">
      <v-card>
        <v-card-actions>
          <v-btn icon @click="increment(item)">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
          <div>{{ item.numbershow }} ช่อง {{ item.idshow }}  รอ {{ specificDifference }}</div> 
          <v-btn icon @click="updateTimestamp(item)" :disabled="!volumeIconEnabled">
            <v-icon>mdi-volume-high</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>{{ item.nameservice }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, computed } from "vue";
import axios from "axios";

const users = ref([]);
const idFilter = ref('');
const specificDifference = ref('x');
const volumeIconEnabled = ref(false); // set the initial value to false

const props = defineProps({
  idFilter: {
    type: String,
    default : ''
  }
});

// idFilter.value = props.idFilter;
idFilter.value = props.idFilter;

onMounted(async () => {
  // Fetch data from onboardlands endpoint
  const res1 = await axios.get("https://koh-samui.com:50200/onboardlands");
  const onboardlands = res1.data;

  // Fetch data from onboardshows endpoint
  const res2 = await axios.get("https://koh-samui.com:50200/onboardshows");
  const onboardshows = res2.data;

  // Find the object in the onboardshows array where idshow is equal to 2
  const updatedShow = onboardshows.find(show => show.idshow === 1);

  // Update the numbershow value for all objects in the onboardlands array
  onboardlands.forEach(user => {
    user.numbershow = updatedShow.numbershow;
  });

  // Set the users ref to the updated onboardlands array
  users.value = onboardlands;

  // Set the volumeIconEnabled value to true after specificDifference is set
  specificDifference.value = rescomb.data.find(combine => combine.idshow === 1).difference;
  volumeIconEnabled.value = true;
});

async function increment(item) {
  // set the volumeIconEnabled value to false when increment button is clicked
  volumeIconEnabled.value = false;

  const rescomb = await axios.get("https://koh-samui.com:50200/combine-record");
  specificDifference.value = rescomb.data.find(combine => combine.idshow === 1).difference;

  if (specificDifference.value >= 1) {
    await axios.put("https://koh-samui.com:50200/onboardlandnums", {
      idshow: item.idshow,
      idshowtype: 1,
      idshowtext: 'A'
    });
    const res = await axios.get("https://koh-samui.com:50200/onboardlands");
    users.value = res.data;
    const rescomb = await axios.get("https://koh-samui.com:50200/combine-record");
    specificDifference.value = rescomb.data.find(combine => combine.idshow === 1).difference;
    volumeIconEnabled.value = true;
  }

  // await axios.post("https://koh-samui.com:50200/onboardtwos", {
  // idshow: item.idshow,
  // });

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

async function updateTimestamp(item) {
  await axios.put("https://koh-samui.com:50200/updateatt", {
    idshow: item.idshow,
   
  });
}

</script>

<script>
const idFilter = 8 // <= sizes can be accessed in setup scope

export default {}
</script>
