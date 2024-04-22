<script setup lang="ts">
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

const route = useRoute();
const newsState = useNewsState();
const item = ref<NewsDataFromDb | null>(null);

const newsItemId = route.params.id;
const newsItem = newsState.value.find((item) => item._id === newsItemId);
item.value = newsItem as NewsDataFromDb;

useSeoMeta({
  title: () => String(item.value?.title)
});

definePageMeta({
  title: 'Новости'
});
</script>

<template>
  <main class="main">
    <div class="news-item">
      <h2 class="news-item__title">{{ item?.title }}</h2>
      <div class="news-item__content content" v-if="item?.content" v-html="item?.content"></div>
    </div>
    <NuxtLink to="/news" class="news-item__back">
      <p class="news-card__btn-text">Назад</p>
      <p class="news-card__btn-arrow">
        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            fill="black"
          ></path>
        </svg></p
    ></NuxtLink>
  </main>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.news-item {
  max-width: 1120px;
  margin: 0 auto;
  position: relative;

  .news-item__title {
    font-size: 24px;
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 20px;
  }

  .news-item__back {
    position: absolute;
    top: 0;
    left: -80px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 3px 7px 3px 10px;
    border-radius: 10px;
    border: none;
    overflow: hidden;
    background: transparent;
    color: $black;
    align-self: end;
    border: $mid-blue 1px solid;
    cursor: pointer;
  }
}
</style>
