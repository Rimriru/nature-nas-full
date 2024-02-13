<script setup lang="ts">
import { useRouteFind, useAllRoutes } from '~/composables/routes';

definePageMeta({
  middleware: async (to) => {
    const routes = await useAllRoutes();

    if (routes === null) {
      throw createError({
        statusCode: 500,
        statusMessage: `Произошла ошибка при обращении к GET "/api/routes". Routes = ${routes}`
      });
    }

    const isInDb = useRouteFind(routes, to.path);

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
