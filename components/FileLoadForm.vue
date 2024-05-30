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

const options = ['Общий', 'Выпуск журнала'];
const selectedOption = ref('');

const props = defineProps<{
  isUploadingJournalIssue?: boolean,
  isPopupOpen?: boolean
}>();

const emit = defineEmits(['close']);

const filesState = useFilesState();
const notifications = useToast();
const isLoaderVisible = useLoaderVisibilityState();

if (props.isUploadingJournalIssue && props.isPopupOpen) {
  selectedOption.value = 'Выпуск журнала';

  watch(() => props.isPopupOpen, (newValue) => {
    if (!newValue) {
      resetFormFields();
    }
  });
}

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
  selectedOption.value = ''
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
      file: uploadedFile.file,
      category: props.isUploadingJournalIssue || selectedOption.value === 'Выпуск журнала' ? 'nature-journal' : ''
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
      emit('close');
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
      <UInput v-model="uploadedFile.title" placeholder="Начните печатать название..." />
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
    <UFormGroup>
      <USelect placeholder="Выберите..." :options="options" v-model="selectedOption" />
      <span class="file-form__message">* Если выбрана опция "Выпуск журнала", ссылка на файл будет отображена в списке публикаций</span>
    </UFormGroup>
    <div class="file-form__btn-container">
      <slot />
      <MenuButton :button-type="'submit'" :is-active="true" :size="isUploadingJournalIssue ? 'small' : 'middle'">Загрузить</MenuButton>
    </div>
  </UForm>
</template>

<style lang="scss">
@import url('~/assets/styles/components/fileLoadForm.scss');
</style>
