<script setup lang="ts">
import { canvases } from '~/utils/canvasesData';

const routesState = useRoutesState();
const linkGroupsState = useLinkGroupsState();

const routes = await useAllRoutes();
const linkGroups = await useLinkGroups();
const router = useRouter();

routesState.value = routes;
linkGroupsState.value = linkGroups;

routes.forEach((route) => {
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
      <HeadingImage v-if="$router.currentRoute.value.path !== '/admin'" />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
