<script setup lang="ts">
definePageMeta({
  middleware: async (to) => {
    const nuxtApp = useNuxtApp();
    const routes = await nuxtApp.runWithContext(() => useAllRoutes());

    const links = await nuxtApp.runWithContext(() => useLinks());
    const linksState = useLinksState();
    linksState.value = links.value;

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
      const CanvasComponent = () => import(`~/components/${isInDb.component}.vue`);

      router.addRoute({
        path: isInDb.path,
        name: isInDb.path,
        component: CanvasComponent,
        props: {
          routeData: isInDb
        }
      });

      router.push(isInDb.path);
    }
  }
});
</script>

<template></template>
