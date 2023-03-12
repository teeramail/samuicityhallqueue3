<template>
  <div class="container">
    <div class="row head">
      <div class="column queue" style="background-color: #d8bfd8">คิว</div>
      <div class="column channel" style="background-color: #d8bfd8">ช่อง</div>
    </div>
    <!-- use v-for to iterate the items -->
    <div class="row" v-for="(item, index) in  items" :key="item._id" :style="getItemStyle(item)">
      <div class="column queue">{{item.numbershow}}</div>
      <div class="column channel">{{item.idshow}}</div>
    </div>
    <div>
      <qsound />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import qsound from './qsound.vue'

const items = ref([]);

const fetchItems = async () => {
  const response = await axios.get('https://koh-samui.com:50200/onboardtwos');
  items.value = response.data;
};

onMounted(() => {
  fetchItems();
  setInterval(fetchItems, 1000);
});

// const sortedItems = computed(() => {
//   return items.value.sort((a, b) => a.idshow - b.idshow);
// });

const getItemStyle = (item) => {
  const style = {};
  const updatedAt = new Date(item.updatedAt);
  const now = new Date();
  if (now - updatedAt < 20000) {
    style.color = 'green';
    style.background = 'white';
  }
  return style;
};

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-size: 8vw; /* Set font size to 8% of the viewport width */
  padding: 0;
  margin: 0;
}

.row {
  display: flex;
  flex-direction: row;
  height: 20%; /* Set row height to 20% of the screen height */
  padding: 0;
  margin: 0;
}

.row.head {
  height: 20%; /* Set head row height to 10% of the screen height */
}



.column {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgray;
  border: 1px solid black;
  padding: 0;
  margin: 0;
}

.column.queue {
  font-size: 10vw; /* Set queue column font size to 10% of the viewport width */
}

.column.channel {
  font-size: 8vw; /* Set channel column font size to 8% of the viewport width */
}


</style>
