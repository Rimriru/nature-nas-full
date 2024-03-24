<script setup lang="ts">
import type { ModelRef } from 'vue';
import type PersonaData from '~/types/PersonasDataFromDb';
const model: ModelRef<PersonaData | undefined, string> = defineModel('personaData');
</script>

<template>
  <fieldset>
    <legend>Контакт</legend>
    <UFormGroup name="name">
      Имя (ФИО)
      <UInput v-model="model!.name" />
    </UFormGroup>
    <UFormGroup name="telNumber">
      Тел.
      <UInput v-model="model!.telNumber" />
    </UFormGroup>
    <UFormGroup name="faxNumber">
      Тел./факс
      <UInput v-model="model!.faxNumber" />
    </UFormGroup>
    <UFormGroup name="email">
      Email
      <UInput v-model="model!.email" />
    </UFormGroup>
    <UFormGroup name="description">
      Описание
      <UInput v-model="model!.description" />
    </UFormGroup>
    <label for="personaPhoto">
      Загрузить фото контакта:
      <input
        style="display: none"
        id="personaPhoto"
        type="file"
        ref="personaPhotoInput"
        accept="image/gif, image/jpeg, image/png"
      />
      <UButton
        color="blue"
        variant="soft"
        @click="($refs.personaPhotoInput as HTMLInputElement).click()"
      >
        Выбрать файл
      </UButton>
      <p>
        Загруженный файл:
        <!-- {{ props.personaData.photo ? (props.personaData.photo as unknown as File).name : '' }} -->
      </p>
    </label>
  </fieldset>
</template>

<style lang="scss"></style>
