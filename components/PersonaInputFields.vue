<script setup lang="ts">
import { fileSizeError } from '~/utils/errorMessages';
import type { ModelRef } from 'vue';
import type { PersonaData } from '~/types/PersonasDataFromDb';

const model: ModelRef<PersonaData | undefined, string> = defineModel('personaData');
const emit = defineEmits(['onPhotoChange']);
const props = defineProps(['photo', 'heading']);
const photoForPreview = ref<string>('');
const config = useRuntimeConfig();
const photoError = ref('');

const onPhotoChange = (event: Event) => {
  photoError.value = '';
  photoForPreview.value = '';
  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 5000000) return (photoError.value = fileSizeError('5'));
    emit('onPhotoChange', file);
    photoForPreview.value = URL.createObjectURL(file);
  } else {
    emit('onPhotoChange', '');
  }
};

onMounted(() => {
  if (props.photo) {
    photoForPreview.value = `${
      config.public.process === 'production' ? '' : config.public.domen
    }/image/${props.photo}`;
  }
});
</script>

<template>
  <fieldset class="persona-fieldset">
    <legend class="persona-fieldset__title">{{ props.heading ? props.heading : 'Контакт' }}</legend>
    <div class="persona-fieldset__main-block">
      <div>
        <span class="required persona-fieldset__photo-err">{{ photoError }}</span>
        <label for="personaPhoto" class="persona-fieldset__photo">
          Загрузить фото контакта:
          <input
            style="display: none"
            id="personaPhoto"
            type="file"
            ref="personaPhotoInput"
            accept="image/jpeg, image/png"
            @change="onPhotoChange"
          />
          <LoadButton @on-click="($refs.personaPhotoInput as HTMLInputElement).click()" />
          <p class="persona-fieldset__perview">
            Загруженный файл:
            <img v-if="photoForPreview" :src="photoForPreview" />
            <span v-else>отсутствует</span>
          </p>
        </label>
      </div>
      <div class="persona-fieldset__main-info">
        <UFormGroup name="position">
          Должность
          <UInput v-model="model!.position" placeholder="Введите должность..." />
        </UFormGroup>
        <UFormGroup name="name">
          Имя (ФИО)
          <UInput v-model="model!.name" placeholder="Введите имя..." />
        </UFormGroup>
        <UFormGroup name="phd">
          Специальность
          <UInput v-model="model!.phd" placeholder="Введите специальность..." />
        </UFormGroup>
        <UFormGroup name="telNumber">
          Тел.
          <UInput v-model="model!.telNumber" placeholder="Введите номер телефона..." />
        </UFormGroup>
        <UFormGroup name="faxNumber">
          Тел./факс
          <UInput v-model="model!.faxNumber" placeholder="Введите факс..." />
        </UFormGroup>
        <UFormGroup name="email">
          Email
          <UInput v-model.trim="model!.email" placeholder="Введите электронную почту..." />
        </UFormGroup>
      </div>
    </div>
    <UFormGroup class="persona-fieldset__description" name="description">
      Описание
      <UTextarea
        v-model="model!.description"
        :rows="5"
        resize
        placeholder="Начните вводить описание контакта..."
      />
    </UFormGroup>
  </fieldset>
</template>

<style lang="scss">
@import url('~/assets/styles/components/personaInputFields.scss');
</style>
