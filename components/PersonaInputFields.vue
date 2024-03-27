<script setup lang="ts">
import type { ModelRef } from 'vue';
import type PersonaData from '~/types/PersonasDataFromDb';
const model: ModelRef<PersonaData | undefined, string> = defineModel('personaData');
const emit = defineEmits(['onPhotoChange']);
const props = defineProps(['photo']);
const photoForPreview = ref<string>('');
const config = useRuntimeConfig();

const onPhotoChange = (event: Event) => {
  photoForPreview.value = '';
  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length > 0) {
    const file = fileInputData.files[0];
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
    <legend class="persona-fieldset__title">Контакт</legend>
    <div class="persona-fieldset__main-block">
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
          Выбрать файл
        </UButton>
        <p class="persona-fieldset__perview">
          Загруженный файл:
          <img v-if="photoForPreview" :src="photoForPreview" />
          <span v-else>отсутствует</span>
        </p>
      </label>
      <div class="persona-fieldset__main-info">
        <UFormGroup name="position">
          Должность
          <UInput v-model="model!.position" placeholder="Введите должность..." />
        </UFormGroup>
        <UFormGroup name="name">
          Имя (ФИО)
          <UInput v-model="model!.name" placeholder="Введите имя..." />
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
.persona-fieldset {
  .persona-fieldset__title {
    font-size: 1.3rem;
    margin-bottom: 5px;
  }

  .persona-fieldset__main-block {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 15px;

    .persona-fieldset__photo {
      display: inline;

      .persona-fieldset__perview {
        margin-top: 10px;
        img {
          width: 200px;
          height: 250px;
          border-radius: 10px;
        }
      }
    }

    .persona-fieldset__main-info {
      flex-basis: 300px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }

  .persona-fieldset__description {
    max-width: 800px;
    margin: 0 auto;

    input {
      height: 50px;
    }
  }
}
</style>
