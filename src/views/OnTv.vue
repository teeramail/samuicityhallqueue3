<template>
  <div class="container">
    <div class="row" style="height: 10%; font-size: smaller">
      <div class="column" style="width: 25%; display: flex; align-items: center; justify-content: center;">ช่อง</div>
      <div class="column" style="width: 25%; display: flex; align-items: center; justify-content: center;">คิว</div>
      <!-- <div class="column" style="width: 25%; display: flex; align-items: center; justify-content: center;">ช่อง</div> -->
      <!-- <div class="column" style="width: 50%; display: flex; align-items: center; justify-content: center;">คิว</div> -->
    </div>
    <!-- use v-for to iterate the items -->
    <div class="row" style="height: 100%;">
      <div class="column" style="width: 50%;">
        <div class="row" v-for="(item, index) in sortedItems" :key="item.idshow" :style="getItemStyle(item)">
          <div class="column" style="display: flex; align-items: center; justify-content: center;">{{item.idshow}}</div>
          <div class="column" style="display: flex; align-items: center; justify-content: center;">{{item.ab}}{{item.numbershow}}</div>
        </div>
      </div>
    
      </div>
    </div>
    <div>
    <qsound />
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import qsound from './qsound.vue'

const items = ref([]);

const fetchItems = async () => {
  const response = await axios.get('https://koh-samui.com:50200/onboardlands');
  items.value = response.data;
};

onMounted(() => {
  fetchItems();
  setInterval(fetchItems, 1000);
});

const sortedItems = computed(() => {
  return items.value.sort((a, b) => a.idshow - b.idshow);
});

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
  height: 16%;
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
