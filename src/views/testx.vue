<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const collection1Data = ref([]);
const collection2Data = ref([]);

const fetchData = async () => {
  const [collection1Response, collection2Response] = await Promise.all([
    axios.get('https://koh-abx.com:50100/onboardshows'),
    axios.get('https://koh-abx.com:50100/onboardlands'),
  ]);
  collection1Data.value = collection1Response.data;
  collection2Data.value = collection2Response.data;
};

const finalData = ref([]);
const latestfinalData = ref([]);

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

      latestfinalData.value = finalData.value.filter(doc => doc.updatedAt >= (Date.now() - 5000));
      console.log(latestfinalData.value);
      


 
      
    });

  }, 1000);


});

</script>