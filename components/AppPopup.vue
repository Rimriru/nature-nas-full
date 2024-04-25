<script setup lang="ts">
const props = defineProps(['isOpened', 'isNewsFormInside']);
const emit = defineEmits(['onClose']);
</script>

<template>
  <div class="popup" :class="{ popup__opened: props.isOpened }" @mousedown.self="emit('onClose')">
    <div :class="['popup__container', { popup__container_large: isNewsFormInside }]">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/appPopup.scss');
</style>
