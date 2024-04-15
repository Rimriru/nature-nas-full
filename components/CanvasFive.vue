<script setup lang="ts">
// данные о странице от router
const { routeData } = defineProps(['routeData']);

const routeId: string = routeData._id;

const { data: content } = await useFetch(`/api/content/${routeId}`, {
  watch: false,
  pick: ['_id', 'title', 'text', 'sections', 'photos']
});

provide('canvas', 'five');
</script>

<template>
  <CanvasWrapper :route-id="routeId" :content="content" />
</template>
