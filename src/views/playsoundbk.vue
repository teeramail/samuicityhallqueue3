<template>
    <div class="container">
      <div class="form-group">
        <label>
          <button class="btn btn-primary btn-sm" @click.prevent="playSounds(sounds)"><span class="fa fa-play-circle-o"></span></button>
          Play Air Plane & Elevator Ding
        </label>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    props: {
      sounds: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const audioRef = ref(null)
  
      const playSounds = (sounds) => {
        if (sounds && sounds.length) {
          let currentSound = 0
  
          audioRef.value = new Audio(sounds[currentSound])
          audioRef.value.addEventListener("ended", () => {
            currentSound++
            if (currentSound < sounds.length) {
              audioRef.value.src = sounds[currentSound]
              audioRef.value.play()
            }
          })
  
          audioRef.value.play()
        }
      }
  
      return {
        playSounds
      }
    }
  }
  </script>