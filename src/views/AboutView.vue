<template>
  <v-container>
  <v-row>
  <v-col cols="12">
  <v-row class="justify-center">
    <h1>เลือกรายการ</h1> 
  </v-row>
  <v-row class="justify-center">
    <v-btn v-on:click="navigateToRegisPress(1)" class="spaced-btn big-button">ตรวจสอบสิทธิ์กู้</v-btn>
  </v-row>
  <v-row class="justify-center">
    <v-btn v-on:click="navigateToRegisPress(2)" class="spaced-btn big-button">ลงนามสัญญา</v-btn>
  </v-row>
  <v-row class="justify-center">
    <v-btn v-on:click="navigateToRegisPress(3)" class="spaced-btn big-button">อื่นๆ</v-btn>
  </v-row>
</v-col>

    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import router from "@/router"




let intervalId

export default {
  setup() {
    
    function navigateToRegisPress(idshow) {      
    router.push({ name: 'regispress01', params: { idshow } })
    }



    return {
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
  font-size: 30px;
  padding: 50px 80px;
  line-height: 80px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.big-button2 {
  font-size: 27px;
  padding: 50px 80px;
  line-height: 50px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.spaced-btn {
  margin-top: 20px;
}

</style>