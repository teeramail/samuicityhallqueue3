<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-row>
          TEST 25
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress" class="spaced-btn">Button 1</v-btn>
        </v-row>
        <v-row>
          <v-btn v-on:click="navigateToRegisPress" class="spaced-btn">Button 2</v-btn>
        </v-row>
        <v-row>
          <v-btn class="spaced-btn">Button 3</v-btn>
        </v-row>
        <v-row>
          <v-btn class="spaced-btn">Button 4</v-btn>
        </v-row>
      </v-col>
      <v-col cols="9">
        <h1>เมืองน่าอยู่ น่าเที่ยว เป็นศูนย์กลางการท่องเที่ยวทางทะเลอ่าวไทย</h1>
        <v-img :src="currentImage" aspect-ratio="aspectRatio" :width="width" cover></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const images = [
  'https://www.kohsamuicity.go.th/image/ratioalpha/?file=files/com_gallery/2022-09_78ccc1d5051fdb5.jpg&width=1020&height=433&defaultImage=images/nopic.jpg',
  'https://www.kohsamuicity.go.th/tmp/ca3b23a0e53828b8d0068ff17c30e1ee.jpg',
  'https://www.kohsamuicity.go.th/files/com_gallery/2022-09_e200d3b3e6c3fac.jpg'
]

const currentImage = ref(images[0])
let i = 1

export default {
  setup() {
    setInterval(() => {
        currentImage.value = images[i]
        i = i === images.length - 1 ? 0 : i + 1
    }, 3000)


    function navigateToRegisPress() {
      this.router.push({ name: 'regispress01', params: { botomid: this.botomid } })
    }


    return {
        currentImage,
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