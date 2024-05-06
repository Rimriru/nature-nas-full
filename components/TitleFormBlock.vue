<script setup lang="ts">
defineProps<{
  placeholder: string;
}>();

const titleModel = defineModel();
</script>

<template>
  <UFormGroup name="title">
    Заголовок
    <span class="required">*</span>
    <UInput size="lg" v-model="titleModel" :placeholder="placeholder" />
  </UFormGroup>
</template>

<style scoped></style>
