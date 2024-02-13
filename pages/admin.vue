<script setup lang="ts">
import { useAllRoutes } from '~/composables/routes';
import ADMIN_PAGES from '~/utils/constants';
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
  <div class="admin">
    <ul>
      <li v-for="({ id, title }, index) in ADMIN_PAGES" :key="index">
        <MenuButton
          :title="title"
          :id="id"
          :what-page-is-shown="whatPageIsShown"
          @click="handleMenuButtonClick(id)"
        />
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
  </div>
</template>

<style lang="scss">
@import url('../assets/styles/base.css');
.admin {
  display: flex;
  margin: 0 auto;
  gap: 80px;

  ul li:not(:last-of-type) {
    margin-bottom: 10px;
  }
}
</style>
