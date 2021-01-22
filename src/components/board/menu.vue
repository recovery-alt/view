<template>
  <div class="board-menu">
    <ul>
      <li v-for="item in data" :key="item.name" @click="item.event">
        <i :class="`el-icon-${item.icon}`"></i>
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { BoardEnum } from '@/store/modules/board';
import { defineComponent } from 'vue';
import { getMenuPosition } from '@/utils';

const name = 'board-menu';

const setup = () => {
  const store = useStore();
  const data = [
    {
      name: '剪切',
      icon: 'scissors',
      event: () => store.dispatch(BoardEnum.CUT),
    },
    {
      name: '复制',
      icon: 'document-copy',
      event: () => store.dispatch(BoardEnum.COPY),
    },
    {
      name: '粘贴',
      icon: 'brush',
      event: () => {
        const menuPosition = getMenuPosition();
        if (!menuPosition) return;
        store.dispatch(BoardEnum.PASTE, menuPosition);
      },
    },
    {
      name: '删除',
      icon: 'delete',
      event: () => store.dispatch(BoardEnum.DEL),
    },
  ];

  return { data };
};

export default defineComponent({ name, setup });
</script>

<style lang="scss" scoped>
.board-menu {
  position: absolute;

  ul {
    background-color: $el-info-3;
    border-radius: 5px;
    box-shadow: $el-shadow-1;
    padding: 5px 0;
  }

  li {
    padding: 0 10px;
    margin-top: 5px;
    border-radius: 3px;
    cursor: default;

    &:hover {
      background-color: $el-primary-1;
      color: $el-white;
    }
  }

  span {
    margin-left: 5px;
  }
}
</style>
