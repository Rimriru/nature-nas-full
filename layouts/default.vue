<template>
  <div class="layout">
    <AppHeader />
    <slot />
    <AppFooter />
    <UNotifications />
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
