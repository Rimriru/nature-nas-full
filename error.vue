<script setup lang="ts">
defineProps(['error']);
</script>

<template>
  <div class="error">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <NuxtLink to="/">Вернуться на главную</NuxtLink>
  </div>
</template>

<style lang="scss"></style>
