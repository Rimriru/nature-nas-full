<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['onClose']);
const closingSideEffects = ref<any[]>([]);

const handlePopupClose = () => {
  emit('onClose');
  if (closingSideEffects.value && closingSideEffects.value.length) {
    for (const handler of closingSideEffects.value) {
      handler();
    }
  }
};

const handlePassingSideEffects = ([...sideEffects]) => {
  closingSideEffects.value = sideEffects;
};
</script>

<template>
  <AppPopup :is-opened="isOpen" :is-news-form-inside="true" @on-close="handlePopupClose">
    <NewsForm :is-in-popup="true" @on-close="handlePopupClose" @pass="handlePassingSideEffects" />
  </AppPopup>
</template>

<style lang="scss"></style>
