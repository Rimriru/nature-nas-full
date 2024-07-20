<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  isUploadingJurnalIssue: boolean;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('close')">
    <FileLoadForm
      :is-uploading-journal-issue="isUploadingJurnalIssue"
      :is-popup-open="isOpen"
      @close="emit('close')"
    >
      <MenuButton :size="'small'" @click="emit('close')">Отмена</MenuButton>
    </FileLoadForm>
  </AppPopup>
</template>

<style lang="scss"></style>
