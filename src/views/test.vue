<template>
  <div>
    <component :is="currentTemplate" />
    <button @click="switchTemplate">Switch Template</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const currentTemplate = ref("templateA");

    function switchTemplate() {
      currentTemplate.value = currentTemplate.value === "templateA" ? "templateB" : "templateA";
    }

    return {
      currentTemplate,
      switchTemplate
    };
  },
  components: {
    templateA: {
      name: 'TemplateA',
      template: `<div>This is template A</div>`
    },
    templateB: {
      name: 'TemplateB',
      template: `<div>This is template B</div>`
    }
  }
};
</script>
