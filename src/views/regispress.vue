<template>

  <v-table name="mytab" id="mytab1">
    <tr class="one-third column" v-for="labelshow in labelshows " :key="labelshow._id">
        <div>   
        <br>
        <v-btn @click="incrementShowNumber(labelshow)" height="50" size="x-large" color="purple">
            {{ labelshow.nameservice }}
        </v-btn>  
    </div>
    </tr>
  </v-table>

</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios'
import {defineComponent, ref, onMounted} from "vue" 

const route = useRoute();
console.log(route.query);
const idshow = ref(1);

const labelshows = ref([]);
const allcatagory = async () => {
  try {
    const response = await axios.get(`http://localhost:50100/regisshow/`);
    console.log(response.data);
    labelshows.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  allcatagory();
});




// const incrementShowNumber = (labelshow) => {
//   console.log('labelshow.idshow.value');
//   console.log(labelshow.idshow);
// }

// const incrementShowNumber = 
  
// (labelshow) => {
//   console.log('labelshow.idshow.value');
//   console.log(labelshow.idshow);
//  }
//   async () => {
//   try {
//     const response = await axios.put("http://localhost:50100/regisshow", {
//       idshow: labelshow.idshow
//     });
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// }


const incrementShowNumber = async (labelshow) => {
  console.log('labelshow.idshow.value');
  console.log(labelshow.idshow);

  try {
    const response = await axios.put("http://localhost:50100/regisshow", {
      idshow: labelshow.idshow
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}


</script>
