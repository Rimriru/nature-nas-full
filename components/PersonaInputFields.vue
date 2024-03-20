<script setup lang="ts">
import type { PersonaData } from '~/types/PersonasDataFromDb';

const personaDataFromCanvas: Ref<PersonaData> | undefined = inject('personaData');
</script>

<template>
  <UFormGroup name="name">
    Имя (ФИО)
    <span class="required">*</span>
    <UInput v-model="personaDataFromCanvas!.name" />
  </UFormGroup>
  <UFormGroup name="telNumber">
    Тел.
    <UInput v-model="personaDataFromCanvas!.telNumber" />
  </UFormGroup>
  <UFormGroup name="faxNumber">
    Тел./факс
    <UInput v-model="personaDataFromCanvas!.faxNumber" />
  </UFormGroup>
  <UFormGroup name="email">
    Email
    <UInput v-model="personaDataFromCanvas!.email" />
  </UFormGroup>
  <UFormGroup name="description">
    Описание
    <UInput v-model="personaDataFromCanvas!.description" />
  </UFormGroup>
  <label for="personaPhoto">
    Загрузить фото для галереи:
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
      {{
        personaDataFromCanvas!.photo ? (personaDataFromCanvas!.photo as unknown as File).name : ''
      }}
    </p>
  </label>
</template>

<style lang="scss"></style>
