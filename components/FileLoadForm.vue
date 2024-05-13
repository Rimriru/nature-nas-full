<script setup lang="ts">
import { fileSizeError } from '~/utils/errorMessages';
import type { FormError } from '#ui/types';

const uploadedFile = reactive({
  title: '',
  file: ''
});
const fileForUpload = ref<File | ''>('');
const fileUpload = ref< HTMLInputElement | null >(null);
const fileError = ref('');

const filesState = useFilesState();
const notifications = useToast();
const isLoaderVisible = useLoaderVisibilityState();


const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title) errors.push({ path: 'title', message: 'Поле "Название" является обязательным' });
  return errors;
}

const onFileChange = (event: Event) => {
  fileError.value = '';
  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 136314880) return (fileError.value = fileSizeError('130'));
    fileForUpload.value = file;
  } else {
    fileForUpload.value = '';
  }
};

const resetFormFields = () => {
  if (fileUpload.value) {
    fileUpload.value.value = '';
  }
  uploadedFile.title = '';
  uploadedFile.file = '';
  fileForUpload.value = '';
}

const onFileFormSubmit = async () => {
  if (!fileForUpload.value) {
    fileError.value = 'Необходимо загрузить файл!';
    return;
  } else {
    isLoaderVisible.value = true;
    const body = new FormData();
    body.append('file', fileForUpload.value);

    await $fetch('/api/files/upload', {
      method: 'post',
      body,
      onResponse ({ response }) {
        if (response?.ok) {
          uploadedFile.file = response._data;
        } else {
          notifications.add({ id: 'file', title: `${response.status}: ${response._data.message}` });
          isLoaderVisible.value = false;
          return;
        }
      }
    });

    const newFileBody = {
      name: uploadedFile.title,
      file: uploadedFile.file
    }

    try {
      const newFile = await $fetch('/api/files', {
        method: 'post',
        body: newFileBody
      });
      filesState.value = [ ...filesState.value, newFile ];
      notifications.add({ id: 'file', title: `Файл "${newFileBody.name}" загружен!` });
      resetFormFields();
      isLoaderVisible.value = false;
    } catch (error: any) {
      isLoaderVisible.value = false;
      notifications.add({ id: 'file', title: `${error.statusCode}: ${error.data.message}` });
      console.error(error);
    }
  }
}
</script>

<template>
  <UForm :state="uploadedFile" :validate="validate" class="file-form" @submit="onFileFormSubmit">
    <UFormGroup name="title">
      Название 
      <span class="required">*</span>
      <UInput v-model="uploadedFile.title" />
    </UFormGroup>
    <label>
      <span class="file-form__label">
        Загрузить файл
        <span class="required">*</span>
      </span>
      <p class="file-form__notes">
        Допустимые форматы – .pdf, .doc, .docx
        <br>
        Максимальный размер – до 130 мб
      </p>
      <input
        style="display: none"
        type="file"
        ref="fileUpload"
        accept=".pdf, .doc, .docx"
        @change="onFileChange"
      />
      <LoadButton class="file-form__file-btn" @on-click="(fileUpload as HTMLInputElement).click()" />
      <p>
        Загруженный файл:
        <p v-if="fileForUpload">{{ fileForUpload.name }}</p>
        <span v-else>отсутствует</span>
      </p>
      <span class="error">{{ fileError }}</span>
    </label>
    <MenuButton :button-type="'submit'" :is-active="true" :size="'middle'" class="file-form__submit-btn">Загрузить</MenuButton>
  </UForm>
</template>

<style lang="scss">
.file-form {
  width: 30%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .file-form__label {
    display: block;
  }

  .file-form__notes {
    opacity: .7;
  }

  .file-form__file-btn {
    display: block;
    margin: 10px auto;
  }

  .file-form__submit-btn {
    margin: 0 auto;
  }
}
</style>
