<script setup lang="ts">
const props = defineProps(['items']);
</script>

<template>
  <UCarousel
    class="home-slider"
    :items="items"
    :ui="{ item: 'basis-full' }"
    :prev-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-left-20-solid',
      class: '-left-12'
    }"
    :next-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-right-20-solid',
      class: '-right-12'
    }"
    arrows
    indicators
  >
    <template #default="{ item }">
      <div class="home-slider__container">
        <img class="home-slider__img" :src="item.img" />
        <div class="content home-slider__content" v-html="item.content"></div>
        <EditBtn class="home-slider__edit-btn" :color="'black'" />
      </div>
    </template>
  </UCarousel>
</template>

<style lang="scss">
.home-slider {
  width: 90%;
  margin: 0 auto;
  padding-block: 20px;
  height: 470px;

  .home-slider__container {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;

    .home-slider__img {
      width: clamp(200px, 30vw, 600px);
      height: 400px;
      object-fit: cover;
      object-position: center;
    }

    .home-slider__content {
      background-color: #f2f2f2;
      padding: 40px;
      position: relative;
      z-index: 2;
      width: 100%;
      height: 400px;
      line-height: 1.3;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -50px;
        width: 100%;
        height: 100%;
        background-color: #f2f2f2;
        transform: skewX(-10deg);
        z-index: -1;
      }
    }

    .home-slider__edit-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 5;
    }
  }
}

@media screen and (max-width: 1280px) {
  .home-slider {
    .home-slider__container {
      .home-slider__content {
        padding: 20px;
      }
    }
  }
}

@media screen and (max-width: 1140px) {
  .home-slider {
    .home-slider__container {
      .home-slider__img {
        display: none;
      }

      .home-slider__content {
        padding: 40px;
        text-indent: 30px;
      }
    }
  }
}
</style>
