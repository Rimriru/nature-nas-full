<script setup lang="ts">
defineProps(['items', 'indicatorsOn', 'withAngledImg']);

const emit = defineEmits(['editClick']);

const { width } = useWindowSize();
</script>

<template>
  <UCarousel
    :class="['home-slider', { 'home-slider_first': withAngledImg }]"
    :items="items"
    :ui="{
      item: 'basis-full overflow-y-auto max-h-[500px]',
      indicators: {
        wrapper: 'bottom-[-2px]'
      }
    }"
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
@import url('~/assets/styles/components/homeSlider.scss');
</style>
