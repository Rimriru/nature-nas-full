<script setup lang="ts">
import { ADMIN_PAGES } from '~/utils/constants';
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const whatPageIsShown = ref('page-creation');
const routes = ref<RouteDataFromDb[]>([]);

// Fetching all routes from database
const data = await useAllRoutes();
routes.value = data ? data : [];

const handleMenuButtonClick = (pageId: string) => {
  whatPageIsShown.value = pageId;
};

const handleRouteCreation = (newRoute: RouteDataFromDb) => {
  routes.value.push(newRoute);
};

const handleRouteRemoval = (existingRoute: RouteDataFromDb) => {
  routes.value = routes.value.filter((route) => route.path !== existingRoute.path);
};
</script>

<template>
  <main class="admin">
    <ul>
      <li v-for="({ id, title }, index) in ADMIN_PAGES" :key="index">
        <MenuButton
          :is-active="whatPageIsShown === id ? true : false"
          @click="handleMenuButtonClick(id)"
          >{{ title }}</MenuButton
        >
      </li>
    </ul>
    <PageCreation
      v-if="whatPageIsShown === 'page-creation'"
      :routes-from-db="routes"
      @submit="handleRouteCreation"
    />
    <PagesList
      v-if="whatPageIsShown === 'pages-list'"
      :routes-from-db="routes"
      @remove="handleRouteRemoval"
    />
    <LinksList v-if="whatPageIsShown === 'links-list'" :is-in-admin-page="true" />
    <NewsCreation v-if="whatPageIsShown === 'add-news'" />
  </main>
</template>

<style lang="scss">
@import url('../assets/styles/base.css');
.admin {
  max-width: 1400px;
  display: flex;
  margin: 0 auto;
  gap: 50px;
  padding-block: 50px;

  ul li:not(:last-of-type) {
    margin-bottom: 10px;
  }
}
</style>
