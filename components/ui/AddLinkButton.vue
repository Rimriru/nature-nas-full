<script setup lang="ts">
defineProps<{
  color: 'dark-blue' | 'mid-blue' | 'white';
  size: 'sm' | 'md';
  rounded?: boolean;
}>();

const emit = defineEmits(['onClick']);
</script>

<template>
  <button
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
@use '~/assets/styles/variables.scss' as *;

.add-link-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  &_color_dark-blue {
    background-color: $dark-blue;
  }

  &_color_mid-blue {
    background-color: $mid-blue;
  }

  &_color_white {
    border: $mid-blue 1px solid;
  }

  &_size_small {
    height: 40px;
  }

  &_size_normal {
    height: 48px;
  }

  &_rounded {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .add-link-btn__plus {
    background-image: url('~/assets/images/plus-icon-light.svg');
    width: 20px;
    height: 20px;
    background-size: 100%;
    background-repeat: no-repeat;

    &_color_dark {
      background-image: url('~/assets/images/plus-icon-dark.svg');
    }
  }
}
</style>
