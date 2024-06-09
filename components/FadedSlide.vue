<script setup lang="ts">
import defaultBg from '~/assets/images/slide-bg.png';
import { IMAGE_LINK_REG_EXP } from '~/utils/regExp';
import type Slide from '~/types/SlideDataFromDb';

const props = defineProps<{
  index: number;
  item: Slide;
}>();

const config = useRuntimeConfig();

const image = IMAGE_LINK_REG_EXP.test(props.item.img)
  ? props.item.img
  : `${config.public.process === 'production' ? '' : config.public.domen}/image/${props.item.img}`;
</script>

<template>
  <div
    :class="['home-slider__container', { 'home-slider__container_img-as-bg': index === 1 }]"
    :style="{ backgroundImage: `${index === 1 ? `url(${image})` : defaultBg}` }"
  >
    <div
      :class="[
        'home-slider__content-container',
        { 'home-slider__content-container_reversed': index === 1 }
      ]"
    >
      <img
        :class="['home-slider__img', { 'home-slider__img_none': index === 1 }]"
        :src="image"
        loading="lazy"
        alt="Обложка слайда"
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
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
@import url('~/assets/styles/components/fadedSlide.scss');
</style>
