<template>
  <v-container>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="5">
        <v-row>
          <v-btn  v-on:click="navigateToRegisPress(1)" class="spaced-btn big-button">มะเร็ต Maret</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(2)" class="spaced-btn big-button">แม่น้ำ Mae Nam</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(3)" class="spaced-btn big-button">บ่อผุด Bo Phut หมู่ M 2,4,6</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(4)" class="spaced-btn big-button">บ่อผุด Bo Phut หมู่ M 1,3,5</v-btn>
        </v-row>
      </v-col>
      <v-col cols="5">
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(5)" class="spaced-btn big-button">หน้าเมือง Na Mueang</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(6)" class="spaced-btn big-button">ลิปะน้อย Lipa Noi</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(7)" class="spaced-btn big-button">ตลิ่งงาม Taling Ngam</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(8)" class="spaced-btn big-button">อ่างทอง Ang Thong</v-btn>
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

<style scoped >

.big-button {
  font-size: 30px;
  padding: 50px 80px;
  line-height: 80px;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}
.spaced-btn {
  margin-top: 18px;
}

</style>