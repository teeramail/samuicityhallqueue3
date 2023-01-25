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
  setup() {
    const imageSrc = ref('https://unsplash.com/photos/r9RW20TrQ0Y')
    const transition = ref('rotate-transition')

    return {
      imageSrc,
      transition
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
