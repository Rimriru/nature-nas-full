<script setup lang="ts">
// данные о странице от router
const props = defineProps(['routeData']);
provide('canvas', 'six');
</script>

<template>
  <CanvasWrapper :route-data="props.routeData" />
</template>
