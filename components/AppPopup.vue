<script setup lang="ts">
const props = defineProps(['isOpened']);
const emit = defineEmits(['onClose']);
</script>

<template>
  <div class="popup" :class="{ popup__opened: props.isOpened }" @click.self="emit('onClose')">
    <div class="popup__container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/appPopup.scss');
</style>
