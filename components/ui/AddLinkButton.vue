<script setup lang="ts">
const props = defineProps<{
  color: 'blue' | 'white';
}>();

const emit = defineEmits(['onClick']);
</script>

<template>
  <button
    :class="[
      {
        'add-link-btn_color_blue': props.color === 'blue',
        'add-link-btn_color_white': props.color === 'white'
      },
      'add-link-btn'
    ]"
    type="button"
    @click="emit('onClick')"
  />
</template>

<style lang="scss">
.add-link-btn {
  width: 250px;
  height: 50px;
  background-size: 100%;

  &_color_blue {
    background-image: url('~/assets/images/add-link-btn-blue.svg');
  }

  &_color_white {
    background-image: url('~/assets/images/add-link-btn-white.svg');
  }
}
</style>
