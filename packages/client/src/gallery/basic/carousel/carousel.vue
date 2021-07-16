<template>
  <div class="carousel">
    <Carousel>
      <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </Carousel>
  </div>
</template>

<script lang="ts" setup>
import { Carousel } from 'ant-design-vue';
</script>

<style lang="less" scoped>
.carousel {
  :deep {
    .ant-carousel {
      height: 100%;
    }
    .slick-slide {
      text-align: center;
      height: 100%;
      line-height: 1;
      background: #364d79;
      overflow: hidden;
    }

    .slick-slider {
      height: 100%;
    }
    .slick-slide h3 {
      color: #fff;
    }

    .slick-track {
      height: 100%;
    }

    .slick-list {
      height: 100%;
    }
  }
}
</style>
