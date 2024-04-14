<script setup lang="ts">
// данные о странице от router
const props = defineProps(['routeData']);
provide('canvas', 'four');
</script>

<template>
  <CanvasWrapper :route-data="props.routeData" />
</template>
