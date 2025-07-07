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
          <div>{{ nextQueueNumber }} ช่อง {{ item.idshow }}  รอ {{ waitingCount }}</div> 
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
import { getApiUrl, API_CONFIG } from '@/config/api.js';

const users = ref([]);
const idFilter = ref('');
const currentQueueNumber = ref(0);
const totalRegistered = ref(0);
const volumeIconEnabled = ref(false);

const props = defineProps({
  idFilter: {
    type: String,
    default : ''
  }
});

// Get the counter ID from props
const counterId = parseInt(props.idFilter);
idFilter.value = props.idFilter;

// Calculate next queue number (current + 1)
const nextQueueNumber = computed(() => {
  return currentQueueNumber.value + 1;
});

// Calculate waiting count (total registered - next queue number)
const waitingCount = computed(() => {
  return Math.max(0, totalRegistered.value - nextQueueNumber.value);
});

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    // Fetch data from onboardlands endpoint
    const res1 = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDS));
    const onboardlands = res1.data;

    // Fetch data from onboardshows endpoint (current serving numbers)
    const res2 = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDSHOWS));
    const onboardshows = res2.data;

    // Get registration data to count total people
    const res3 = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REGISSHOW));
    const regisshows = res3.data;

    // Find current counter's serving number
    const currentShow = onboardshows.find(show => show.idshow === counterId);
    if (currentShow) {
      currentQueueNumber.value = currentShow.numbershow || 0;
    }

    // Find total registered people for this counter
    const currentRegis = regisshows.find(regis => regis.idshow === counterId);
    if (currentRegis) {
      totalRegistered.value = currentRegis.numbershow || 0;
    }

    // Set the users ref to the onboardlands array (filtered by counter)
    users.value = onboardlands;

    console.log(`📊 Counter ${counterId}: Currently serving ${currentQueueNumber.value}, Total registered ${totalRegistered.value}, Next queue ${nextQueueNumber.value}, Waiting ${waitingCount.value}`);
    
    volumeIconEnabled.value = true;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function increment(item) {
  // Disable volume button during increment
  volumeIconEnabled.value = false;

  try {
    // Check if there are people waiting (if next queue number <= total registered)
    if (nextQueueNumber.value <= totalRegistered.value) {
      console.log(`🔢 Advancing queue from ${currentQueueNumber.value} to ${nextQueueNumber.value}`);
      
      // Use the original Express logic: call onboardlandnums
      // This will increment onboardshows first, then update onboardlands
      await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDNUMS), {
        idshow: item.idshow,        // The land/counter to update
        idshowtype: counterId,      // The show counter to increment
        idshowtext: 'A'             // The text identifier
      });

      // Refresh data to show updated numbers
      await fetchData();
    } else {
      console.log('No more people waiting in queue');
      volumeIconEnabled.value = true;
    }
  } catch (error) {
    console.error('Error incrementing queue:', error);
    volumeIconEnabled.value = true;
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

async function updateTimestamp(item) {
  console.log('📢 Calling queue for display:', item);
  
  // Set qcall = false to show this queue on OnTV (using qcall field)
  await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDS), {
    idshow: item.idshow,
    mode: 'setcall'
  });
  
  // Also update timestamp
  await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_ATT), {
    idshow: item.idshow,
  });
  
  console.log('✅ Queue called and will appear on OnTV');
}

</script>

<script>
const idFilter = 8 // <= sizes can be accessed in setup scope

export default {}
</script>
