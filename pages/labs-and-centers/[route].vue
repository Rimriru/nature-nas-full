<script setup lang="ts">
import type { RouteLocationNormalized } from 'vue-router';

const appRouter = useRouter();
const appRoute = useRoute();

const currentPage = computed(() => {
  const currentRoute = appRouter
    .getRoutes()
    .filter((route) => route.path === `/${appRoute.params.route}`)[0];
  // const name = route.name;
  // const path = route.path;
  // const component = route?.components?.default;
  return currentRoute;
});

console.log(currentPage.value);

// if (currentPage.value) {
//   router.addRoute('labs-and-centers', {
//     path: currentPage.value.path,
//     component: currentPage.value.components.default
//   });
// }

// watch(
//   () => route.params.id,
//   (newId, oldId) => {
//     // react to route changes...
//   }
// );
</script>

<template>
  <div>
    <!-- <NuxtPage :route="currentPage" :keepalive="true" /> -->
    <component
      :is="currentPage?.components?.default"
      :route-data="currentPage.props.default.routeData"
    ></component>
    <!-- <p>{{ currentPage }}</p> -->
  </div>
</template>

<style lang="scss"></style>
