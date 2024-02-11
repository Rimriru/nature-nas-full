<script setup lang="ts">
import type RouteDataFromDb from '~/types/RouteDataFromDb';
const routes = ref<RouteDataFromDb[]>([]);

const getAllRoutes = async () => {
  const { data: routesFromDb } = await useFetch('/api/routes');
  //console.log(routesFromDb.value);
  routes.value = routesFromDb.value as RouteDataFromDb[];
};

const handleRouteRemove = async (routeId: string) => {
  const routeRemovalRequest = await useFetch(`/api/routes/${routeId}`, {
    method: 'delete'
  });
  console.log(routeRemovalRequest);
  await getAllRoutes();
};

onMounted(async () => {
  await getAllRoutes();
});
</script>

<template>
  <ol class="pages-list">
    Список созданных страниц:
    <li v-for="{ name, path, _id } in routes" :key="name">
      {{ path }}
      <button
        v-if="!path.startsWith('/admin')"
        @click="handleRouteRemove(_id)"
        class="remove-btn-small"
      ></button>
    </li>
  </ol>
</template>

<style>
.pages-list {
  list-style: decimal;
}
</style>
../../types/PagesList
