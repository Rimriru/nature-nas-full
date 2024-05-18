<script setup lang="ts">
defineProps(['items', 'indicatorsOn', 'withAngledImg']);

const emit = defineEmits(['editClick']);

const { width } = useWindowSize();
</script>

<template>
  <UCarousel
    :class="['home-slider', { 'home-slider_first': withAngledImg }]"
    :items="items"
    :ui="{ item: 'basis-full' }"
    :prev-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-left-20-solid',
      class: '-left-12 ml-2'
    }"
    :next-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-right-20-solid',
      class: '-right-12 mr-2'
    }"
    :arrows="width >= 800"
    indicators
  >
    <template #default="{ item, index }">
      <AngledSlide v-if="withAngledImg" :index="index" :item="item">
        <EditBtn class="home-slider__edit-btn" :color="'black'" @click="emit('editClick', item)" />
      </AngledSlide>
      <FadedSlide v-if="!withAngledImg" :index="index" :item="item">
        <EditBtn class="home-slider__edit-btn" :color="'black'" @click="emit('editClick', item)" />
      </FadedSlide>
    </template>
  </UCarousel>
</template>

<style lang="scss">
.home-slider {
  width: 90%;
  margin: 0 auto;
  padding-block: 20px;
  height: 470px;

  &_first {
    margin-bottom: 30px;
  }

  .home-slider__container {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;

    &_reversed {
      flex-direction: row-reverse;
    }

    .home-slider__edit-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 15;
      background-color: #f8f7f0;
      border-radius: 100%;
      mix-blend-mode: hard-light;
    }
  }
}

@media screen and (max-width: 1155px) {
  .home-slider {
    .home-slider__container {
      .home-slider__img {
        display: none;
      }
    }
  }
}
</style>
