<script setup lang="ts">
import { useRoutes, useRouteFind } from '~/composables/routes';
import type RouteDataFromDb from '~/types/RouteDataFromDb';

definePageMeta({
  middleware: async (to) => {
    const routesStore = useRoutes();
    const { data } = await useAsyncData('routes', async () => {
      // const oldRoutes = useNuxtData('routes').data.value;
      // if (oldRoutes) {
      //   routes.value = oldRoutes;
      //   return oldRoutes;
      // }
      const lookingForRoutes = await $fetch('/api/routes');
      routesStore.value = lookingForRoutes;
      return lookingForRoutes;
    });

    if (routesStore.value === null) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Произошла ошибка при обращении к GET "/api/routes"'
      });
    }

    const isInDb = useRouteFind(routesStore.value, to.path);

    if (!isInDb) {
      throw createError({
        statusCode: 404,
        statusMessage: `Страница ${to.path} не найдена`
      });
    }
  }
});
</script>

<template>
  <p>{{ $route.params.page }}</p>
</template>
