<template>
  <v-container style="padding-top: 0.5em; padding-bottom: 0.5em;">
    <!-- Screen View - Landscape Layout -->
    <div class="screen-only landscape-container">
      <!-- Header Section -->
      <v-row class="header-section" align="center" justify="center">
        <v-col cols="12" class="text-center">
          <h1 class="main-title">เทศบาลนครสมุย</h1>
          <h2 class="subtitle">ระบบจัดคิวอัตโนมัติ</h2>
        </v-col>
      </v-row>

      <!-- Main Content Section - Horizontal Layout -->
      <v-row class="main-content" align="center" justify="center" no-gutters>
        <!-- Left Side - Logo -->
        <v-col cols="6" class="logo-section">
          <v-img 
            src="@/assets/logosurat.png" 
            max-width="350px" 
            max-height="350px" 
            class="d-block mx-auto"
          ></v-img>
        </v-col>

        <!-- Right Side - Main Button -->
        <v-col cols="6" class="button-section">
          <div class="button-container">
            <v-btn 
              class="main-queue-button" 
              @click="getNewQueueTicket"
              :disabled="isLoading"
              elevation="8"
              rounded="xl"
            >
              {{ isLoading ? 'กำลังออกบัตร...' : 'รับบัตรคิว' }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Print View - Queue Ticket -->
    <div class="print-only">
      <div v-if="newQueueTicket" class="queue-ticket">
        <div class="ticket-header">
          <h1>เทศบาลนครสมุย</h1>
          <h2>บัตรคิว</h2>
        </div>
        
        <div class="ticket-body">
          <div class="queue-number">
            {{ newQueueTicket.queueNumber }}
          </div>
          
          <div class="ticket-info">
            <p>วันที่ {{ newQueueTicket.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { getApiUrl, API_CONFIG } from '@/config/api.js'

export default {
  setup() {
    const isLoading = ref(false)
    const newQueueTicket = ref(null)

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
        }
      } catch (error) {
        console.error('Error getting queue ticket:', error)
        alert('เกิดข้อผิดพลาดในการออกบัตรคิว กรุณาลองใหม่อีกครั้ง')
      }
      isLoading.value = false
    }

    return {
      isLoading,
      newQueueTicket,
      getNewQueueTicket
    }
  }
}
</script>

<style scoped>
/* Landscape Layout Styles */
.landscape-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
}

.header-section {
  height: 25vh;
  margin-bottom: 2rem;
}

.main-title {
  font-size: 3.5rem !important;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.8rem !important;
  color: #666;
  font-weight: normal;
}

.main-content {
  height: 60vh;
  padding: 0 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-container {
  text-align: center;
}

.main-queue-button {
  font-size: 3rem !important;
  padding: 2rem 3rem !important;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  color: white !important;
  min-width: 350px;
  min-height: 150px;
  font-weight: bold;
  text-transform: none !important;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.main-queue-button:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
}

.main-queue-button:disabled {
  background: linear-gradient(135deg, #bdbdbd 0%, #e0e0e0 100%) !important;
  color: #757575 !important;
}

/* Screen only elements */
.screen-only {
  display: block;
}

.print-only {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .main-title {
    font-size: 2.5rem !important;
  }
  
  .main-queue-button {
    font-size: 2.2rem !important;
    min-width: 280px;
    min-height: 120px;
  }
  
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .logo-section, .button-section {
    margin-bottom: 2rem;
  }
}

/* Print styles for 50mm thermal receipt */
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
  
  /* Custom page size for 50mm thermal receipt */
  @page {
    margin: 0;
    padding: 0;
    size: 50mm auto; /* 50mm width, auto height */
  }
  
  body {
    margin: 0;
    padding: 0;
    background: white;
    font-family: 'Courier New', monospace; /* Thermal printer font */
  }
  
  /* Thermal receipt ticket styling */
  .queue-ticket {
    width: 50mm;
    max-width: 50mm;
    margin: 0;
    padding: 2mm;
    border: none;
    border-radius: 0;
    text-align: center;
    background: white;
    page-break-inside: avoid;
    font-size: 8pt;
    line-height: 1.2;
  }
  
  .ticket-header {
    border-bottom: 1px dashed #333;
    padding-bottom: 2mm;
    margin-bottom: 2mm;
  }
  
  .ticket-header h1 {
    font-size: 8pt;
    margin: 1mm 0;
    color: #333;
    font-weight: bold;
  }
  
  .ticket-header h2 {
    font-size: 7pt;
    margin: 0.5mm 0;
    color: #666;
    font-weight: normal;
  }
  
  .queue-number {
    font-size: 24pt;
    font-weight: bold;
    color: #000;
    margin: 3mm 0;
    letter-spacing: 1pt;
  }
  
  .ticket-info {
    margin: 2mm 0;
    font-size: 6pt;
    color: #333;
    line-height: 1.1;
  }
  
  .ticket-info p {
    margin: 0.5mm 0;
  }
}
</style>
