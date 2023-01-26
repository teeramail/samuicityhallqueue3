<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(1)" class="spaced-btn">Button 1</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(9)" class="spaced-btn">Button 2</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(10)" class="spaced-btn">Button 2</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(11)" class="spaced-btn">Button 2</v-btn>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(1)" class="spaced-btn">Button 1</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(9)" class="spaced-btn">Button 2</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(10)" class="spaced-btn">Button 2</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress(11)" class="spaced-btn">Button 2</v-btn>
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
.spaced-btn {
  margin-top: 30px; /* or padding-top */
}
</style>