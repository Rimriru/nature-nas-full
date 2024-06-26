<script setup lang="ts">
import type { Form, FormError } from '#ui/types';
import type { DefineComponent } from 'vue';
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

const conferenceData = reactive({
  _id: '',
  description: '',
  cover: '',
  startDate: '',
  endDate: '',
  content: ''
});
const confsState = useConfsState();
const conferenceCover = ref<DefineComponent | null>(null);
const coverForUploadingAsFile = ref<File | ''>('');
const coverForUploadingAsLink = ref('');
const coverErrorVisibility = ref({
  fileSizeError: false,
  linkValidationError: false,
  requiredError: false
});
const coverPreview = ref('');
const submitError = ref('');
const confForm = ref<Form<string> | null>(null);
const notifications = useToast();
const config = useRuntimeConfig();

const props = defineProps<{
  isInPopup: boolean;
}>();

const emit = defineEmits(['onClose', 'pass']);

let originalConfItemData: {
  content: string;
  description: string;
  cover: string;
  startDate: string;
  endDate?: string;
} = {
  content: '',
  description: '',
  cover: '',
  startDate: '',
  endDate: ''
};

if (props.isInPopup) {
  const confItemForEditing: Ref<ConfDataFromDb> | undefined = inject('confItem');

  if (confItemForEditing?.value) {
    confForm.value?.clear();
    conferenceData._id = String(confItemForEditing.value._id);
    conferenceData.description = confItemForEditing.value.description;
    conferenceData.startDate = confItemForEditing.value.startDate;
    conferenceData.endDate = confItemForEditing.value.endDate
      ? confItemForEditing.value.endDate
      : '';
    conferenceData.cover = confItemForEditing.value.cover;
    conferenceData.content = confItemForEditing.value.content;

    const { _id, ...others } = confItemForEditing.value;
    originalConfItemData = others;

    if (IMAGE_LINK_REG_EXP.test(conferenceData.cover)) {
      coverPreview.value = conferenceData.cover;
      coverForUploadingAsLink.value = conferenceData.cover;
    } else {
      coverPreview.value = `${
        config.public.process === 'production' ? '' : config.public.domen
      }/image/${conferenceData.cover}`;
    }
  }
}

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.description)
    errors.push({ path: 'description', message: 'Поле "Описание" является обязательным' });
  if (!state.content)
    errors.push({ path: 'content', message: 'Поле "Содержимое" является обязательным' });
  if (!state.startDate)
    errors.push({ path: 'startDate', message: 'Поле "Дата начала" является обязательным' });
  return errors;
};

const setErrorsDefaultValues = () => {
  coverErrorVisibility.value = {
    fileSizeError: false,
    linkValidationError: false,
    requiredError: false
  };
  submitError.value = '';
};

const handleResetFormFields = () => {
  conferenceData._id = '';
  conferenceData.description = '';
  conferenceData.cover = '';
  conferenceData.startDate = '';
  conferenceData.endDate = '';
  conferenceData.content = '';
  coverPreview.value = '';
  if (conferenceCover.value) {
    conferenceCover.value.coverImageInput.value = '';
  }
};

const handleConfCoverInputChange = (event: Event) => {
  coverForUploadingAsLink.value = '';
  setErrorsDefaultValues();
  const fileInputData = event.target as HTMLInputElement;

  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 2500000) return (coverErrorVisibility.value.fileSizeError = true);
    coverForUploadingAsFile.value = file;
    coverPreview.value = URL.createObjectURL(file);
  } else {
    coverForUploadingAsFile.value = '';
    coverPreview.value = '';
  }
};

const handleConfCoverLinkChange = () => {
  coverForUploadingAsFile.value = '';
  if (conferenceCover.value) {
    conferenceCover.value.coverImageInput.value = '';
  }
  setErrorsDefaultValues();

  if (!IMAGE_LINK_REG_EXP.test(coverForUploadingAsLink.value)) {
    coverErrorVisibility.value.linkValidationError = true;
    coverPreview.value = '';
    return;
  }
  coverPreview.value = coverForUploadingAsLink.value;
};

const handleConfItemCreationFormSubmit = async () => {
  if (!coverForUploadingAsFile.value && !coverForUploadingAsLink.value) {
    coverErrorVisibility.value.requiredError = true;
    return;
  }

  if (coverForUploadingAsLink.value) {
    conferenceData.cover = coverForUploadingAsLink.value;
    coverForUploadingAsLink.value = '';
  }

  if (coverForUploadingAsFile.value) {
    const body = new FormData();
    body.append('images', coverForUploadingAsFile.value);
    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (response.ok) {
          conferenceData.cover = response._data[0];
          coverForUploadingAsFile.value = '';
        } else {
          notifications.add({
            id: 'news',
            title: String(response.status),
            description: response.statusText
          });
          return;
        }
      }
    });
  }

  const newConfData = {
    description: conferenceData.description,
    cover: conferenceData.cover,
    startDate: conferenceData.startDate,
    endDate: conferenceData.endDate,
    content: conferenceData.content
  };

  try {
    const newConf = await $fetch('/api/confs', {
      method: 'post',
      body: newConfData
    });
    confsState.value = [...confsState.value, newConf];
    handleResetFormFields();
    notifications.add({ id: 'confs', title: 'Конференция создана!' });
  } catch (error: any) {
    submitError.value = `${error.statusCode}: ${error.data.message}`;
    console.error(error);
  }
};

const handleConfItemEditFormSubmit = async () => {
  const initialValues = JSON.stringify(originalConfItemData);
  submitError.value = '';

  if (coverForUploadingAsLink.value && coverForUploadingAsLink.value !== conferenceData.cover) {
    const initialCover = conferenceData.cover;
    conferenceData.cover = coverForUploadingAsLink.value;
    coverForUploadingAsLink.value = '';

    if (initialCover && !IMAGE_LINK_REG_EXP.test(initialCover)) {
      await $fetch(`/api/images/${initialCover}`, {
        method: 'delete',
        onResponse({ response }) {
          if (!response.ok) {
            notifications.add({
              id: 'news',
              title: String(response.status),
              description: response.statusText
            });
            return;
          }
        }
      });
    }
  }

  if (coverForUploadingAsFile.value) {
    const body = new FormData();
    body.append('images', coverForUploadingAsFile.value);
    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (response.ok) {
          const previousCoverFile =
            conferenceData.cover && !IMAGE_LINK_REG_EXP.test(conferenceData.cover)
              ? conferenceData.cover
              : '';
          conferenceData.cover = response._data[0];
          coverForUploadingAsFile.value = '';

          if (previousCoverFile) {
            await $fetch(`/api/images/${previousCoverFile}`, {
              method: 'delete',
              onResponse({ response }) {
                if (!response.ok) {
                  notifications.add({
                    id: 'news',
                    title: String(response.status),
                    description: response.statusText
                  });
                  return;
                }
              }
            });
          }
        } else {
          notifications.add({
            id: 'news',
            title: String(response.status),
            description: response.statusText
          });
          return;
        }
      }
    });
  }
  const confItemId = conferenceData._id;
  const { description, startDate, endDate, content, cover } = conferenceData;
  const confItemBody = { description, startDate, endDate, content, cover };

  if (initialValues === JSON.stringify(confItemBody)) {
    emit('onClose');
  } else {
    try {
      const editedConfItem = await $fetch(`/api/confs/${confItemId}`, {
        method: 'patch',
        body: confItemBody
      });

      const previousItemIndex = confsState.value.findIndex((item) => item._id === confItemId);
      confsState.value[previousItemIndex] = editedConfItem;
      notifications.add({
        id: 'news',
        title: 'Конференция была изменена!'
      });
      emit('onClose');
    } catch (error: any) {
      submitError.value = `${error.status}: ${error.data.message}`;
      console.error(error);
    }
  }
};

const submitHandler = props.isInPopup
  ? handleConfItemEditFormSubmit
  : handleConfItemCreationFormSubmit;

onMounted(() => {
  if (props.isInPopup) {
    emit('pass', [handleResetFormFields, setErrorsDefaultValues]);
  }
});
</script>

<template>
  <UForm
    :state="conferenceData"
    :validate="validate"
    :class="['news-form', { 'news-form_popup': isInPopup }]"
    @submit="submitHandler"
  >
    <fieldset class="news-form__top-container">
      <CoverFormBlock
        ref="conferenceCover"
        :cover-error-visibility="coverErrorVisibility"
        :cover-preview="coverPreview"
        v-model="coverForUploadingAsLink"
        @on-news-cover-input-change="handleConfCoverInputChange"
        @on-news-cover-link-change="handleConfCoverLinkChange"
      />
      <div class="news-form__header-inputs">
        <DescriptionFormBlock
          :placeholder="'Введите описание конференции...'"
          v-model="conferenceData.description"
        />
      </div>
    </fieldset>
    <fieldset>
      <p>Даты</p>
      <div class="news-form__dates">
        <UFormGroup name="startDate">
          Начало
          <span class="required">*</span>
          <UInput type="date" v-model="conferenceData.startDate" />
        </UFormGroup>
        <UFormGroup name="endDate">
          Окончание
          <UInput type="date" v-model="conferenceData.endDate" />
        </UFormGroup>
      </div>
    </fieldset>
    <UFormGroup>
      Содержимое
      <span class="required">*</span>
      <ClientOnly>
        <ContentEditor v-model="conferenceData.content" />
      </ClientOnly>
    </UFormGroup>
    <span v-if="submitError" class="error">{{ submitError }}</span>
    <div class="news-form__btn-container">
      <MenuButton v-if="isInPopup" :size="'middle'" @click="emit('onClose')">Отмена</MenuButton>
      <MenuButton
        :button-type="'submit'"
        :size="'middle'"
        :is-active="true"
        :is-disabled="
          coverErrorVisibility.fileSizeError ||
          coverErrorVisibility.linkValidationError ||
          coverErrorVisibility.requiredError
        "
        >{{ isInPopup ? 'Сохранить' : 'Создать' }}</MenuButton
      >
    </div>
  </UForm>
</template>

<style lang="scss">
@import '~/assets/styles/components/newsForm.scss';
</style>
