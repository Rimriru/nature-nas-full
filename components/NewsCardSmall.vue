<script setup lang="ts">
import { IMAGE_LINK_REG_EXP } from '~/utils/regExp';
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

const props = defineProps<{
  newsItem: NewsDataFromDb;
}>();

const config = useRuntimeConfig();

const coverAsSrc = IMAGE_LINK_REG_EXP.test(props.newsItem.cover);
</script>

<template>
  <NuxtLink :to="`/news/${newsItem._id}`" class="news-card-small">
    <div class="news-card-small__container">
      <img
        :src="
          coverAsSrc
            ? newsItem.cover
            : `${$config.public.process === 'production' ? '' : $config.public.domen}/image/${
                newsItem.cover
              }`
        "
        :alt="newsItem.title"
        loading="lazy"
        class="news-card-small__img"
      />
      <span class="news-card-small__description">{{ newsItem.title }}</span>
    </div>
  </NuxtLink>
</template>

<style lang="scss">
@import url('~/assets/styles/components/newsCardSmall.scss');
</style>
