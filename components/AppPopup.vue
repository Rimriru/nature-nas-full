<script setup lang="ts">
const props = defineProps(['isOpened', 'isNewsFormInside']);
const emit = defineEmits(['onClose']);
</script>

<template>
  <Transition>
    <div v-if="props.isOpened" class="popup" @mousedown.self="emit('onClose')">
      <div :class="['popup__container', { popup__container_large: isNewsFormInside }]">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import url('~/assets/styles/components/appPopup.scss');

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
