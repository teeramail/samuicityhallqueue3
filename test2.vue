<template>
  <div>
    <CommunicateVoice ref="communicateVoice" v-if="filenames.value && filenames.value[0]" :files="filenames.value"/>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";
import CommunicateVoice from './CommunicateVoice.vue';

const lands = ref([]);
const filenames = ref([]);

onMounted(async () => {
  const fetchData = async () => {
    const res = await axios.get("https://koh-samui.com:50100/oldest-record");
    
    const ab = [res.data.oldestRecord.ab];
    const numbershow = res.data.oldestRecord.numbershow.toString().split('');
    const idshow = res.data.oldestRecord.idshow.toString().split('');
    lands.value = ['invite'].concat([ab]).concat(numbershow).concat(['chanel']).concat(idshow);
    
    filenames.value = computed(() => {
      return lands.value.map(digit => {
        return `https://koh-samui.com/sound/${digit}.mp3`;
      });
    });
    
    console.log(filenames);
    // Trigger the playNextFile function in the child component
    setTimeout(() => {
  this.$children[0].playNextFile();
  }, 0);
    return filenames;
  };
  
  fetchData();
  setInterval(fetchData, 9000);
});

</script>
