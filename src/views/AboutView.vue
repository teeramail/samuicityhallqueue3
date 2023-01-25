<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <!-- content for 25% part -->
      </v-col>
      <v-col cols="9">
        <v-image :src="imageSrc" :transition="transition" class="rotate" ></v-image>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      imageSrc: 'https://images.unsplash.com/photo-1575776487016-f9f9f9f8d9e9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
      transition: 'rotate-transition'
    }
  }
}
</script>

<style>
.rotate {
  animation: rotate 10s infinite linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
