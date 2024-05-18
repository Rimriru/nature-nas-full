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
  : `${config.public.domen}/image/${props.item.img}`;
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
.home-slider__container {
  background-image: url('~/assets/images/slide-bg.png');
  background-repeat: no-repeat;
  position: relative;

  &_img-as-bg {
    background-size: contain;
    background-position: right;
    position: relative;
    z-index: 0;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(255, 255, 255);
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 1) 10%,
        rgba(255, 255, 255, 1) 40%,
        rgba(255, 255, 255, 0) 100%
      );
      z-index: -1;
    }
  }
}

.home-slider__content-container {
  max-width: 1150px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  padding-block: 75px;
  margin-left: 100px;

  &_reversed {
    flex-direction: row-reverse;
    margin-left: 100px;
    max-width: 650px;
  }

  .home-slider__img {
    width: 300px;
    height: max-content;
    object-position: center;

    &_none {
      display: none;
    }
  }

  .home-slider__content {
    position: relative;
    z-index: 4;
    text-shadow: 0 0 lightgray;
  }
}

@media screen and (max-width: 1250px) {
  .home-slider__container {
    &_img-as-bg {
      background-size: auto 100%;
    }
  }
}

@media screen and (max-width: 1155px) {
  .home-slider__content-container {
    margin: 0;
    padding: 40px;
    text-indent: 30px;
  }
}

@media screen and (max-width: 800px) {
  .home-slider__content-container {
    padding: 15px;
  }
}
</style>
