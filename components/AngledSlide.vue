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
@import url('~/assets/styles/components/angledSlide.scss');
</style>
