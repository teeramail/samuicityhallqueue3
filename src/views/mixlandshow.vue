<template>
  <div>
    <OnboardLand :idFilter="idFilter" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from 'vue-router'
// import router from "@/router"


import OnboardLand from './onboardland.vue'

const route = useRoute()
const idFilter = ref(route.params.idshow)

</script>