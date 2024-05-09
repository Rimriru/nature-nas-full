<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);
const closingSideEffects = ref<any[]>([]);

const handlePopupClose = () => {
  emit('close');
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
  <AppPopup :is-opened="isOpen" @on-close="handlePopupClose">
    <ConfForm :is-in-popup="true" @on-close="handlePopupClose" @pass="handlePassingSideEffects" />
  </AppPopup>
</template>

<style lang="scss"></style>
