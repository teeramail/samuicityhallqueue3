<template>
  <div class="ontv-container">
    <!-- Header row -->
    <div class="row header-row">
      <div class="column queue-column">คิว</div>
      <div class="column counter-column">ช่อง</div>
    </div>
    
    <!-- Latest 4 queue rows (data rows) -->
    <div 
      v-for="(queue, index) in displayQueues" 
      :key="queue.id || `empty-${index}`"
      class="row data-row"
      :class="{ 
        'recent-call': queue.isRecent, 
        'empty-row': queue.isEmpty,
        'first-row-recent': queue.isFirstRowRecent,
        'current-serving': index === 0 && !queue.isEmpty
      }"
    >
      <div class="column queue-column">
        <span v-if="!queue.isEmpty" class="queue-number">{{ queue.queueNumber }}</span>
        <span v-else class="empty-text">-</span>
      </div>
      <div class="column counter-column">
        <span v-if="!queue.isEmpty" class="counter-number">{{ queue.counterNumber }}</span>
        <span v-else class="empty-text">-</span>
      </div>
    </div>
    
    <!-- Connection status indicator -->
    <div v-if="!isConnected" class="connection-status">
      📡 กำลังเชื่อมต่อ...
    </div>
    
    <!-- Sound component -->
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

const queueHistory = ref([]);
const isConnected = ref(true);
const lastUpdateTime = ref(Date.now());
let intervalId = null;

// Create exactly 4 display rows (fill empty ones if needed)
const displayQueues = computed(() => {
  const rows = [];
  const maxRows = 4;
  
  // Add actual queues (latest first)
  for (let i = 0; i < maxRows; i++) {
    if (i < queueHistory.value.length) {
      const queue = queueHistory.value[i];
      const now = Date.now();
      const callTime = queue.timestamp || 0;
      const timeSinceCall = now - callTime;
      
      rows.push({
        id: queue.id,
        queueNumber: queue.queueNumber,
        counterNumber: queue.counterNumber,
        timestamp: queue.timestamp,
        isRecent: timeSinceCall < 15000, // Recent if called within 15 seconds
        isFirstRowRecent: i === 0 && timeSinceCall < 15000, // First row recent flag
        isEmpty: false
      });
    } else {
      // Fill empty rows
      rows.push({
        id: `empty-${i}`,
        queueNumber: null,
        counterNumber: null,
        timestamp: null,
        isRecent: false,
        isFirstRowRecent: false,
        isEmpty: true
      });
    }
  }
  
  return rows;
});

const fetchQueueHistory = async () => {
  try {
    console.log('📺 Fetching global queue history for OnTV');
    
    const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.QUEUE_HISTORY));
    const newHistory = response.data || [];
    
    // Update only if there are changes to avoid unnecessary re-renders
    if (JSON.stringify(newHistory) !== JSON.stringify(queueHistory.value)) {
      queueHistory.value = newHistory;
      console.log('📺 OnTV updated with latest queue history:', newHistory);
    }
    
    // Update connection status
    isConnected.value = true;
    lastUpdateTime.value = Date.now();
    
  } catch (error) {
    console.error('❌ Error fetching OnTV queue history:', error);
    isConnected.value = false;
  }
};

onMounted(() => {
  fetchQueueHistory();
  
  // Start real-time polling for instant updates
  intervalId = setInterval(fetchQueueHistory, 500); // Very fast updates for OnTV
  
  // Check connection status periodically
  setInterval(() => {
    const timeSinceLastUpdate = Date.now() - lastUpdateTime.value;
    if (timeSinceLastUpdate > 3000) { // If no update for 3 seconds
      isConnected.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

</script>

<style scoped>
.ontv-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Sarabun', 'Arial', sans-serif;
  padding: 0;
  margin: 0;
  background: #f0f8ff;
}

.row {
  display: flex;
  flex-direction: row;
  border: 2px solid #333;
  margin: 0;
  padding: 0;
}

.header-row {
  height: 20vh; /* Header takes 20% */
  background: linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%);
  color: white;
  font-weight: bold;
  font-size: 6vw;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.data-row {
  height: 20vh; /* Each data row takes 20% (4 rows = 80%) */
  background: #ffffff;
  color: #333;
  font-size: 8vw;
  font-weight: bold;
  transition: all 0.3s ease;
}

/* Recent calls (within 15 seconds) - blue blinking - HIGHEST PRIORITY */
.data-row.recent-call:not(.empty-row) {
  background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
  color: white;
  animation: pulse-blue 1.5s infinite;
}

/* First row recent (within 15 seconds) - green highlight - MEDIUM PRIORITY */
.data-row.first-row-recent:not(.empty-row):not(.recent-call) {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  animation: pulse-green 2s infinite;
}

/* Normal rows (after 15 seconds or not first row) - white background - LOW PRIORITY */
.data-row:not(.recent-call):not(.first-row-recent):not(.empty-row) {
  background: #ffffff;
  color: #333;
}

/* Empty rows */
.data-row.empty-row {
  background: #f5f5f5;
  color: #bbb;
  font-style: italic;
}

.column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid #333;
  padding: 10px;
  text-align: center;
}

.column:last-child {
  border-right: none;
}

.queue-column {
  background: rgba(255, 255, 255, 0.1);
}

.counter-column {
  background: rgba(255, 255, 255, 0.05);
}

.queue-number, .counter-number {
  font-weight: 900;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}

.empty-text {
  opacity: 0.4;
  font-size: 6vw;
}

.connection-status {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(255, 152, 0, 0.9);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* Animations for visual feedback */
@keyframes pulse-green {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.9; 
    transform: scale(1.01);
  }
}

@keyframes pulse-blue {
  0%, 100% { 
    opacity: 1; 
    background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
  }
  50% { 
    opacity: 0.8; 
    background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  }
}

/* Responsive adjustments for different screen sizes */
@media (max-width: 768px) {
  .header-row {
    font-size: 5vw;
  }
  
  .data-row {
    font-size: 7vw;
  }
  
  .empty-text {
    font-size: 5vw;
  }
}

@media (min-width: 1200px) {
  .header-row {
    font-size: 4rem;
  }
  
  .data-row {
    font-size: 5rem;
  }
  
  .empty-text {
    font-size: 4rem;
  }
}

/* High contrast for better visibility */
@media (prefers-contrast: high) {
  .data-row {
    border-width: 3px;
  }
  
  .column {
    border-right-width: 3px;
  }
}
</style>
