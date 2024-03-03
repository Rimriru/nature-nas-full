<script setup lang="ts">
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const removeRouteError = ref('');

const links = useLinksState();
const routesFromDb = useRoutesState();
const notifications = useToast();

const handleRouteRemove = async (routeId: string, path: string) => {
  const { data, error } = await useFetch(`/api/routes/${routeId}`, {
    method: 'delete'
  });
  if (data.value?.message) {
    links.value = links.value.filter((link) => link.to !== path);
    routesFromDb.value = routesFromDb.value.filter((route: RouteDataFromDb) => route.path !== path);
    notifications.add({ id: 'route-remove', title: data.value.message });
  } else {
    removeRouteError.value = error.value?.data.message;
  }
};
</script>

<template>
  <div>
    <UAlert v-if="removeRouteError" :title="removeRouteError" color="sky" variant="soft" />
    <ol class="pages-list">
      Список созданных страниц:
      <li v-for="{ path, _id: id } in routesFromDb" :key="id">
        {{ path }}
        <RemoveBtn @click="handleRouteRemove(id, path)" />
      </li>
    </ol>
  </div>
</template>

<style>
.pages-list {
  list-style: decimal;
}
</style>
