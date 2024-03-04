<script setup lang="ts">
useHead({
  title: 'Карта сайта'
});

const pageTitle = usePageTitle();
pageTitle.value = 'Карта сайта';
</script>

<template>
  <main class="page-content">
    <LinksList :is-in-admin-page="false" />
  </main>
</template>

<style lang="scss"></style>
