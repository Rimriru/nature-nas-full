<script setup lang="ts">
const props = defineProps(['icon']);
</script>

<template>
  <div class="icon" :style="{ backgroundImage: `url(${props.icon})` }"></div>
</template>

<style lang="scss">
.icon {
  width: 24px;
  height: 24px;
  background-size: 100%;
}
</style>
