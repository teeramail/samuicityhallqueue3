<template>
  <div class="container">
    <div class="row head">
      <div class="column queue" style="background-color: #d8bfd8">คิว</div>
      <div class="column channel" style="background-color: #d8bfd8">ช่อง</div>
    </div>
    <!-- use v-for to iterate the items -->
    <div class="row" v-for="(item, index) in  items" :key="item._id" :style="getItemStyle(item)">
      <div class="column queue">{{item.numbershow}}</div>
      <div class="column channel">{{item.idshow}}</div>
    </div>
    
    <!-- Connection status indicator -->
    <div v-if="!isConnected" class="connection-status">
      📡 กำลังเชื่อมต่อ...
    </div>
    
    <div>
      <qsound />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import axios from 'axios';
import qsound from './qsound.vue'
import { getApiUrl, API_CONFIG } from '@/config/api.js';

const items = ref([]);
const isConnected = ref(true);
const lastUpdateTime = ref(Date.now());
let intervalId = null;

const fetchItems = async () => {
  try {
    // Get all onboardlands and filter for called queues (qcall = false means ready to display)
    const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDS));
    
    // Only show items that are ready to be displayed (qcall = false, following original Express logic)
    const newItems = response.data.filter(item => item.qcall === false);
    
    // Update items only if there are changes to avoid unnecessary re-renders
    if (JSON.stringify(newItems) !== JSON.stringify(items.value)) {
      items.value = newItems;
      console.log('📺 OnTV updated with called queues (qcall=false):', items.value);
    }
    
    // Update connection status
    isConnected.value = true;
    lastUpdateTime.value = Date.now();
    
  } catch (error) {
    console.error('❌ Error fetching OnTV data:', error);
    isConnected.value = false;
  }
};

onMounted(() => {
  fetchItems();
  
  // Start optimized real-time polling
  // Use faster interval for more responsive updates
  intervalId = setInterval(fetchItems, 800); // 800ms for very responsive updates
  
  // Check connection status periodically
  setInterval(() => {
    const timeSinceLastUpdate = Date.now() - lastUpdateTime.value;
    if (timeSinceLastUpdate > 5000) { // If no update for 5 seconds
      isConnected.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const getItemStyle = (item) => {
  const style = {};
  const updatedAt = new Date(item.updatedAt);
  const now = new Date();
  
  // Show green for recently updated items (within 20 seconds)
  if (now - updatedAt < 20000) {
    style.color = 'green';
    style.background = 'white';
  }
  
  // Add pulsing animation for very recent updates (within 3 seconds)
  if (now - updatedAt < 3000) {
    style.animation = 'pulse 1s infinite';
    style.fontWeight = 'bold';
  }
  
  return style;
};

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-size: 8vw; /* Set font size to 8% of the viewport width */
  padding: 0;
  margin: 0;
}

.row {
  display: flex;
  flex-direction: row;
  height: 20%; /* Set row height to 20% of the screen height */
  padding: 0;
  margin: 0;
}

.row.head {
  height: 20%; /* Set head row height to 10% of the screen height */
}

.column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  border: 1px solid black;
  padding: 0;
  margin: 0;
}

.column.queue {
  font-size: 10vw; /* Set queue column font size to 10% of the viewport width */
}

.column.channel {
  font-size: 8vw; /* Set channel column font size to 8% of the viewport width */
}

.connection-status {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(255, 165, 0, 0.9);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  z-index: 1000;
}

@keyframes pulse {
  0% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.05);
  }
  100% { 
    opacity: 1; 
    transform: scale(1);
  }
}

</style>
