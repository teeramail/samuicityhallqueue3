<template>
    <div class="heading">
  
    </div>
  </template>
  
  <script setup>

  import { ref, onMounted } from 'vue'
  
  const props = defineProps({
    sounds: {
    type: Object,
    required: true
  }
  })
  
  console.log(props.sounds)
  
  const audioRef = ref(null)
  const isPlaying = ref(false)
  
  onMounted(() => {
    const sounds = props.sounds
  
    let currentSound = 0
    audioRef.value = new Audio(sounds[currentSound])
    audioRef.value.addEventListener("ended", () => {
      isPlaying.value = false
      currentSound++
      if (currentSound < sounds.length) {
        audioRef.value.src = sounds[currentSound]
        audioRef.value.play()
      }
    })
  
    if (!isPlaying.value) {
      isPlaying.value = true
      audioRef.value.play()
    }
  })
  
  </script>
  
  