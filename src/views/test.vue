<template>
  <ul>
    <li v-for="land in onboardLands" :key="land.id">{{ land.name }}</li>
  </ul>
</template>
<script>
import io from 'socket.io-client';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      onboardShows: {},
      onboardLands: {}
    }
  },
  setup() {
    const socket = io('https://139.162.15.132:30100'); // Connect to the server where socket.io is running
    socket.on('onboardshows', (data) => {
      this.onboardShows = data;
    });
    socket.on('onboardlands', (data) => {
      this.onboardLands = data;
    });
  }
})
</script>

