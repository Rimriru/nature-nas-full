<script setup lang="ts"></script>

<template>
  <main class="page-content">
    <p class="title">Ты на главной!</p>
    <div class="links">
      <NuxtLink to="/admin">To admin</NuxtLink>
      <NuxtLink to="/look">To Canvas One</NuxtLink>
    </div>
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
