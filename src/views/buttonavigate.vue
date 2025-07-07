<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <h3>ช่องบริการ (Service Counters)</h3>
      </v-col>
    </v-row>
    
    <!-- Grid of 20 counters in 4 columns, 5 rows -->
    <v-row justify="center" class="counter-grid">
      <v-col 
        v-for="counter in 20" 
        :key="counter" 
        cols="3" 
        sm="2" 
        md="2" 
        lg="2"
        class="d-flex justify-center pa-2"
      >
        <v-btn 
          :color="getCounterColor(counter)"
          :size="getCounterSize(counter)"
          @click="navigator(counter)"
          class="counter-btn"
          elevation="3"
        >
          {{ counter }}
        </v-btn>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" class="d-flex justify-center mt-4">
        <div class="text-center">
          <div class="text-h6 mb-2">🏛️ เทศบาลเมืองสมุย</div>
          <div class="text-subtitle-1 text-grey-600">Samui City Hall Queue System</div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'

function navigator(idshow) {      
  router.push({ name: 'mixlandshow', params: { idshow } })
}

// Color coding for better visual organization
function getCounterColor(counter) {
  if (counter <= 5) return 'primary'      // Blue for 1-5
  if (counter <= 10) return 'success'     // Green for 6-10  
  if (counter <= 15) return 'orange'      // Orange for 11-15
  return 'deep-purple'                    // Purple for 16-20
}

// Different sizes for visual hierarchy
function getCounterSize(counter) {
  if (counter <= 10) return 'large'       // Larger for main counters
  return 'default'                        // Standard for additional counters
}
</script>

<style scoped>
.counter-grid {
  max-width: 600px;
  margin: 0 auto;
}

.counter-btn {
  width: 70px;
  min-width: 70px;
  height: 70px;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.counter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.text-h6 {
  color: #1976d2;
  font-weight: 600;
}

.text-subtitle-1 {
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .counter-btn {
    width: 60px;
    min-width: 60px;
    height: 60px;
    font-size: 1.3rem;
  }
  
  .counter-grid {
    max-width: 100%;
  }
}
</style>
