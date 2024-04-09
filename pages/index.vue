<script setup lang="ts">
const linkGroups = await useLinkGroups();
</script>

<template>
  <main class="main">
    <p class="title">Ты на главной!</p>
    <div class="links">
      <NuxtLink to="/admin">To admin</NuxtLink>
      <NuxtLink to="/look">To Canvas One</NuxtLink>
    </div>
    {{ linkGroups }}
  </main>
</template>

<style lang="scss">
.title {
  font-size: 19px;
  text-align: center;
  margin-bottom: 5px;
}
.links {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
