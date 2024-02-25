<script setup lang="ts">
type ButtonType = 'button' | 'submit' | 'reset';
defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  isSmall: {
    type: Boolean,
    default: false
  },
  buttonType: {
    type: String as () => ButtonType,
    default: 'button'
  }
});
</script>

<template>
  <button
    :class="{ 'menu-button_active': isActive, 'menu-button_size_small': isSmall }"
    class="menu-button"
    :type="buttonType"
  >
    <slot />
  </button>
</template>

<style lang="scss">
@import url('~/assets/styles/components/menuButton.scss');
</style>
