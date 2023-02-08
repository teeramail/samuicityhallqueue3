<template>
  <div class="container">
    <div class="row" style="height: 10%; font-size: smaller">
      <div class="column" style="width: 25%; display: flex; align-items: center; justify-content: center;">ช่อง</div>
      <div class="column" style="width: 25%; display: flex; align-items: center; justify-content: center;">คิว</div>
      <div class="column" style="width: 25%; display: flex; align-items: center; justify-content: center;">ช่อง</div>
      <div class="column" style="width: 50%; display: flex; align-items: center; justify-content: center;">คิว</div>
    </div>
    <!-- use v-for to iterate the finalData -->
    <div class="row" style="height: 100%;">
      <div class="column" style="width: 50%;">
        <div class="row" v-for="(item, index) in finalData.sort((a, b) => a.idshow - b.idshow).slice(0, 5)" :key="item.idshow" style="display: flex; align-items: center; justify-content: center;">
          <div class="column" style="display: flex; align-items: center; justify-content: center;">{{item.idshow}}</div>
          <div class="column" style="display: flex; align-items: center; justify-content: center;">{{item.ab}}{{item.numbershow}}</div>
        </div>
      </div>
      <div class="column" style="width: 50%;">
        <div class="row" v-for="(item, index) in finalData.sort((a, b) => a.idshow - b.idshow).slice(5, 10)" :key="item.idshow" style="display: flex; align-items: center; justify-content: center;">
          <div class="column" style="display: flex; align-items: center; justify-content: center;">{{item.idshow}}</div>
          <div class="column" style="display: flex; align-items: center; justify-content: center;">{{item.ab}}{{item.numbershow}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const collection1Data = ref([]);
const collection2Data = ref([]);
const finalData = ref([]);
const latestfinalData = ref([]);
const sounds = ref([]);
const audioRef = ref(null)
const isPlaying = ref(false)

const fetchData = async () => {
  const [collection1Response, collection2Response] = await Promise.all([
    axios.get('https://koh-samui.com:50100/onboardshows'),
    axios.get('https://koh-samui.com:50100/onboardlands'),
  ]);
  collection1Data.value = collection1Response.data;
  collection2Data.value = collection2Response.data;
};

onMounted(async () => {
  await fetchData();
  setInterval(() => {
    fetchData().then(() => {
      finalData.value = [];

      collection1Data.value.forEach(doc1 => {
        const matchingDoc = collection2Data.value.find(doc2 => doc1.idshow === doc2.idshow);
        if (matchingDoc) {
          finalData.value.push({
            idshow: doc1.idshow,
            numbershow: doc1.updatedAt > matchingDoc.updatedAt ? doc1.numbershow : matchingDoc.numbershow,
            ab: doc1.updatedAt > matchingDoc.updatedAt ? doc1.ab : matchingDoc.ab,
            updatedAt: doc1.updatedAt > matchingDoc.updatedAt ? doc1.updatedAt : matchingDoc.updatedAt
          });
        } else {
          finalData.value.push({
            idshow: doc1.idshow,
            numbershow: doc1.numbershow,
            ab: doc1.ab,
            updatedAt: doc1.updatedAt
          });
        }
      });
  
      collection2Data.value.forEach(doc2 => {
        if (!finalData.value.find(doc => doc.idshow === doc2.idshow)) {
          finalData.value.push({
            idshow: doc2.idshow,
            numbershow: doc2.numbershow,
            ab: doc2.ab,
            updatedAt: doc2.updatedAt
          });
        }
      });

      console.log(finalData.value);



  latestfinalData.value = finalData.value.filter(doc => (Date.now() - new Date(doc.updatedAt).getTime()) < 15000);
   console.log(latestfinalData.value);
   });

   const filenames = computed(() => {
      return latestfinalData.value.map(item => {
        const digits = item.numbershow.toString().split('');
        return digits.map(digit => `https://koh-samui.com/sound/${digit}.mp3`);
      });
    });

    console.log(filenames.value);
    sounds.value = filenames.value ;
    playSound(filenames.value);

  }, 5000);

});


const playSound = () => {
  let currentSound = 0;
  audioRef.value = new Audio(sounds.value[currentSound]);

  audioRef.value.addEventListener("ended", () => {
    isPlaying.value = false;
    currentSound++;
    if (currentSound < sounds.value.length) {
      audioRef.value.src = sounds.value[currentSound];
      audioRef.value.play();
    }
  });

  if (!isPlaying.value) {
    isPlaying.value = true;
    audioRef.value.play();
  }
};

</script>


<style scope>

 .container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.rowone {
  display: flex;
  flex-direction: row;
  height: 10%;
  font-size: 3vw
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 18%;
}

.column {
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  border: 1px solid black;
} 

body {
  font-size: 7vw; /* adjust as needed */
}

</style>
