<script setup lang="ts">
import type { CanvasOptions } from '~/types/ContentDataFromDb';

defineProps<{
  contentValues: any;
}>();

const emit = defineEmits<{
  (e: 'editBtnClick'): void;
}>();

const canvas = inject<CanvasOptions>('canvas');

const config = useRuntimeConfig();
</script>

<template>
  <article class="canvas-content">
    <div
      :class="[
        'canvas-content__container',
        { 'canvas-content__container_reversed': canvas === 'two' }
      ]"
    >
      <PersonaCard :persona-data="contentValues.personaOne" />
      <PersonaCard v-if="contentValues.personaTwo" :persona-data="contentValues.personaTwo" />
      <p
        v-if="contentValues.description && (canvas === 'one' || canvas === 'two')"
        class="canvas-content__description"
      >
        {{ contentValues.description }}
      </p>
    </div>
    <div
      v-if="contentValues.text"
      v-html="contentValues.text"
      :class="[
        'canvas-content__plain-text',
        'content',
        { 'canvas-content__plain-text_reversed': canvas === 'two' }
      ]"
    ></div>
    <UCarousel
      v-if="contentValues.photos.length > 0"
      :items="contentValues.photos"
      :ui="{ item: 'basis-full snap-center justify-center' }"
      class="carousel"
      :arrows="contentValues.photos.length > 1"
      :indicators="contentValues.photos.length > 1"
    >
      <template #default="{ item }">
        <img :src="`${config.public.domen}/image/${item}`" class="carousel__img" />
      </template>
    </UCarousel>
    <MenuButton class="canvas-content__edit-btn" :size="'middle'" @click="emit('editBtnClick')">
      Редактировать
    </MenuButton>
  </article>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.canvas-content {
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  // margin-right: 20px;
  margin-bottom: 20px;
  gap: 20px;
  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 20px;

  .canvas-content__container {
    display: flex;
    justify-content: space-between;

    &_reversed {
      flex-direction: row-reverse;
    }

    .canvas-content__description {
      flex-basis: 50%;
      text-indent: 50px;
      text-align: justify;
    }
  }

  .canvas-content__plain-text {
    margin-bottom: 50px;
    padding-left: 25px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 4px;
      height: 100%;
      top: 0;
      left: 0;
      background-color: $mid-blue;
      border-radius: 10px;
    }

    &_reversed {
      padding-inline: 0 25px;
      &::before {
        left: 100%;
      }
    }
  }

  .canvas-content__edit-btn {
    margin: 0 auto;
  }
}
</style>
