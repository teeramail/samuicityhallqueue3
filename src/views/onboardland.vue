<template>
  <div>
    <h3>กดเรียกคิว</h3>
    <input type="text" v-model="idFilter" placeholder="Filter by id (separate by comma)">
    <div v-for="item in filteredUsers.sort((a, b) => a.idshow - b.idshow)" :key="item._id">
      <v-card>
        <v-card-actions>
          <v-btn 
            icon 
            @click="increment(item)" 
            :disabled="!canIncrement || isProcessing"
            :color="isProcessing ? 'orange' : (canIncrement ? 'primary' : 'grey')"
          >
            <v-icon>{{ isProcessing ? 'mdi-loading mdi-spin' : 'mdi-arrow-up' }}</v-icon>
          </v-btn>
          <div>
            <span :class="{ 'text-success': isProcessing }">{{ nextQueueNumber }}</span> 
            ช่อง {{ item.idshow }} รอ {{ waitingCount }}
            <div v-if="!canIncrement" class="text-caption text-error">
              ไม่มีคิวรอ ({{ totalRegistered }}/{{ totalRegistered }})
            </div>
            <div class="text-caption text-info">
              🌐 Global: Currently serving {{ currentQueueNumber }}, Total {{ totalRegistered }}
            </div>
          </div>
          <v-btn 
            icon 
            @click="updateTimestamp(item)" 
            :disabled="!volumeIconEnabled"
            color="green"
          >
            <v-icon>mdi-volume-high</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>{{ item.nameservice }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, computed, onBeforeUnmount } from "vue";
import axios from "axios";
import { getApiUrl, API_CONFIG } from '@/config/api.js';

const users = ref([]);
const idFilter = ref('');
const currentQueueNumber = ref(0); // Global queue number (same for all counters)
const totalRegistered = ref(0); // Global total (sum of all registrations)
const volumeIconEnabled = ref(false);
const isProcessing = ref(false);
let pollingInterval = null;

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

// Check if we can increment (next queue number should not exceed total registered)
const canIncrement = computed(() => {
  return nextQueueNumber.value <= totalRegistered.value && !isProcessing.value;
});

onMounted(async () => {
  await fetchData();
  // Start fast real-time polling for responsive updates
  pollingInterval = setInterval(fetchData, 500); // Very fast polling (500ms)
});

onBeforeUnmount(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

async function fetchData() {
  try {
    // Fetch data from multiple endpoints in parallel for faster response
    const [onboardlandsRes, onboardshowsRes, regisshowsRes] = await Promise.all([
      axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDS)),
      axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDSHOWS)),
      axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REGISSHOW))
    ]);

    const onboardlands = onboardlandsRes.data;
    const onboardshows = onboardshowsRes.data;
    const regisshows = regisshowsRes.data;

    // GLOBAL QUEUE LOGIC: Use highest serving number across all counters
    const maxCurrentlyServing = Math.max(...onboardshows.map(show => show.numbershow || 0), 0);
    currentQueueNumber.value = maxCurrentlyServing;

    // GLOBAL TOTAL: Sum all registered people across all counters
    const globalTotal = regisshows.reduce((sum, regis) => sum + (regis.numbershow || 0), 0);
    totalRegistered.value = globalTotal;

    // Set the users ref to the onboardlands array (filtered by counter)
    users.value = onboardlands;

    console.log(`📊 Global Queue System - Counter ${counterId}: Currently serving ${currentQueueNumber.value} (globally), Total registered ${totalRegistered.value} (globally), Next queue ${nextQueueNumber.value}, Waiting ${waitingCount.value}, Can increment: ${canIncrement.value}`);
    
    volumeIconEnabled.value = true;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function increment(item) {
  // Check maximum limit before proceeding
  if (!canIncrement.value) {
    console.log(`❌ Cannot increment: Queue ${nextQueueNumber.value} exceeds total registered ${totalRegistered.value}`);
    return;
  }

  // Disable buttons and show processing state
  isProcessing.value = true;
  volumeIconEnabled.value = false;

  // Optimistic update - immediately update UI for better user experience
  const previousQueueNumber = currentQueueNumber.value;
  currentQueueNumber.value = nextQueueNumber.value;

  try {
    console.log(`🔢 Advancing GLOBAL queue from ${previousQueueNumber} to ${currentQueueNumber.value} (max: ${totalRegistered.value})`);
    
    // Use the original Express logic: call onboardlandnums
    // This will increment onboardshows globally and update onboardlands
    await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDNUMS), {
      idshow: item.idshow,        // The land/counter to update
      idshowtype: counterId,      // The show counter to increment (this will be global)
      idshowtext: 'A'             // The text identifier
    });

    // Immediate refresh after increment for instant feedback
    await fetchData();
    
    console.log(`✅ Global queue successfully advanced to ${currentQueueNumber.value}`);
  } catch (error) {
    console.error('❌ Error incrementing queue:', error);
    
    // Rollback optimistic update on error
    currentQueueNumber.value = previousQueueNumber;
    
    // Show error feedback
    alert('เกิดข้อผิดพลาดในการเพิ่มคิว กรุณาลองอีกครั้ง');
  } finally {
    // Re-enable buttons
    isProcessing.value = false;
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
  
  try {
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
    
    // Immediate refresh for instant feedback
    await fetchData();
  } catch (error) {
    console.error('❌ Error calling queue:', error);
    alert('เกิดข้อผิดพลาดในการเรียกคิว กรุณาลองอีกครั้ง');
  }
}

</script>

<script>
const idFilter = 8 // <= sizes can be accessed in setup scope

export default {}
</script>
