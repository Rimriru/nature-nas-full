<script setup lang="ts">
import { fileSizeError } from '~/utils/errorMessages';
import type { FormError } from '#ui/types';

const uploadedFile = reactive({
  title: '',
  file: ''
});
const fileForUpload = ref<File | ''>('');
const fileUpload = ref<HTMLInputElement | null>(null);
const fileError = ref('');

const imageForUpload = ref<File | ''>('');
const imageUpload = ref<HTMLInputElement | null>(null);
const imageError = ref('');

const submitError = ref('');

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

const resetInputsErrors = () => {
  imageError.value = '';
  fileError.value = '';
}

const onFileChange = (event: Event) => {
  resetInputsErrors();
  if (imageUpload.value) {
    imageUpload.value.value = '';
  }
  imageForUpload.value = '';

  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 130000000) return (fileError.value = fileSizeError('130'));
    fileForUpload.value = file;
  } else {
    fileForUpload.value = '';
  }
};

const onImageChange = (event: Event) => {
  resetInputsErrors();
  if (fileUpload.value) {
    fileUpload.value.value = '';
  }
  fileForUpload.value = '';

  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length) {
    const image = fileInputData.files[0];
    if (image.size > 5000000) return (imageError.value = fileSizeError('5'));
    imageForUpload.value = image;
  } else {
    imageForUpload.value = '';
  }
};

const resetFormFields = () => {
  if (fileUpload.value) {
    fileUpload.value.value = '';
  }
  if (imageUpload.value) {
    imageUpload.value.value = '';
  }
  uploadedFile.title = '';
  uploadedFile.file = '';
  fileForUpload.value = '';
  imageForUpload.value = '';
  selectedOption.value = '';
}

const onFileFormSubmit = async () => {
  submitError.value = '';
  if (!fileForUpload.value) {
    submitError.value = 'Необходимо загрузить файл!';
    return;
  }

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
    submitError.value = `${error.statusCode}: ${error.data.message}`;
    console.error(error);
  }
}

const onImageFormSubmit = async () => {
  submitError.value = '';

  if (!imageForUpload.value) {
    submitError.value = 'Необходимо загрузить файл!';
    return;
  }

  isLoaderVisible.value = true;
  const body = new FormData();
  body.append('images', imageForUpload.value);

  await $fetch('/api/images', {
    method: 'post',
    body,
    onResponse ({ response }) {
      if (response?.ok) {
        uploadedFile.file = response._data[0];
      } else {
        notifications.add({ id: 'file', title: `${response.status}: ${response._data.message}` });
        isLoaderVisible.value = false;
        return;
      }
    }
  });

  const newImageAsFileBody = {
    name: uploadedFile.title,
    file: uploadedFile.file,
    category: 'image'
  }

  try {
    const newFile = await $fetch('/api/files', {
      method: 'post',
      body: newImageAsFileBody
    });
    filesState.value = [ ...filesState.value, newFile ];
    notifications.add({ id: 'file', title: `Файл "${newImageAsFileBody.name}" загружен!` });
    resetFormFields();
    isLoaderVisible.value = false;
    emit('close');
  } catch (error: any) {
    isLoaderVisible.value = false;
    notifications.add({ id: 'file', title: `${error.statusCode}: ${error.data.message}` });
    submitError.value = `${error.statusCode}: ${error.data.message}`;
    console.error(error);
  }
}

const submitCallback = computed(() => {
  if (props.isUploadingJournalIssue) return onFileFormSubmit;
  return fileForUpload.value ? onFileFormSubmit : onImageFormSubmit;
});
</script>

<template>
  <UForm :state="uploadedFile" :validate="validate" class="file-form" @submit="submitCallback">
    <UFormGroup name="title" :class="['file-form__title', { 'file-form__title_admin': !isUploadingJournalIssue }]">
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
      <USelect placeholder="Выберите..." :disabled="!fileForUpload" :options="options" v-model="selectedOption" />
      <span class="info file-form__message">Если выбрана опция "Выпуск журнала", ссылка на файл будет отображена в списке публикаций</span>
    </UFormGroup>
    <UDivider v-if="!isUploadingJournalIssue" label="или" />
    <label v-if="!isUploadingJournalIssue">
      <span class="file-form__label">
        Загрузить изображение
        <span class="required">*</span>
      </span>
      <p class="file-form__notes">
        Допустимые форматы – .jpeg, .jpg, .png
        <br>
        Максимальный размер – до 5 мб
      </p>
      <input
        style="display: none"
        type="file"
        ref="imageUpload"
        accept="image/jpeg, image/png"
        @change="onImageChange"
      />
      <LoadButton class="file-form__file-btn" @on-click="(imageUpload as HTMLInputElement).click()" />
      <p>
        Загруженный файл:
        <p v-if="imageForUpload">{{ imageForUpload.name }}</p>
        <span v-else>отсутствует</span>
      </p>
      <span class="error">{{ imageError }}</span>
    </label>
    <span v-if="submitError" class="error">{{ submitError }}</span>
    <div class="file-form__btn-container">
      <slot />
      <MenuButton :button-type="'submit'" :is-active="true" :size="isUploadingJournalIssue ? 'small' : 'middle'">Загрузить</MenuButton>
    </div>
  </UForm>
</template>

<style lang="scss">
@import url('~/assets/styles/components/fileLoadForm.scss');
</style>
