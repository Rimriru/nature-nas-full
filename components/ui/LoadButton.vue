<script setup lang="ts">
const emit = defineEmits(['onClick']);
</script>

<template>
  <UButton color="blue" variant="soft" @click="emit('onClick')">
    <UIcon name="i-material-symbols-attach-file-rounded" />
    Выбрать файл
  </UButton>
</template>

<style lang="scss"></style>
