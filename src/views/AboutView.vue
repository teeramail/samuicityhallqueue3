<template>
  <v-container style="padding-top: 0.5em; padding-bottom: 0.5em;">
     
    <v-row>
      <v-col cols="12">
        <h1>&nbsp;</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1>&nbsp;</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1>&nbsp;</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1>&nbsp;</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-img src="@/assets/logosurat.png" max-width="350px" max-height="350px" class="d-block mx-auto"></v-img>
      </v-col>
    </v-row>
    
    <!-- Simple Current Queue Number Display -->
    <v-row>
      <v-col cols="12">
        <div class="text-center" style="margin-top: 30px;">
          <h2 class="queue-info">คิวปัจจุบัน: {{ currentQueueNumber }}</h2>
          <p class="text-subtitle-1">{{ lastUpdate }}</p>
        </div>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <h1>&nbsp;</h1>
      </v-col>
    </v-row>  
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <h1>&nbsp;</h1>
          </v-col>
        </v-row>  
        <v-row justify="center" align="center">
          <h1>&nbsp;&nbsp;</h1>
        </v-row>
        <v-row justify="center" align="center">
          <h1>&nbsp;&nbsp;</h1>
        </v-row>
        <v-row justify="center" align="center">
          <h1>&nbsp;&nbsp;</h1>
        </v-row>
        <v-row justify="center" align="center">
          <h1>&nbsp;&nbsp;</h1>
        </v-row>
        <v-row justify="center" align="center">
          <h1>&nbsp;&nbsp;</h1>
        </v-row>
        <v-row justify="center" align="center">
          <h1>&nbsp;&nbsp;</h1>
        </v-row>
        
        <!-- Single Main Button -->
        <v-row class="justify-center">
          <v-btn 
            class="print-visible spaced-btn big-button" 
            @click="navigateToRegisPress(1)" 
            style="background-color: #d8bfd8"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">รับบัตรคิว</span>
            <span v-else>กำลังโหลด...</span>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import router from "@/router"
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '@/config/api.js'

let intervalId

export default {
  setup() {
    const currentQueueNumber = ref(0)
    const lastUpdate = ref('')
    const isLoading = ref(false)
    
    async function fetchCurrentQueue() {
      try {
        // Get the current serving queue number (global)
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ONBOARDSHOWS))
        const onboardshows = response.data || []
        
        // Get the highest serving number across all counters
        const maxServing = Math.max(...onboardshows.map(show => show.numbershow || 0), 0)
        currentQueueNumber.value = maxServing
        
        lastUpdate.value = `อัปเดต: ${new Date().toLocaleTimeString('th-TH')}`
        
        console.log('📊 Current queue updated:', currentQueueNumber.value)
      } catch (error) {
        console.error('❌ Error fetching current queue:', error)
      }
    }
    
    function navigateToRegisPress(idshow) {
      router.push({ name: 'regispress01', params: { idshow } })
    }
    
    onMounted(() => {
      // Initial fetch
      fetchCurrentQueue()
      
      // Set up automatic refresh every 5 seconds
      intervalId = setInterval(fetchCurrentQueue, 5000)
    })
    
    onBeforeUnmount(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return {
      currentQueueNumber,
      lastUpdate,
      isLoading,
      navigateToRegisPress,
    }
  },
  
  beforeRouteLeave(to, from, next) {
    clearInterval(intervalId)
    next()
  }
}
</script>

<style scoped>
.big-button {
  font-size: 90px;
  padding: 90px 100px;
  line-height: 120px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.big-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.spaced-btn {
  margin-top: 20px;
}

.queue-info {
  color: #1976d2;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

@media print {
  *:not(.print-visible) {
    display: none;
  }
}
</style>
