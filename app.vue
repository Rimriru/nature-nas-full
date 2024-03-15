<script setup lang="ts">
const nuxtApp = useNuxtApp();
const router = useRouter();

const routesState = useRoutesState();
const linksState = useLinksState();

const routes = await nuxtApp.runWithContext(() => useAllRoutes());
const links = await nuxtApp.runWithContext(() => useLinks());

routesState.value = routes.value;
linksState.value = links.value;

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
    <HeadingImage v-if="$route.path !== '/admin'" />
    <NuxtPage />
  </NuxtLayout>
</template>
