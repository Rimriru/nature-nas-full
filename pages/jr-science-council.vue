<script setup lang="ts">
const title = 'Совет молодых ученых';

useSeoMeta({
  title
});

definePageMeta({
  title: 'Совет молодых ученых'
});

const personasState = usePersonasState();

const jouniorCouncilPersonas = computed(() => {
  return personasState.value.filter((persona) => persona.placement === 'jr-council');
});
</script>

<template>
  <main class="main">
    <PersonasList :placement="'jr-council'" :personas="jouniorCouncilPersonas" />
  </main>
</template>

<style lang="scss"></style>
