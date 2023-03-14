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
          <v-btn v-on:click="navigateToRegisPress(1)" class="spaced-btn big-button" style="background-color: #d8bfd8">กดเรียกคิว ที่นี่</v-btn>
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
</style>
