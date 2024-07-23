<script setup lang="ts">
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

const props = defineProps<{
  newsItem: NewsDataFromDb;
}>();

const emit = defineEmits(['editClick', 'removeClick']);

const isCoverLink = computed(() => IMAGE_LINK_REG_EXP.test(props.newsItem.cover));
</script>

<template>
  <article class="news-card">
    <img
      class="news-card__cover"
      :src="isCoverLink ? newsItem.cover : `/image/${newsItem.cover}`"
      :alt="newsItem.title"
      loading="lazy"
    />
    <div class="news-card__info-block">
      <h2 class="news-card__title">{{ newsItem.title }}</h2>
      <p class="news-card__date">{{ newsItem.date }}</p>
      <p class="news-card__description">
        {{ newsItem.description }}
      </p>
    </div>
    <AnimatedLinkContent
      :to="`/news/${newsItem._id}`"
      :text="'Подробнее'"
      :direction="'right'"
      class="news-card__more-btn"
    />
    <ClientOnly>
      <div class="news-card__management">
        <EditBtn :color="'black'" @click="emit('editClick', newsItem)" />
        <RemoveBtn @click="emit('removeClick', newsItem)" />
      </div>
    </ClientOnly>
  </article>
</template>

<style lang="scss">
@import url('~/assets/styles/components/newsCard.scss');
</style>
