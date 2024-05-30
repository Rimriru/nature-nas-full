<script setup lang="ts">
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

const route = useRoute();
const newsState = useNewsState();
const item = ref<NewsDataFromDb | null>(null);

const newsItemId = route.params.id;
const newsItem = computed(() => newsState.value.find((item) => item._id === newsItemId));
item.value = newsItem.value as NewsDataFromDb;

useSeoMeta({
  title: () => String(item.value?.title),
  description: () => String(item.value?.description)
});

definePageMeta({
  title: 'Новости'
});
</script>

<template>
  <main class="main">
    <div class="news-item">
      <AnimatedLinkContent
        :to="'/news'"
        :text="'Назад'"
        :direction="'left'"
        class="news-item__back-link"
      />
      <div>
        <h2 class="news-item__title">{{ item?.title }}</h2>
        <p class="news-item__date">{{ item?.date }}</p>
        <div class="news-item__content content" v-if="item?.content" v-html="item?.content"></div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import url('~/assets/styles/pages/newsItem.scss');
</style>
