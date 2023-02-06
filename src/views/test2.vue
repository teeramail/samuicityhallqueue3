<template>
  <div>
    <h3>{filename}</h3>
    <h2>{numbershow}</h2>
  </div>
</template>

<script>

import { ref, computed } from 'vue';

export default {
  setup() {
    const data = ref([
      {
        "_id": "63b44b62da8396f1f440bf8c",
        "idshow": 8,
        "numbershow": 836,
        "updatedAt": "2023-02-04T03:32:47.758Z"
      },
      {
        "_id": "63b44b62da8396f1f440bf8d",
        "idshow": 9,
        "numbershow": 123,
        "updatedAt": "2023-02-04T03:32:47.758Z"
      }
    ]);

    const filenames = computed(() => {
      return data.value.map(item => {
        const digits = item.numbershow.toString().split('');
        return digits.map(digit => `https://koh-samui.com/sound/${digit}.mp3`);
      });
    });

    console.log(filenames.value);

    return {
      filenames,
    };
  },
};





</script>
