<script setup lang="ts">
const router = useRouter();

const routesState = useRoutesState();
const linksState = useLinksState();

const routes = await useAllRoutes();
const links = await useLinks();

routesState.value = routes;
linksState.value = links;

routesState.value.forEach((route) => {
  const CanvasComponent = () => import(`~/components/${route.component}.vue`);
  router.addRoute({
    path: route.path,
    name: route.path,
    component: CanvasComponent,
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
