<template>
  <div>
    <h3>กดเรียกคิว</h3>
    <input type="text" v-model="idFilter" placeholder="Filter by id (separate by comma)">
    
    <!-- Debug information -->
    <div v-if="showDebugInfo" class="debug-info">
      <small>
        🐛 Debug: Total Reg: {{ totalRegistered }}, Current: {{ currentQueueNumber }}, 
        Next: {{ nextQueueNumber }}, Waiting: {{ waitingCount }}
        <br>Last update: {{ lastUpdateTime }}
      </small>
    </div>
    
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
            <div v-if="!canIncrement && totalRegistered > 0" class="text-caption text-error">
              ไม่มีคิวรอ ({{ currentQueueNumber }}/{{ totalRegistered }})
            </div>
            <div v-if="totalRegistered === 0" class="text-caption text-warning">
              ⚠️ ไม่มีคนลงทะเบียน
            </div>
            <div class="text-caption text-info">
              🌐 Global: Serving {{ currentQueueNumber }}, Total {{ totalRegistered }}
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
    
    <!-- Show connection status -->
    <div v-if="!isConnected" class="connection-status">
      🔄 กำลังเชื่อมต่อ... ({{ errorCount }} errors)
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, computed, onBeforeUnmount, watch } from "vue";
import axios from "axios";
import { getApiUrl, API_CONFIG } from '@/config/api.js';

const users = ref([]);
const idFilter = ref('');
const currentQueueNumber = ref(0); // Global queue number (same for all counters)
const totalRegistered = ref(0); // Global total (sum of all registrations)
const volumeIconEnabled = ref(false);
const isProcessing = ref(false);
const isConnected = ref(true);
const errorCount = ref(0);
const lastUpdateTime = ref('');
const showDebugInfo = ref(false); // Toggle for debugging
let pollingInterval = null;
let lastDataHash = '';

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

// Improved waiting count calculation with better validation
const waitingCount = computed(() => {
  if (totalRegistered.value <= 0) return 0;
  if (currentQueueNumber.value <= 0) return totalRegistered.value;
  
  const waiting = totalRegistered.value - currentQueueNumber.value;
  return Math.max(0, waiting);
});

// Check if we can increment (next queue number should not exceed total registered)
const canIncrement = computed(() => {
  return totalRegistered.value > 0 && 
         nextQueueNumber.value <= totalRegistered.value && 
         !isProcessing.value;
});

// Toggle debug info on component click
const toggleDebug = () => {
  showDebugInfo.value = !showDebugInfo.value;
};

onMounted(async () => {
  await fetchData();
  // Start adaptive polling - faster when active, slower when idle
  startAdaptivePolling();
  
  // Add click listener for debug toggle (development helper)
  if (import.meta.env.DEV) {
    document.addEventListener('dblclick', toggleDebug);
  }
});

onBeforeUnmount(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  if (import.meta.env.DEV) {
    document.removeEventListener('dblclick', toggleDebug);
  }
});

// Adaptive polling - adjusts speed based on activity
function startAdaptivePolling() {
  let pollInterval = 2000; // Start with 2 seconds
  
  const poll = async () => {
    try {
      await fetchData();
      
      // If there was recent activity, poll faster
      if (isProcessing.value) {
        pollInterval = 500; // Fast polling during processing
      } else if (errorCount.value > 0) {
        pollInterval = 5000; // Slower polling if there are errors
      } else {
        pollInterval = 1500; // Normal polling
      }
      
    } catch (error) {
      pollInterval = 3000; // Slower on errors
    }
    
    // Schedule next poll
    setTimeout(poll, pollInterval);
  };
  
  // Start polling
  poll();
}

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

    // Create a hash of the data to check if anything changed
    const dataHash = JSON.stringify({ onboardshows, regisshows });
    
    // Only update if data actually changed (performance optimization)
    if (dataHash !== lastDataHash) {
      lastDataHash = dataHash;
      
      // GLOBAL QUEUE LOGIC: Use highest serving number across all counters
      const maxCurrentlyServing = Math.max(...onboardshows.map(show => show.numbershow || 0), 0);
      currentQueueNumber.value = maxCurrentlyServing;

      // GLOBAL TOTAL: Sum all registered people across all counters
      const globalTotal = regisshows.reduce((sum, regis) => sum + (regis.numbershow || 0), 0);
      totalRegistered.value = globalTotal;

      // Set the users ref to the onboardlands array (filtered by counter)
      users.value = onboardlands;

      console.log(`📊 Global Queue System - Counter ${counterId}: Currently serving ${currentQueueNumber.value} (globally), Total registered ${totalRegistered.value} (globally), Next queue ${nextQueueNumber.value}, Waiting ${waitingCount.value}, Can increment: ${canIncrement.value}`);
      
      lastUpdateTime.value = new Date().toLocaleTimeString();
    }
    
    volumeIconEnabled.value = true;
    isConnected.value = true;
    errorCount.value = 0;
    
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    isConnected.value = false;
    errorCount.value++;
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

    // Force immediate refresh after increment for instant feedback
    setTimeout(async () => {
      await fetchData();
    }, 100); // Small delay to ensure server has processed
    
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
    
    // Force immediate refresh for instant feedback
    setTimeout(async () => {
      await fetchData();
    }, 100);
  } catch (error) {
    console.error('❌ Error calling queue:', error);
    alert('เกิดข้อผิดพลาดในการเรียกคิว กรุณาลองอีกครั้ง');
  }
}

</script>

<style scoped>
.debug-info {
  background: #f0f0f0;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  font-family: monospace;
}

.connection-status {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 165, 0, 0.9);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  z-index: 1000;
}
</style>

<script>
const idFilter = 8 // <= sizes can be accessed in setup scope

export default {}
</script>
