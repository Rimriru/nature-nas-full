<script setup lang="ts">
defineProps<{
  contentValues: any;
  canvas: 'one' | 'two' | 'three' | 'four' | 'five' | 'six';
}>();

const emit = defineEmits<{
  (e: 'editBtnClick'): void;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <article class="canvas-content">
    <div class="canvas-content__container">
      <PersonaCard :persona-data="contentValues.personaOne" />
      <p v-if="contentValues.description" class="canvas-content__description">
        {{ contentValues.description }}
      </p>
    </div>
    <div
      v-if="contentValues.text"
      v-html="contentValues.text"
      class="canvas-content__plain-text content"
    ></div>
    <UCarousel
      v-if="contentValues.photos.length > 0"
      v-slot="{ item }"
      :items="contentValues.photos"
      :ui="{ item: 'basis-full snap-center justify-center' }"
      class="carousel"
      :arrows="contentValues.photos.length > 1"
      :indicators="contentValues.photos.length > 1"
    >
      <img :src="`${config.public.domen}/image/${item}`" class="carousel__img" />
    </UCarousel>
    <MenuButton class="canvas-content__edit-btn" :size="'middle'" @click="emit('editBtnClick')">
      Редактировать
    </MenuButton>
  </article>
</template>

<style lang="scss">
.canvas-content {
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-right: 20px;
  margin-bottom: 20px;
  gap: 20px;
  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 20px;

  .canvas-content__container {
    display: flex;
    gap: 80px;
  }

  .canvas-content__plain-text {
    margin-bottom: 50px;
  }

  .canvas-content__edit-btn {
    margin: 0 auto;
  }
}
</style>
