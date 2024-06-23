<script setup lang="ts">
const isLoaderVisible = useLoaderVisibilityState();
const scroll = ref(0);

const handleScroll = () => {
  scroll.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="layout" ref="element">
    <AppHeader />
    <slot />
    <AppFooter />
    <UNotifications />
    <Loader :is-visible="isLoaderVisible" />
    <Transition>
      <UpButton v-show="scroll > 0" />
    </Transition>
  </div>
</template>

<style lang="scss">
.layout {
  min-height: 100dvh;
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
