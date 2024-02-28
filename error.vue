<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
});
</script>

<template>
  <div class="error">
    <h1>{{ props.error?.statusCode }}</h1>
    <p>{{ props.error?.message }}</p>
    <NuxtLink to="/" replace external>Вернуться на главную</NuxtLink>
  </div>
</template>

<style lang="scss"></style>
