<template>
  <div class="board-group">
    <component :is="item.component" v-for="item in propValue" :key="item.id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default {
  name: 'group',
  props: {
    propValue: {
      type: Array as PropType<Array<Component>>,
      default: () => [],
    },
  },
  setup(props) {
    // TODO
  },
};
</script>
