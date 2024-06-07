<script setup lang="ts">
import type { CanvasOptions } from '~/types/ContentDataFromDb';

const props = defineProps<{
  contentValues: any;
}>();

const emit = defineEmits<{
  (e: 'editBtnClick'): void;
}>();

const canvas = inject<CanvasOptions>('canvas');

const config = useRuntimeConfig();
const isLoggedIn = useLoggedInState();
</script>

<template>
  <section
    :class="[
      'canvas-content',
      {
        'shadow-border':
          contentValues.text ||
          contentValues.description ||
          (contentValues.photos && contentValues.photos.length)
      }
    ]"
  >
    <article
      :class="[
        'canvas-article',
        {
          'canvas-article_reversed': canvas === 'four'
        }
      ]"
    >
      <div
        :class="[
          'canvas-article__container',
          {
            'canvas-article__container_reversed': canvas === 'two',
            'canvas-article__container_full-content': canvas === 'six'
          }
        ]"
      >
        <PersonaCard
          v-if="contentValues.personaOne && ['one', 'two', 'three', 'four'].includes(canvas!)"
          :persona-data="contentValues.personaOne"
          class="canvas-article__persona"
        />
        <PersonaCard
          v-if="contentValues.personaTwo && (canvas === 'three' || canvas === 'four')"
          :persona-data="contentValues.personaTwo"
          :is-reversed="true"
          class="canvas-article__persona"
        />
        <p
          v-if="contentValues.description && (canvas === 'one' || canvas === 'two')"
          class="canvas-article__description"
        >
          {{ contentValues.description }}
        </p>
        <div
          v-if="contentValues.description && canvas === 'six'"
          v-html="contentValues.description"
          :class="[
            'canvas-article__plain-text',
            'content',
            { 'canvas-article__plain-text_reversed': canvas === 'six' }
          ]"
        ></div>
      </div>
      <div
        v-if="contentValues.text"
        v-html="contentValues.text"
        :class="[
          'canvas-article__plain-text',
          'content',
          {
            'canvas-article__plain-text_reversed': canvas === 'two',
            'canvas-article__plain-text_last-in-order': canvas === 'six'
          }
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
          <img
            :src="`${
              $config.public.process === 'production' ? '' : $config.public.domen
            }/image/${item}`"
            class="carousel__img"
          />
        </template>
      </UCarousel>
    </article>
    <LazyClientOnly>
      <MenuButton
        v-if="isLoggedIn"
        class="canvas-content__edit-btn"
        :size="'middle'"
        @click="emit('editBtnClick')"
      >
        Редактировать
      </MenuButton>
    </LazyClientOnly>
  </section>
</template>

<style lang="scss">
@import url('~/assets/styles/components/canvasContent.scss');
</style>
