<template>
  <div>
    <audio ref="audioEl" />
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';

export default {
  props: {
    files: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const audioEl = ref(null);
    const currentFileIndex = ref(0);

    onMounted(() => {
      if (!props.files || props.files.length === 0) {
        return;
      }
      audioEl.value = new Audio();
      audioEl.value.addEventListener("ended", playNextFile);
      document.body.appendChild(audioEl.value);
      audioEl.value.src = props.files[currentFileIndex.value];
      audioEl.value.play();
    });

    function playNextFile() {
      currentFileIndex.value += 1;
      if (currentFileIndex.value === props.files.length) {
        document.body.removeChild(audioEl.value);
        return;
      }
      audioEl.value.src = props.files[currentFileIndex.value];
      audioEl.value.play();
    }

    return {
      audioEl,
      playNextFile,
    };
  },
};
</script>