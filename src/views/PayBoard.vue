<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(1)" class="spaced-btn big-button">บ่อผุด หมู่ 1,3,5</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(2)" class="spaced-btn">บ่อผุด หมู่ 2,4,6</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(3)" class="spaced-btn">แม่น้ำ</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(4)" class="spaced-btn">อ่างทอง</v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(5)" class="spaced-btn">ลิปะน้อย</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(6)" class="spaced-btn">หน้าเมือง</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(7)" class="spaced-btn">มะเร็ต</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(8)" class="spaced-btn">ตลิ่งงาม</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import router from "@/router"

const idshow = ref(20)

export default {
  setup() {
    
    function navigateToRegisPress(idshow) {      
    router.push({ name: 'regispress01', params: { idshow } })
    }

    return {
        navigateToRegisPress
    }
  }
}
</script>

<style>
.big-button {
  font-size: 24px;
  padding: 10px 20px;
}
.spaced-btn {
  margin-top: 30px; /* or padding-top */
}
</style>