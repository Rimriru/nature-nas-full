<script setup lang="ts">
const props = defineProps(['routesFromDb']);
const emit = defineEmits(['remove']);

const links = useLinksState();

const handleRouteRemove = async (routeId: string, path: string) => {
  const removedRoute = await useFetch(`/api/routes/${routeId}`, {
    method: 'delete'
  });
  links.value = links.value.filter((link) => link.to !== path);
  emit('remove', removedRoute.data.value);
};
</script>

<template>
  <ol class="pages-list">
    Список созданных страниц:
    <li v-for="{ path, _id: id } in props.routesFromDb" :key="id">
      {{ path }}
      <RemoveBtn @click="handleRouteRemove(id, path)" />
    </li>
  </ol>
</template>

<style>
.pages-list {
  list-style: decimal;
}
</style>
