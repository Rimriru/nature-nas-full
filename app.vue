<script setup lang="ts">
const routesState = useRoutesState();
const linksState = useLinksState();

const routes = await useAllRoutes();
const links = await useLinks();

routesState.value = routes.value;
linksState.value = links.value;
</script>

<template>
  <NuxtLayout>
    <AppHeader />
    <HeadingImage v-if="$route.path !== '/admin'" />
    <NuxtPage />
    <AppFooter />
  </NuxtLayout>
</template>
