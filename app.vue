<script setup lang="ts">
import { canvases } from './utils/canvasesData';
const router = useRouter();
const routes = await useAllRoutes();
const links = await useLinks();

const routesState = useRoutesState();
const linksState = useLinksState();

routesState.value = routes;
linksState.value = links;

routesState.value.forEach((route) => {
  router.addRoute({
    path: route.path,
    name: route.path,
    component: canvases[route.component],
    props: {
      routeData: route
    }
  });
});
</script>

<template>
  <NuxtLayout>
    <div class="layout">
      <HeadingImage v-if="router.currentRoute.value.path !== '/admin'" />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
