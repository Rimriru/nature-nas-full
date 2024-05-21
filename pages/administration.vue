<script setup lang="ts">
const title = 'Администрация';

useSeoMeta({
  title
});

definePageMeta({
  title: 'Администрация'
});

const personasState = usePersonasState();

const administrationPersonas = computed(() => {
  return personasState.value.filter((persona) => persona.placement === 'admins');
});
</script>

<template>
  <main class="main">
    <PersonasList :placement="'admins'" :personas="administrationPersonas" />
  </main>
</template>

<style lang="scss"></style>
