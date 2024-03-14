<script setup lang="ts">
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const nuxtApp = useNuxtApp();
const router = useRouter();
const { path, component } = nuxtApp.$currentPage as RouteDataFromDb;

definePageMeta({
  middleware: async (to) => {
    const routes = await useAllRoutes();

    const links = await useLinks();
    const linksState = useLinksState();
    linksState.value = links.value;

    const nuxtApp = useNuxtApp();
    const router = useRouter();

    if (routes === null) {
      throw createError({
        statusCode: 500,
        message: `Произошла ошибка при обращении к GET "/api/routes".`
      });
    }

    const isInDb = useRouteFindByPath(routes.value, to.path);

    if (!isInDb) {
      throw createError({
        statusCode: 404,
        message: `Страница ${to.path} не найдена`
      });
    } else {
      nuxtApp.provide('currentPage', isInDb);
      const CanvasComponent = () => import(`~/components/${isInDb.component}.vue`);

      router.addRoute({
        path: isInDb.path,
        name: isInDb.path,
        component: CanvasComponent,
        props: true
      });

      router.push(isInDb.path);
    }
  }
});
</script>

<template>
  <router-view :heading="'hi!!'">
    <!-- <component :is="Component" :key="path" :heading="'hi!!'" /> -->
  </router-view>
  <!-- <main class="page-content">
    <CanvasComponent :heading="'hi!!'" :description="'Lol, how about that'" :plain-text="'LOL'" />
    <LazySectionForm />
  </main> -->
</template>
