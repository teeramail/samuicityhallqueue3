<template>
  <v-container style="padding-top: 0.5em; padding-bottom: 0.5em;">
    <!-- Screen View -->
    <div class="screen-only">
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
              class="spaced-btn big-button" 
              @click="getNewQueueTicket"
              style="background-color: #d8bfd8"
              :disabled="isLoading"
            >
              {{ isLoading ? 'กำลังออกบัตร...' : 'รับบัตรคิว' }}
            </v-btn>
          </v-row>

          <!-- Current Queue Status -->
          <v-row v-if="currentQueueStatus" class="justify-center mt-4">
            <v-col cols="12" class="text-center">
              <h3>สถานะคิวปัจจุบัน: {{ currentQueueStatus.currentQueue || 'N/A' }}</h3>
              <h4>คิวที่รอ: {{ currentQueueStatus.waiting || 0 }} คน</h4>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- Print View - Queue Ticket -->
    <div class="print-only">
      <div v-if="newQueueTicket" class="queue-ticket">
        <div class="ticket-header">
          <img src="@/assets/logosurat.png" alt="Logo" class="ticket-logo">
          <h1>เทศบาลนครสมุย</h1>
          <h2>บัตรคิว</h2>
        </div>
        
        <div class="ticket-body">
          <div class="queue-number">
            {{ newQueueTicket.queueNumber }}
          </div>
          
          <div class="ticket-info">
            <p>วันที่: {{ newQueueTicket.date }}</p>
            <p>เวลา: {{ newQueueTicket.time }}</p>
            <p>หมายเลขบัตร: {{ newQueueTicket.ticketId }}</p>
          </div>
          
          <div class="ticket-instructions">
            <p>กรุณารอเรียกคิวตามลำดับ</p>
            <p>Please wait for your number to be called</p>
          </div>
        </div>
        
        <div class="ticket-footer">
          <p>ขอบคุณที่ใช้บริการ</p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '@/config/api.js'

export default {
  setup() {
    const isLoading = ref(false)
    const newQueueTicket = ref(null)
    const currentQueueStatus = ref(null)

    // Get current queue status
    const fetchQueueStatus = async () => {
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.QUEUE_STATUS))
        currentQueueStatus.value = response.data
      } catch (error) {
        console.error('Error fetching queue status:', error)
      }
    }

    // Get new queue ticket
    const getNewQueueTicket = async () => {
      isLoading.value = true
      try {
        // Register for new queue
        const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.REGISSHOW), {
          idshow: 1, // Default queue type
          mode: 'register'
        })
        
        if (response.data && response.data.success) {
          // Create ticket data
          const now = new Date()
          newQueueTicket.value = {
            queueNumber: response.data.queueNumber,
            ticketId: `${Date.now()}-${response.data.queueNumber}`,
            date: now.toLocaleDateString('th-TH'),
            time: now.toLocaleTimeString('th-TH'),
            timestamp: now.getTime()
          }
          
          console.log('🎫 New queue ticket generated:', newQueueTicket.value)
          
          // Auto print after short delay
          setTimeout(() => {
            window.print()
          }, 500)
          
          // Refresh queue status
          await fetchQueueStatus()
        }
      } catch (error) {
        console.error('Error getting queue ticket:', error)
        alert('เกิดข้อผิดพลาดในการออกบัตรคิว กรุณาลองใหม่อีกครั้ง')
      }
      isLoading.value = false
    }

    onMounted(() => {
      fetchQueueStatus()
    })

    return {
      isLoading,
      newQueueTicket,
      currentQueueStatus,
      getNewQueueTicket
    }
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

/* Screen only elements */
.screen-only {
  display: block;
}

.print-only {
  display: none;
}

/* Print styles */
@media print {
  /* Hide everything by default */
  * {
    visibility: hidden;
  }
  
  /* Hide screen elements */
  .screen-only {
    display: none !important;
  }
  
  /* Show only print elements */
  .print-only, 
  .print-only * {
    visibility: visible;
    display: block !important;
  }
  
  /* Remove page margins and headers/footers */
  @page {
    margin: 0;
    padding: 0;
    size: A4;
  }
  
  body {
    margin: 0;
    padding: 0;
    background: white;
  }
  
  /* Queue ticket styling */
  .queue-ticket {
    width: 100%;
    max-width: 300px;
    margin: 20px auto;
    padding: 20px;
    border: 2px solid #333;
    border-radius: 10px;
    text-align: center;
    background: white;
    page-break-inside: avoid;
  }
  
  .ticket-header {
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
  
  .ticket-logo {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
  
  .ticket-header h1 {
    font-size: 18px;
    margin: 5px 0;
    color: #333;
  }
  
  .ticket-header h2 {
    font-size: 14px;
    margin: 5px 0;
    color: #666;
  }
  
  .queue-number {
    font-size: 72px;
    font-weight: bold;
    color: #2196f3;
    margin: 20px 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  .ticket-info {
    margin: 15px 0;
    font-size: 12px;
    color: #555;
  }
  
  .ticket-info p {
    margin: 3px 0;
  }
  
  .ticket-instructions {
    border-top: 1px solid #ddd;
    padding-top: 15px;
    margin-top: 15px;
    font-size: 11px;
    color: #666;
  }
  
  .ticket-instructions p {
    margin: 3px 0;
  }
  
  .ticket-footer {
    margin-top: 15px;
    font-size: 10px;
    color: #888;
  }
}
</style>
