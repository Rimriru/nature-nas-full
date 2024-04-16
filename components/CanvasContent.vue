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
  <section class="canvas-content">
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
        />
        <PersonaCard
          v-if="contentValues.personaTwo && (canvas === 'three' || canvas === 'four')"
          :persona-data="contentValues.personaTwo"
          :is-reversed="true"
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
          <img :src="`${config.public.domen}/image/${item}`" class="carousel__img" />
        </template>
      </UCarousel>
    </article>
    <MenuButton class="canvas-content__edit-btn" :size="'middle'" @click="emit('editBtnClick')">
      Редактировать
    </MenuButton>
  </section>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.canvas-content {
  max-width: 1400px;
  margin-bottom: 20px;
  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 20px;
  display: grid;

  .canvas-article {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 100%;

    &_reversed {
      flex-direction: column-reverse;

      .canvas-article__edit-btn {
        order: -1;
      }
    }

    .canvas-article__container {
      display: flex;
      justify-content: space-between;
      gap: 30px;

      &_reversed {
        flex-direction: row-reverse;
      }

      &_full-content {
        display: contents;
      }

      .canvas-article__description {
        flex-basis: 50%;
        text-indent: 50px;
        text-align: justify;
      }
    }

    .canvas-article__plain-text {
      margin-bottom: 50px;
      padding-left: 25px;
      position: relative;
      flex-basis: 100%;

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

      &_last-in-order {
        order: 1;
        margin-bottom: 0;
      }
    }
  }

  .canvas-content__edit-btn {
    margin-top: 50px;
    margin-inline: auto;
  }
}
</style>
