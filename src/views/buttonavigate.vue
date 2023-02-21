<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <h3>ช่องบริการ</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn x-large @click="navigator(1)">1</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="navigator(2)">2</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="navigator(3)">3</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="navigator(4)">4</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
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
