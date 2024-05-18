<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();
</script>

<template>
  <HeaderLinks :class="['header__bottom-links_menu', { 'header__bottom-links_open': isOpen }]" />
</template>

<style lang="scss"></style>
