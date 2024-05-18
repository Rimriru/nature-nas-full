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
.menu-btn {
  display: inline-block;
  margin: 0;
  padding: 5px;
  overflow: visible;
  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;
  border: 0;
  background-color: transparent;
  color: inherit;
  font-size: 0;
  text-transform: none;
  cursor: pointer;

  .menu-btn__inner {
    transition-duration: 0.075s;
    transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);

    &::before {
      transition: top 0.075s 0.12s ease, opacity 0.075s ease;
    }

    &::after {
      transition: bottom 0.075s 0.12s ease, transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
  }

  &.is-active {
    .menu-btn__inner {
      transform: rotate(45deg);
      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transition-delay: 0.12s;

      &::before {
        top: 0;
        transition: top 0.075s ease, opacity 0.075s 0.12s ease;
        opacity: 0;
      }

      &::after {
        bottom: 0;
        transform: rotate(-90deg);
        transition: bottom 0.075s ease, transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
      }
    }
  }
}

.menu-btn__block {
  display: inline-block;
  position: relative;
  width: 35px;
  height: 35px;
}

.menu-btn__inner {
  display: block;
  top: 50%;
  transform: translateY(-50%);

  &,
  &::before,
  &::after {
    position: absolute;
    width: 35px;
    height: 2.5px;
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: ease;
    background-color: #fff;
  }

  &::before,
  &::after {
    content: '';
    display: block;
  }

  &::before {
    top: (6px + 3px) * -1;
  }

  &::after {
    bottom: (6px + 3px) * -1;
  }
}
</style>
