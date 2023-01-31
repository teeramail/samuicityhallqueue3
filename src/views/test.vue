<template>
  <div class="heading">
    <h1>Play Sound</h1>
    <h4>Playing audio files with Vue 3</h4>
  </div>

  <div class="container">
    <div class="form-group">
      <label>
        <button class="btn btn-primary btn-sm" @click.prevent="playSounds(['http://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3', 'http://soundbible.com/mp3/Elevator Ding-SoundBible.com-685385892.mp3'])"><span class="fa fa-play-circle-o"></span></button>
        Play Air Plane & Elevator Ding
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'


 
    const playSounds = (sounds) => {
      if (sounds && sounds.length) {
        sounds.forEach(sound => {
          var audio = new Audio(sound)
          audio.play()
        })
      }
    }



</script>
