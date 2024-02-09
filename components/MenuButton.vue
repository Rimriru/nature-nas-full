<script setup lang="ts">
defineProps({
  id: String,
  title: String,
  whatPageIsShown: String
});
</script>

<template>
  <button :class="whatPageIsShown === id ? 'menu-button_active' : ''" class="menu-button">
    {{ title }}
  </button>
</template>

<style lang="scss">
@import url('../assets/styles/components/menuButton.scss');
</style>
