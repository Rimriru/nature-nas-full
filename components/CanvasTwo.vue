<script setup lang="ts">
// данные о странице от router
const { routeData } = defineProps(['routeData']);
const routeId: string = routeData._id;

// запрос на контент
const { data: content } = await useFetch(`/api/content/${routeId}`, {
  watch: false,
  pick: ['_id', 'title', 'description', 'text', 'sections', 'photos', 'personaOne']
});

provide('canvas', 'two');
</script>

<template>
  <CanvasWrapper :route-id="routeId" :content="content" />
</template>
