<script setup lang="ts">
const { data } = await useFetch('/api/routes', { key: 'routes' });
</script>

<template>
  <NuxtLayout>
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </NuxtLayout>
</template>
