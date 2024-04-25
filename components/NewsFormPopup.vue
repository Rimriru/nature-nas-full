<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['onClose']);
</script>

<template>
  <AppPopup :is-opened="isOpen" :is-news-form-inside="true" @on-close="emit('onClose')">
    <NewsForm :is-in-popup="true" @on-close="emit('onClose')" />
  </AppPopup>
</template>

<style lang="scss"></style>
