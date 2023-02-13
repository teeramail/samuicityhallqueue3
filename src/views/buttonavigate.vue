<template>
    <v-container>
      <v-row><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><h3 style="text-align: center;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ช่องบริการ</h3></td></v-row>
      <v-row>
        <v-col cols="1">
          <v-btn  x-large @click="navigator(1)">1</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn @click="navigator(2)">2</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn @click="navigator(3)">3</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1">
          <v-btn @click="navigator(4)">4</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn @click="navigator(5)">5</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn @click="navigator(6)">6</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1">
          <v-btn @click="navigator(7)">7</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn @click="navigator(8)">8</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn @click="navigator(9)">9</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1">
          <v-btn @click="navigator(10)">10</v-btn>
        </v-col>
        <v-col cols="1">
          <v-btn @click="navigator(11)">11</v-btn>
        </v-col>
        <v-col cols="1">
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import router from '@/router'



const idshow = ref(0)

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
  