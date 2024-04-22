<script setup lang="ts">
const title = 'Карта сайта';
const pageTitleState = usePageTitle();

pageTitleState.value = title;

useSeoMeta({
  title
});

definePageMeta({
  title: 'Карта сайта'
});
</script>

<template>
  <main class="site-map">
    <LinksList :is-in-admin-page="false" />
  </main>
</template>

<style lang="scss">
.site-map {
  max-width: 1260px;
  margin: 0 auto;
  padding-block: 40px;
}
</style>
