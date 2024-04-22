<script setup lang="ts">
const title = 'Новости';
const pageTitleState = usePageTitle();
const newsState = useNewsState();

pageTitleState.value = title;

useSeoMeta({
  title
});

definePageMeta({
  title: 'Новости'
});
</script>

<template>
  <main class="main">
    <ul class="news">
      <li v-for="item of newsState" :key="item._id" class="news__item">
        <NewsCard :news-item="item" />
      </li>
    </ul>
  </main>
</template>

<style lang="scss">
.news {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 50px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 20px;
  padding: 40px 40px;

  .news__item {
    &:not(:last-child) {
      border-bottom: rgba(49, 48, 48, 0.4) 1px solid;
    }
  }
}
</style>
