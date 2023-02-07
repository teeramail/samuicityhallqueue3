<template>
  <div class="heading">
    <h1>Play Sound</h1>
    <h4>Playing audio files with Vue 3</h4>
  </div>
  <div class="container">
    <div class="form-group">
      <label>
        <button class="btn btn-primary btn-sm" @click.prevent="playSounds(['https://koh-samui.com/sound/invite.mp3',
        'https://koh-samui.com/sound/A.mp3',
        'https://koh-samui.com/sound/1.mp3', 'https://koh-samui.com/sound/2.mp3',
        'https://koh-samui.com/sound/chanel.mp3',
        'https://koh-samui.com/sound/7.mp3',
        'https://koh-samui.com/sound/ka.mp3'

        ])"><span class="fa fa-play-circle-o"></span></button>
        Play Air Plane & Elevator Ding
      </label>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
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
