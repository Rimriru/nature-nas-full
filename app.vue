<script setup lang="ts">
import { canvases } from '~/utils/canvasesData';
import type InitialDataType from './types/InitialDataFormDb';

const loggedInState = useLoggedInState();
const token = useCookie('jwt');

if (token.value !== undefined) {
  loggedInState.value = true;
}

const routesState = useRoutesState();
const linkGroupsState = useLinkGroupsState();
const photoState = useMainPhotoState();
const newsState = useNewsState();
const contactsState = useContactsState();
const conferenceState = useConfsState();
const filesState = useFilesState();
const personasState = usePersonasState();

if (!routesState.value.length) {
  const routes = await useAllRoutes();
  routesState.value = routes;
}

if (!linkGroupsState.value.length) {
  const linkGroups = await useLinkGroups();
  linkGroupsState.value = linkGroups;
}

// @ts-ignore
const initialData: InitialDataType = await $fetch('/api/data');

const router = useRouter();
photoState.value = initialData.photo;
newsState.value = initialData.news;
contactsState.value = initialData.contacts;
conferenceState.value = initialData.confs;
filesState.value = initialData.files;
personasState.value = initialData.personas;

routesState.value.forEach((route) => {
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
