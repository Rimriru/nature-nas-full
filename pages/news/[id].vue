<script setup lang="ts">
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

const route = useRoute();
const newsState = useNewsState();
const item = ref<NewsDataFromDb | null>(null);

const newsItemId = route.params.id;
const newsItem = computed(() => newsState.value.find((item) => item._id === newsItemId));
item.value = newsItem.value as NewsDataFromDb;

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
      <p class="news-item__date">{{ item?.date }}</p>
      <div class="news-item__content content" v-if="item?.content" v-html="item?.content"></div>
      <AnimatedLinkContent
        :to="'/news'"
        :text="'Назад'"
        :direction="'left'"
        class="news-item__back-link"
      />
    </div>
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
    margin-bottom: 15px;
  }

  .news-item__date {
    color: $mid-blue;
    margin-bottom: 30px;
  }

  .news-item__back-link {
    position: absolute;
    top: 0;
    left: -15%;
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
    cursor: pointer;

    &:hover {
      .news-item__back-text {
        transform: translateX(-5px);
      }

      .news-item__back-arrow {
        transform: translateY(0px);
      }
    }

    .news-item__back-text {
      transform: translateX(-18px);
      font-size: 1rem;
      font-weight: 700;
      transition-duration: 0.3s;
    }

    .news-item__back-arrow {
      transform: translateY(35px);
      transition-duration: 0.3s;
    }
  }
}
</style>
