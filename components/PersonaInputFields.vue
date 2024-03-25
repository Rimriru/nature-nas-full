<script setup lang="ts">
import type { ModelRef } from 'vue';
import type PersonaData from '~/types/PersonasDataFromDb';
const model: ModelRef<PersonaData | undefined, string> = defineModel('personaData');
const emit = defineEmits(['onPhotoChange']);
const props = defineProps(['photo']);
const photoForPreview = ref<string>('');

const onPhotoChange = (event: Event) => {
  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length > 0) {
    const file = fileInputData.files[0];
    emit('onPhotoChange', file);
    photoForPreview.value = URL.createObjectURL(file);
  }
};

onMounted(() => {
  if (props.photo) {
    photoForPreview.value = props.photo;
  }
});
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
        accept="image/jpeg, image/png"
        @change="onPhotoChange"
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
        <img v-if="photoForPreview" :src="photoForPreview" />
      </p>
    </label>
  </fieldset>
</template>

<style lang="scss"></style>
