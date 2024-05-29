<script setup lang="ts">
const props = defineProps<{
  isActive: boolean;
}>();

const emit = defineEmits(['click']);
</script>

<template>
  <button
    :class="['menu-btn', { 'is-active': isActive }]"
    type="button"
    aria-label="Menu"
    aria-controls="navigation"
    @click="emit('click')"
  >
    <span class="menu-btn__block">
      <span class="menu-btn__inner"></span>
    </span>
  </button>
</template>

<style lang="scss">
@import url('~/assets/styles/components/ui/burgerButton.scss');
</style>
