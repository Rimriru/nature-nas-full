<script setup lang="ts"></script>

<template>
  <main>
    <p>Ты на главной!</p>
    <NuxtLink to="/admin">To admin</NuxtLink>
    <ClientOnly>
      <NuxtLink to="/look" external>To Canvas One</NuxtLink>
    </ClientOnly>
  </main>
</template>

<style></style>
