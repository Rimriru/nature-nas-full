<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();
</script>

<template>
  <div v-if="isVisible" class="loader-bg">
    <div class="loader"></div>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/ui/loader.scss');
</style>
