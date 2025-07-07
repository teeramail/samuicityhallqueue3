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
    
    <!-- Queue Status Display -->
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto" max-width="600" style="margin-top: 20px;">
          <v-card-title class="text-center">
            📊 สถานะคิวปัจจุบัน
          </v-card-title>
          <v-card-text v-if="queueData.length > 0">
            <v-row>
              <v-col v-for="queue in queueData" :key="queue.idshow" cols="12" md="4">
                <div class="text-center queue-status">
                  <h3>{{ queue.nameservice }}</h3>
                  <div class="queue-number">{{ queue.numbershow }}</div>
                  <div class="queue-label">คิวที่ลงทะเบียน</div>
                </div>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <div class="text-center">
              <p class="text-subtitle-1">📅 อัปเดตล่าสุด: {{ lastUpdate }}</p>
            </div>
          </v-card-text>
          <v-card-text v-else>
            <div class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p class="mt-2">กำลังโหลดข้อมูล...</p>
            </div>
          </v-card-text>
        </v-card>
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
      <!-- <h1>&nbsp;&nbsp;โปรดเตรียมมือถือไว้ถ่ายรูปคิว</h1> -->
  </v-row>
  <v-row justify="center" align="center">
      <!-- <h2>&nbsp;&nbsp;เพื่อลดขยะ ในกรณีที่ไม่ได้นำมือถือมา กดพิมพ์ </h2> -->
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
        <v-row class="justify-center">
          <v-btn 
            class="print-visible spaced-btn big-button" 
            v-on:click="navigateToRegisPress(1)" 
            style="background-color: #d8bfd8"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">กดเรียกคิว ที่นี่</span>
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
    const queueData = ref([])
    const lastUpdate = ref('')
    const isLoading = ref(true)
    
    async function fetchQueueStatus() {
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.REGISSHOW))
        queueData.value = response.data || []
        lastUpdate.value = new Date().toLocaleTimeString('th-TH')
        isLoading.value = false
        console.log('📊 Queue status updated:', queueData.value)
      } catch (error) {
        console.error('❌ Error fetching queue status:', error)
        // Keep trying even if there's an error
        isLoading.value = false
      }
    }
    
    function navigateToRegisPress(idshow) {
      router.push({ name: 'regispress01', params: { idshow } })
    }
    
    onMounted(() => {
      // Initial fetch
      fetchQueueStatus()
      
      // Set up automatic refresh every 3 seconds
      intervalId = setInterval(fetchQueueStatus, 3000)
    })
    
    onBeforeUnmount(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return {
      queueData,
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
}
.big-button2 {
  font-size: 27px;
  padding: 50px 80px;
  line-height: 50px;
  display: flex;
  align-items: center;
}
.spaced-btn {
  margin-top: 20px;
}
.spaced-btn2 {
  margin-top: 40px;
}

.queue-status {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.queue-number {
  font-size: 3rem;
  font-weight: bold;
  color: #1976d2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.queue-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 8px;
}

@media print {
  *:not(.print-visible) {
    display: none;
  }
}
</style>
