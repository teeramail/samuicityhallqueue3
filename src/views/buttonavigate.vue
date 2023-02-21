<template>
  <v-container>
    <v-row style="display: flex; justify-content: center; align-items: center;">
      <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td><h3 style="text-align: center;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ช่องบริการ</h3></td>
    </v-row>
    <v-row style="display: flex; justify-content: center; align-items: center;">
      <v-col cols="1">
        <v-btn x-large @click="navigator(1)">1</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn @click="navigator(2)">2</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn @click="navigator(3)">3</v-btn>
      </v-col>
    </v-row>
    <v-row style="display: flex; justify-content: center; align-items: center;">
      <v-col cols="1">
        <v-btn @click="navigator(4)">4</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn @click="navigator(5)">5</v-btn>
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

</script>

<style>
.v-btn {
  width: 75px;
  min-width: 75px;
}
</style>
