<script setup lang="ts">
const props = defineProps(['routesFromDb']);
const emit = defineEmits(['remove']);

const handleRouteRemove = async (routeId: string) => {
  const removedRoute = await useFetch(`/api/routes/${routeId}`, {
    method: 'delete'
  });
  emit('remove', removedRoute.data.value);
};
</script>

<template>
  <ol class="pages-list">
    Список созданных страниц:
    <li v-for="{ path, _id: id } in props.routesFromDb" :key="id">
      {{ path }}
      <button
        v-if="!path.startsWith('/admin')"
        @click="handleRouteRemove(id)"
        class="remove-btn-small"
      ></button>
    </li>
  </ol>
</template>

<style>
.pages-list {
  list-style: decimal;
}
</style>
