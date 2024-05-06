<script setup lang="ts">
defineProps<{
  placeholder: string;
}>();

const descriptionModel = defineModel();
</script>

<template>
  <UFormGroup name="description">
    Описание
    <span class="required">*</span>
    <UTextarea size="lg" :rows="13" resize v-model="descriptionModel" :placeholder="placeholder" />
  </UFormGroup>
</template>

<style scoped></style>
