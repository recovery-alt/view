<template>
  <div class="carousel">
    <a-carousel>
      <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </a-carousel>
  </div>
</template>

<script lang="ts">
export default { name: 'carousel' };
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
      color: var(--text-color);
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
