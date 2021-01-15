<template>
  <div class="board-menu" :style="position">
    <ul>
      <li v-for="item in data" :key="item.name">
        <i :class="`el-icon-${item.icon}`"></i>
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

type Props = {
  left: number;
  top: number;
};

const name = 'board-menu';

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

  const data = [
    {
      name: '剪切',
      icon: 'scissors',
    },
    {
      name: '复制',
      icon: 'document-copy',
    },
    {
      name: '粘贴',
      icon: 'brush',
    },
    {
      name: '删除',
      icon: 'delete',
    },
  ];

  return { position, data };
};

export default defineComponent({ name, props, setup });
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.board-menu {
  position: absolute;

  ul {
    background-color: #ebebeb;
    border-radius: 5px;
    box-shadow: 0 0 10px #ccc;
    padding: 5px 0;
  }

  li {
    padding: 0 10px;
    margin-top: 5px;
    border-radius: 3px;
    cursor: default;

    &:hover {
      background-color: #1b4ba5;
      color: #fff;
    }
  }

  span {
    margin-left: 5px;
  }
}
</style>
