<script setup lang="ts">
const currentChildRoute = useRoute();
const router = useRouter();
const page = ref();

const currentPage = computed(() => {
  return router.getRoutes().filter((route) => route.name === currentChildRoute.params.route)[0];
});

console.log(router.getRoutes());
</script>

<template>
  <div>
    <SideMenu />
    <NuxtPage ref="page" :route="currentPage" :page-key="(route) => route.fullPath" />
  </div>
</template>

<style lang="scss"></style>
