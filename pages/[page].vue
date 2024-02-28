<script setup lang="ts">
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const nuxtApp = useNuxtApp();
const { component } = nuxtApp.$currentPage as RouteDataFromDb;

const CanvasComponent = defineAsyncComponent(() => import(`~/components/${component}.vue`));

definePageMeta({
  middleware: async (to) => {
    const routes = await useAllRoutes();
    const nuxtApp = useNuxtApp();

    if (routes === null) {
      throw createError({
        statusCode: 500,
        message: `Произошла ошибка при обращении к GET "/api/routes".`
      });
    }

    const isInDb = useRouteFindByPath(routes, to.path);
    nuxtApp.provide('currentPage', isInDb);

    if (!isInDb) {
      throw createError({
        statusCode: 404,
        message: `Страница ${to.path} не найдена`
      });
    }
  }
});
</script>

<template>
  <main class="page-content">
    <!-- <p>{{ $route.params.page }}</p> -->
    <CanvasComponent :heading="'hi!!'" :description="'Lol, how about that'" :plain-text="'LOL'" />
    <LazySectionForm />
  </main>
</template>
