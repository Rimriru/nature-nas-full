<script setup lang="ts">
import { canvases } from '~/utils/canvasesData';

const routesState = useRoutesState();
const linkGroupsState = useLinkGroupsState();
const photoState = useMainPhotoState();
const newsState = useNewsState();

const routes = await useAllRoutes();
const linkGroups = await useLinkGroups();
const photoFromDb = await useMainPhotoRequest();
const news = await useNewsRequest();
const router = useRouter();

routesState.value = routes;
linkGroupsState.value = linkGroups;
photoState.value = photoFromDb;
newsState.value = news;

routes.forEach((route) => {
  router.addRoute({
    path: route.path,
    name: route.name,
    component: canvases[route.component],
    props: {
      routeData: route
    }
  });
});
</script>

<template>
  <NuxtLayout>
    <div class="layout">
      <HeadingImage />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
