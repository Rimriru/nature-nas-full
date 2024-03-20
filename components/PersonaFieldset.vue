<script setup lang="ts">
const props = defineProps(['personasOptions']);
const chosenPersona = defineModel('chosenPersona');
</script>

<template>
  <fieldset>
    <legend>Контакт</legend>
    Выбрать существующий:
    <UInputMenu :options="props.personasOptions" v-model="chosenPersona" option-attribute="name" />
    Создать новый:
    <PersonaInputFields @update:model-value="(val) => console.log(val)" />
  </fieldset>
</template>

<style lang="scss"></style>
