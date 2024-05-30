<script setup lang="ts">
defineProps<{
  color: 'dark-blue' | 'mid-blue' | 'white';
  size: 'sm' | 'md';
  rounded?: boolean;
}>();

const emit = defineEmits(['onClick']);

const isLoggedIn = useLoggedInState();
</script>

<template>
  <button
    v-if="isLoggedIn"
    :class="[
      {
        'add-link-btn_color_dark-blue': color === 'dark-blue',
        'add-link-btn_color_mid-blue': color === 'mid-blue',
        'add-link-btn_color_white': color === 'white',
        'add-link-btn_size_small': size === 'sm',
        'add-link-btn_size_normal': size === 'md',
        'add-link-btn_rounded': rounded
      },
      'add-link-btn',
      'button'
    ]"
    type="button"
    @click="emit('onClick')"
  >
    <div
      :class="[{ 'add-link-btn__plus_color_dark': color === 'white' }, 'add-link-btn__plus']"
    ></div>
  </button>
</template>

<style lang="scss">
@import url('~/assets/styles/components/ui/addLinkButton.scss');
</style>
