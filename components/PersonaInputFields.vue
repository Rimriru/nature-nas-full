<script setup lang="ts">
import type { ModelRef } from 'vue';
import type PersonaData from '~/types/PersonasDataFromDb';

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
  if (fileInputData.files && fileInputData.files.length > 0) {
    const file = fileInputData.files[0];
    if (file.size > 5242880)
      return (photoError.value = 'Размер загружаемого файла превышает 5 мб!');
    emit('onPhotoChange', file);
    photoForPreview.value = URL.createObjectURL(file);
  } else {
    emit('onPhotoChange', '');
  }
};

onMounted(() => {
  if (props.photo) {
    photoForPreview.value = `${config.public.domen}/image/${props.photo}`;
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
          <UButton
            color="blue"
            variant="soft"
            @click="($refs.personaPhotoInput as HTMLInputElement).click()"
          >
            <UIcon name="i-material-symbols-attach-file-rounded" />
            Выбрать файл
          </UButton>
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
      <UTextarea v-model="model!.description" placeholder="Начните вводить описание контакта..." />
    </UFormGroup>
  </fieldset>
</template>

<style lang="scss">
@import url('~/assets/styles/components/personaInputFields.scss');
</style>
