<script setup lang="ts">
const title = 'Администрация';

useSeoMeta({
  title,
  description: 'Администрация Института природопользования НАН Беларуси'
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
  <PersonasList :placement="'admins'" :personas="administrationPersonas" />
</template>

<style lang="scss"></style>
