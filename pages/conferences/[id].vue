<script setup lang="ts">
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

const item = ref<ConfDataFromDb | null>(null);
const confState = useConfsState();
const route = useRoute();

const confId = route.params.id;
const confItem = computed(() => confState.value.find((item) => item._id === confId));

if (confItem.value) {
  item.value = confItem.value as ConfDataFromDb;
} else {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    message: 'Страница конференции не найдена',
    fatal: true
  });
}

const date = (date: string) => new Date(date).toLocaleDateString();

useSeoMeta({
  title: 'Конференции'
});

definePageMeta({
  title: 'Конференции'
});
</script>

<template>
  <main class="main">
    <div class="news-item">
      <h2 class="news-item__title">{{ item?.description }}</h2>
      <p class="news-item__date">
        {{
          item?.endDate
            ? `${date(item.startDate)} – ${date(item.endDate)}` // @ts-ignore
            : `${date(item.startDate)}`
        }}
      </p>
      <div class="news-item__content content" v-if="item?.content" v-html="item?.content"></div>
      <AnimatedLinkContent
        :to="'/conferences'"
        :text="'Назад'"
        :direction="'left'"
        class="news-item__back-link"
      />
    </div>
  </main>
</template>

<style lang="scss">
@import url('~/assets/styles/components/newsItem.scss');
</style>
