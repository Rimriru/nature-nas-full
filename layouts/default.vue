<script setup lang="ts">
const isLoaderVisible = useLoaderVisibilityState();
</script>

<template>
  <div class="layout">
    <AppHeader />
    <slot />
    <AppFooter />
    <UNotifications />
    <Loader :is-visible="isLoaderVisible" />
  </div>
</template>

<style lang="scss">
.layout {
  min-height: 100vh;
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
