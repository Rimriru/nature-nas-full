<script setup lang="ts">
import { canvases } from './utils/canvasesData';
const router = useRouter();
const routes = await useAllRoutes();
const linkGroups = await useLinkGroups();

const routesState = useRoutesState();
const linkGroupsState = useLinkGroupsState();

routesState.value = routes;
linkGroupsState.value = linkGroups;

routesState.value.forEach((route) => {
  router.addRoute({
    path: route.path,
    name: route.name,
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
