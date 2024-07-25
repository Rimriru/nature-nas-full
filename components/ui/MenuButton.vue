<script setup lang="ts">
type ButtonType = 'button' | 'submit' | 'reset';
type Size = 'small' | 'middle';
defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as () => Size
  },
  buttonType: {
    type: String as () => ButtonType,
    default: 'button'
  }
});
</script>

<template>
  <button
    :class="{
      'menu-button_active': isActive,
      'menu-button_disabled': isDisabled,
      'menu-button_size_small': size === 'small',
      'menu-button_size_middle': size === 'middle'
    }"
    class="menu-button button"
    :type="buttonType"
    :disabled="isDisabled"
  >
    <slot />
  </button>
</template>

<style lang="scss">
@import url('~/assets/styles/components/ui/menuButton.scss');
</style>
