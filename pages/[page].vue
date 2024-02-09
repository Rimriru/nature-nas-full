<script setup lang="ts">
definePageMeta({
  middleware: async (to) => {
    const { data } = await useFetch('/api/routes');
    // TODO: добавить тип routeFromDb вместо any
    const isInDb = data.value?.find((routeFromDb: any) => routeFromDb.path === to.path);

    if (!isInDb) {
      console.log('Not going!');
      return navigateTo('/');
    }
  }
});
</script>

<template>
  <p>{{ $route.params.page }}</p>
</template>
