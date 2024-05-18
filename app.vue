<script setup lang="ts">
import { canvases } from '~/utils/canvasesData';

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

if (!routesState.value.length) {
  const routes = await useAllRoutes();
  routesState.value = routes;
}

if (!linkGroupsState.value.length) {
  const linkGroups = await useLinkGroups();
  linkGroupsState.value = linkGroups;
}

const filesFromDb = await useFiles();
const photoFromDb = await useMainPhotoRequest();
const news = await useNewsRequest();
const contacts = await useContacts();
const conferencesFromDb = await useConfs();

const router = useRouter();
photoState.value = photoFromDb;
newsState.value = news;
contactsState.value = contacts;
conferenceState.value = conferencesFromDb;
filesState.value = filesFromDb;

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
