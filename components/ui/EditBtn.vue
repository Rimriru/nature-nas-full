<script setup lang="ts">
defineProps<{
  color: 'gray' | 'black';
}>();

const isLoggedIn = useLoggedInState();
</script>

<template>
  <button
    v-if="isLoggedIn"
    :class="[
      { 'edit-btn_color_black': color === 'black' },
      { 'edit-btn_color_gray': color === 'gray' },
      'edit-btn',
      'button'
    ]"
    type="button"
  />
</template>

<style lang="scss">
.edit-btn {
  width: 24px;
  height: 24px;
  background-size: 100%;
  background-repeat: no-repeat;

  &_color_black {
    background-image: url('~/assets/images/edit-btn-black.svg');
  }

  &_color_gray {
    background-image: url('~/assets/images/edit-btn-gray.svg');
  }
}
</style>
