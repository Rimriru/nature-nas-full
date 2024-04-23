<script setup lang="ts">
import { IMAGE_LINK_REG_EXP } from '#imports';
import type { NewsCardData } from '~/types/NewsDataFromDb';

const props = defineProps<{
  newsItem: NewsCardData;
}>();

const config = useRuntimeConfig();

const coverAsSrc = IMAGE_LINK_REG_EXP.test(props.newsItem.cover);
</script>

<template>
  <article class="news-card">
    <img
      class="news-card__cover"
      :src="coverAsSrc ? newsItem.cover : `${config.public.domen}/image/${newsItem.cover}`"
      alt="Обложка новости"
    />
    <div class="news-card__info-block">
      <h2 class="news-card__title">{{ newsItem.title }}</h2>
      <p class="news-card__date">{{ newsItem.creationDate }}</p>
      <p class="news-card__description">
        {{ newsItem.description }}
      </p>
    </div>
    <NuxtLink :to="`/news/${newsItem._id}`" class="news-card__btn">
      <p class="news-card__btn-text">Подробнее</p>
      <p class="news-card__btn-arrow">
        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            fill="black"
          ></path>
        </svg>
      </p>
    </NuxtLink>
    <ClientOnly>
      <div class="news-card__management">
        <EditBtn :color="'black'" />
        <RemoveBtn />
      </div>
    </ClientOnly>
  </article>
</template>

<style lang="scss">
@import url('~/assets/styles/components/newsCard.scss');
</style>
