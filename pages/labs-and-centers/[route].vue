<script setup lang="ts">
const appRouter = useRouter();
const appRoute = useRoute();

const currentPage = computed(() => {
  const currentRoute = appRouter
    .getRoutes()
    .filter((route) => route.path === `/${appRoute.params.route}`)[0];
  return currentRoute;
});
</script>

<template>
  <div>
    <component
      :is="currentPage?.components?.default"
      :route-data="currentPage?.props.default.routeData"
    ></component>
  </div>
</template>

<style lang="scss"></style>
