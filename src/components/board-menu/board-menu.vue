<template>
  <div class="menu" :style="position">menu</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

type Props = {
  left: number;
  top: number;
};

const name = 'menu';

const props = {
  left: {
    type: Number,
    default: () => 0,
  },
  top: {
    type: Number,
    default: () => 0,
  },
};

const setup = (props: Props) => {
  const position = computed(() => ({ top: props.top + 'px', left: props.left + 'px' }));
  return { position };
};

export default defineComponent({ name, props, setup });
</script>

<style lang="scss" scoped>
.menu {
  position: absolute;
}
</style>
