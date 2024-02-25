<script setup lang="ts">
const links = await useFetch('/api/links');
</script>

<template>
  <div>
    {{ links }}
  </div>
</template>

<style lang="scss"></style>
