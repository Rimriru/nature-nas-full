<script setup lang="ts">
import type Slide from '~/types/SlideDataFromDb';
defineProps<{
  index: number;
  item: Slide;
}>();
</script>

<template>
  <div
    :class="[
      'home-slider__container',
      {
        'home-slider__container_reversed': index === 1
      }
    ]"
  >
    <img
      class="home-slider__img"
      :src="
        IMAGE_LINK_REG_EXP.test(item.img) ? item.img : `${$config.public.domen}/image/${item.img}`
      "
    />
    <div
      :class="[
        'content home-slider__content',
        {
          'home-slider__content_reversed': index === 1
        }
      ]"
      v-html="item.content"
    ></div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.home-slider__img {
  width: clamp(200px, 30vw, 600px);
  height: 400px;
  object-fit: cover;
  object-position: center;
}

.home-slider__content {
  background-color: #f8f7f0;
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
    background-color: #f8f7f0;
    transform: skewX(-10deg);
    z-index: -1;
  }

  &_reversed {
    &::before {
      left: 50px;
    }
  }

  &_full {
    &::before {
      display: none;
    }
  }
}

@media screen and (max-width: 1280px) {
  .home-slider__content {
    padding: 20px;
  }
}
</style>
