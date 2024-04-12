<script setup lang="ts">
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const appRouter = useRouter();
const appRoute = useRoute();

interface PageProps {
  routeData: RouteDataFromDb;
}

const currentPage = computed(() => {
  const currentRoute = appRouter
    .getRoutes()
    .filter((route) => route.path === `/${appRoute.params.route}`)[0];
  return currentRoute;
});
</script>

<template>
  <KeepAlive>
    <div>
      <component
        :is="currentPage?.components?.default"
        :route-data="(currentPage?.props.default as PageProps).routeData"
      ></component>
    </div>
  </KeepAlive>
</template>

<style lang="scss"></style>
