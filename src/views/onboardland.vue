<template>
  <div class="counter-interface">
    <!-- Clean header with counter info -->
    <div class="header-section">
      <h2 class="counter-title">🖥️ ช่องบริการ {{ counterId }}</h2>
      <div class="queue-status">
        <div class="current-queue">คิวปัจจุบัน: <span class="queue-number">{{ currentQueueNumber }}</span></div>
        <div class="total-waiting">รอคิว: <span class="waiting-number">{{ waitingCount }}</span> คน</div>
      </div>
    </div>
    
    <!-- Main action button -->
    <div class="action-section">
      <v-card class="queue-card" elevation="8">
        <v-card-text class="text-center pa-6">
          <div class="next-queue-display">
            <div class="label">คิวถัดไป</div>
            <div class="next-number" :class="{ 'processing': isProcessing }">
              {{ nextQueueNumber }}
            </div>
          </div>
          
          <v-btn
            :color="buttonColor"
            :size="'x-large'"
            @click="callNextQueue"
            :disabled="!canIncrement || isProcessing"
            class="call-button"
            :loading="isProcessing"
          >
            <v-icon :size="'large'" class="mr-2">
              {{ isProcessing ? 'mdi-loading mdi-spin' : 'mdi-arrow-up-bold' }}
            </v-icon>
            {{ buttonText }}
          </v-btn>
          
          <!-- Status messages -->
          <div v-if="!canIncrement && totalRegistered > 0" class="status-message error">
            ❌ ไม่มีคิวรอ ({{ currentQueueNumber }}/{{ totalRegistered }})
          </div>
          <div v-else-if="totalRegistered === 0" class="status-message warning">
            ⚠️ ไม่มีคนลงทะเบียน
          </div>
          <div v-else class="status-message success">
            ✅ พร้อมเรียกคิวถัดไป
          </div>
        </v-card-text>
      </v-card>
    </div>
    
    <!-- Quick actions -->
    <div class="quick-actions">
      <v-btn
        color="orange"
        variant="outlined"
        @click="announceQueue"
        :disabled="currentQueueNumber === 0"
        class="action-btn"
      >
        <v-icon class="mr-1">mdi-volume-high</v-icon>
        ประกาศคิว {{ currentQueueNumber }}
      </v-btn>
      
      <v-btn
        color="info"
        variant="outlined"
        @click="refreshData"
        :loading="isRefreshing"
        class="action-btn"
      >
        <v-icon class="mr-1">mdi-refresh</v-icon>
        รีเฟรช
      </v-btn>
    </div>
    
    <!-- Global status bar -->
    <div class="global-status">
      <div class="status-item">
        <span class="label">📊 ระบบทั้งหมด:</span>
        <span class="value">กำลังให้บริการ {{ currentQueueNumber }} / ลงทะเบียนแล้ว {{ totalRegistered }}</span>
      </div>
      <div class="connection-indicator" :class="{ 'connected': isConnected, 'disconnected': !isConnected }">
        {{ isConnected ? '🟢 เชื่อมต่อแล้ว' : '🔴 ขาดการเชื่อมต่อ' }}
      </div>
    </div>
    
    <!-- Debug info (only in development) -->
    <div v-if="showDebugInfo" class="debug-panel">
      <small>
        🐛 Counter: {{ counterId }} | Current: {{ currentQueueNumber }} | Next: {{ nextQueueNumber }} | 
        Total: {{ totalRegistered }} | Waiting: {{ waitingCount }} | 
        Can increment: {{ canIncrement }} | Last update: {{ lastUpdateTime }}
      </small>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref, computed, onBeforeUnmount } from "vue";
import axios from "axios";
import { getApiUrl, API_CONFIG } from '@/config/api.js';

// Reactive state
const currentQueueNumber = ref(0);
const totalRegistered = ref(0);
const isProcessing = ref(false);
const isRefreshing = ref(false);
const isConnected = ref(true);
const errorCount = ref(0);
const lastUpdateTime = ref('');
const showDebugInfo = ref(false);

// Cache for optimization
let dataCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 500; // 500ms cache
let pollingInterval = null;

const props = defineProps({
  idFilter: {
    type: String,
    default : ''
  }
});

const counterId = parseInt(props.idFilter);

// Computed properties
const nextQueueNumber = computed(() => currentQueueNumber.value + 1);

const waitingCount = computed(() => {
  if (totalRegistered.value <= 0) return 0;
  if (currentQueueNumber.value <= 0) return totalRegistered.value;
  return Math.max(0, totalRegistered.value - currentQueueNumber.value);
});

const canIncrement = computed(() => {
  return totalRegistered.value > 0 && 
         nextQueueNumber.value <= totalRegistered.value && 
         !isProcessing.value;
});

const buttonColor = computed(() => {
  if (isProcessing.value) return 'orange';
  if (!canIncrement.value) return 'grey';
  return 'success';
});

const buttonText = computed(() => {
  if (isProcessing.value) return 'กำลังเรียกคิว...';
  if (!canIncrement.value) return 'ไม่มีคิวรอ';
  return 'เรียกคิวถัดไป';
});

// Lifecycle
onMounted(async () => {
  await fetchData();
  startOptimizedPolling();
  
  // Debug toggle in development
  if (import.meta.env.DEV) {
    document.addEventListener('dblclick', () => {
      showDebugInfo.value = !showDebugInfo.value;
    });
  }
});

onBeforeUnmount(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});

// Optimized polling with smart intervals
function startOptimizedPolling() {
  let interval = 1000; // Start with 1 second
  
  const poll = async () => {
    await fetchData();
    
    // Adaptive interval based on activity and errors
    if (isProcessing.value) {
      interval = 300; // Very fast when processing
    } else if (errorCount.value > 0) {
      interval = 3000; // Slower on errors
    } else if (waitingCount.value > 0) {
      interval = 800; // Fast when people are waiting
    } else {
      interval = 2000; // Normal when idle
    }
    
    pollingInterval = setTimeout(poll, interval);
  };
  
  poll();
}

// Ultra-fast data fetching using optimized queue status endpoint
async function fetchData() {
  try {
    // Check cache first
    const now = Date.now();
    if (dataCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return; // Use cached data
    }
    
    // Use super-fast queue status endpoint for instant updates
    const statusRes = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.QUEUE_STATUS));
    const status = statusRes.data;

    // Update cache
    dataCache = status;
    cacheTimestamp = now;

    // Direct assignment from optimized API response
    if (currentQueueNumber.value !== status.current) {
      currentQueueNumber.value = status.current;
    }
    if (totalRegistered.value !== status.total) {
      totalRegistered.value = status.total;
    }

    lastUpdateTime.value = new Date().toLocaleTimeString();
    isConnected.value = true;
    errorCount.value = 0;
    
    console.log(`⚡ Fast status: Current ${status.current}, Total ${status.total}, Waiting ${status.waiting}, Can increment: ${status.canIncrement}`);
    
  } catch (error) {
    console.error('❌ Error fetching status:', error);
    isConnected.value = false;
    errorCount.value++;
  }
}

// Main action - call next queue
async function callNextQueue() {
  if (!canIncrement.value) {
    console.log(`❌ Cannot call next queue: ${nextQueueNumber.value} exceeds total ${totalRegistered.value}`);
    return;
  }

  isProcessing.value = true;
  const previousQueue = currentQueueNumber.value;
  
  // Optimistic update for instant UI feedback
  currentQueueNumber.value = nextQueueNumber.value;

  try {
    console.log(`🚀 Fast calling queue ${currentQueueNumber.value} from counter ${counterId}`);
    
    // Simplified API call - direct to the increment endpoint
    await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDNUMS), {
      idshow: 1, // Use a default land ID since all counters are equal
      idshowtype: counterId,
      idshowtext: 'A'
    });

    // Clear cache to force fresh data
    dataCache = null;
    
    // Quick refresh for immediate feedback
    setTimeout(() => fetchData(), 50);
    
    console.log(`✅ Queue ${currentQueueNumber.value} called successfully`);
    
  } catch (error) {
    console.error('❌ Error calling queue:', error);
    
    // Rollback on error
    currentQueueNumber.value = previousQueue;
    
    alert('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
  } finally {
    isProcessing.value = false;
  }
}

// Announce current queue
async function announceQueue() {
  if (currentQueueNumber.value === 0) return;
  
  try {
    // Call the announcement API
    await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDLANDS), {
      idshow: 1, // Default land since all counters are equal
      mode: 'setcall'
    });
    
    await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_ATT), {
      idshow: 1,
    });
    
    console.log(`📢 Announced queue ${currentQueueNumber.value}`);
    
    // Quick refresh
    setTimeout(() => fetchData(), 50);
    
  } catch (error) {
    console.error('❌ Error announcing queue:', error);
    alert('เกิดข้อผิดพลาดในการประกาศ');
  }
}

// Manual refresh
async function refreshData() {
  isRefreshing.value = true;
  dataCache = null; // Clear cache
  await fetchData();
  isRefreshing.value = false;
}

</script>

<style scoped>
.counter-interface {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.counter-title {
  color: #1976d2;
  margin-bottom: 15px;
  font-weight: 600;
}

.queue-status {
  display: flex;
  justify-content: space-between;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.current-queue, .total-waiting {
  font-size: 1.1rem;
  font-weight: 500;
}

.queue-number, .waiting-number {
  font-size: 1.4rem;
  font-weight: bold;
  color: #1976d2;
}

.action-section {
  margin-bottom: 30px;
}

.queue-card {
  border-radius: 16px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
}

.next-queue-display {
  margin-bottom: 25px;
}

.label {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 8px;
}

.next-number {
  font-size: 4rem;
  font-weight: bold;
  color: #4caf50;
  transition: all 0.3s ease;
}

.next-number.processing {
  color: #ff9800;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.call-button {
  width: 250px;
  height: 60px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 30px;
  margin: 20px 0;
  transition: all 0.3s ease;
}

.call-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.status-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  font-weight: 500;
}

.status-message.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-message.warning {
  background: #fff3e0;
  color: #f57c00;
}

.status-message.error {
  background: #ffebee;
  color: #c62828;
}

.quick-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.action-btn {
  min-width: 140px;
  border-radius: 8px;
}

.global-status {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.connection-indicator.connected {
  color: #4caf50;
  font-weight: 600;
}

.connection-indicator.disconnected {
  color: #f44336;
  font-weight: 600;
}

.debug-panel {
  background: #f0f0f0;
  padding: 10px;
  margin-top: 15px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 0.8rem;
}

/* Responsive design */
@media (max-width: 600px) {
  .counter-interface {
    padding: 15px;
  }
  
  .queue-status {
    flex-direction: column;
    gap: 10px;
  }
  
  .next-number {
    font-size: 3rem;
  }
  
  .call-button {
    width: 100%;
    font-size: 1.1rem;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .global-status {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
