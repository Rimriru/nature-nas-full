<script setup lang="ts">
const title = 'Карта сайта';

useSeoMeta({
  title,
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
  max-width: 1100px;
  width: calc(100% - 30px * 2);
  margin: 0 auto;
  padding-block: 40px;
}
</style>
