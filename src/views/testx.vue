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



  latestfinalData.value = finalData.value.filter(doc => (Date.now() - new Date(doc.updatedAt).getTime()) < 25000);
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
    playSound();
    //  how to call function below to paysound
  }, 5000);

});


const playSound = () => {
  let currentSound = 0;
  audioRef.value = new Audio(sounds[currentSound]);
  console.log(sounds.value);
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
