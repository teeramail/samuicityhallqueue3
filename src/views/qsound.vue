<script setup>
import { onMounted, ref  } from "vue";
import axios from 'axios';

const audioEl = ref(null);
const currentFileIndex = ref(0);
const filenames = ref([ "https://koh-samui.com/sound/1.mp3" ]);
const shouldCheckForNewFiles = ref(false);
const lands = ref([]);

function playNextFile() {
  audioEl.value.src = filenames.value[currentFileIndex.value];
  audioEl.value.play();
}

function clearAudio() {
  audioEl.value.src = "";
  currentFileIndex.value = 0;
}

onMounted(() => {
  audioEl.value = new Audio();
  document.body.appendChild(audioEl.value);

  audioEl.value.addEventListener("ended", () => {
    currentFileIndex.value++;
    if (currentFileIndex.value >= filenames.value.length) {
      clearAudio();
      shouldCheckForNewFiles.value = true;
      const intervalId = setInterval(() => {
        if (shouldCheckForNewFiles.value) {
          clearInterval(intervalId);
          checkForNewFiles();
        }
      }, 3500);
    } else {
      playNextFile();
    }
  });

  playNextFile();
});

function checkForNewFiles() {
  axios.get('https://koh-samui.com:50200/oldest-record')
    .then(response => {
      if (response.data && response.data.oldestRecord) {
        const numbershow = response.data.oldestRecord.numbershow.toString().split('');
        const idshow = response.data.oldestRecord.idshow.toString().split('');
        lands.value = ['invite'].concat(numbershow).concat(['chanel']).concat(idshow);

        filenames.value = lands.value.map(digit => `https://koh-samui.com/sound/${digit}.mp3`);
        console.log(filenames.value)

        shouldCheckForNewFiles.value = false;
        currentFileIndex.value = 0;
        playNextFile();
      } else {
        shouldCheckForNewFiles.value = true;
        setTimeout(() => checkForNewFiles(), 2000);
      }
    })
    .catch(error => {
      console.error('Error getting oldest record:', error);
      shouldCheckForNewFiles.value = true;
      setTimeout(() => checkForNewFiles(), 2000);
    });
}

</script>

<script>

export default {}
</script>

