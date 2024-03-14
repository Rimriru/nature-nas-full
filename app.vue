<script setup lang="ts">
const router = useRouter();

const routesState = useRoutesState();
const linksState = useLinksState();

const routes = await useAllRoutes();
const links = await useLinks();

routesState.value = routes.value;
linksState.value = links.value;

routesState.value.forEach((route) => {
  const CanvasComponent = () => import(`~/components/${route.component}.vue`);
  router.addRoute({ path: route.path, name: route.path, component: CanvasComponent, props: true });
});
</script>

<template>
  <NuxtLayout>
    <HeadingImage v-if="$route.path !== '/admin'" />
    <NuxtPage />
  </NuxtLayout>
</template>
