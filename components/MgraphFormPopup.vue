<script setup lang="ts">
import type { IMonographFromDb } from '~/types/MgraphsDataFromDb';
import type { Form, FormError } from '#ui/types';
import type { DefineComponent } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  monographValues?: Omit<IMonographFromDb, 'year'>;
  year?: string;
}>();
const emit = defineEmits(['onClose']);

const monographValues = reactive({
  title: '',
  cover: '',
  description: ''
});
const monographId = ref('');
const monographForm = ref<Form<string> | null>(null);
const monographCover = ref<DefineComponent | null>(null);
const coverPreview = ref('');
const coverForUploadingAsFile = ref<File | ''>('');
const coverForUploadingAsLink = ref('');
let originalMonographValues = {
  title: '',
  cover: '',
  description: ''
};
const submitError = ref('');
const coverErrorVisibility = ref({
  requiredError: false,
  linkValidationError: false,
  fileSizeError: false
});
const monographsState = useMgraphsState();
const notifications = useToast();
const config = useRuntimeConfig();

watch(
  () => props.isEditing,
  (newValue) => {
    if (newValue && props.monographValues) {
      monographId.value = props.monographValues._id;
      monographValues.title = props.monographValues.title;
      monographValues.description = props.monographValues.description;
      monographValues.cover = props.monographValues.cover;

      if (IMAGE_LINK_REG_EXP.test(monographValues.cover)) {
        coverPreview.value = monographValues.cover;
        coverForUploadingAsLink.value = monographValues.cover;
      } else {
        coverPreview.value = `${
          config.public.process === 'production' ? '' : config.public.domen
        }/image/${monographValues.cover}`;
      }

      originalMonographValues = {
        title: props.monographValues.title,
        description: props.monographValues.description,
        cover: props.monographValues.cover
      };
    }
  }
);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Заголовок" является обязательным' });
  if (!state.description)
    errors.push({ path: 'description', message: 'Поле "Описание" является обязательным' });
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

const resetMonographFormValues = () => {
  monographValues.title = '';
  monographValues.description = '';
  monographValues.cover = '';
  monographId.value = '';
  if (monographForm.value) {
    monographForm.value.clear();
  }
  if (monographCover.value) {
    monographCover.value.coverImageInput.value = '';
  }
  coverForUploadingAsFile.value = '';
  coverForUploadingAsLink.value = '';
  coverPreview.value = '';
  if (props.isEditing) {
    originalMonographValues = {
      title: '',
      cover: '',
      description: ''
    };
  }
};

const handleMonographFormClose = () => {
  emit('onClose');
  setErrorsDefaultValues();
  resetMonographFormValues();
};

const handleMgraphInputChange = (event: Event) => {
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

const onImageDownload = async () => {
  if (coverForUploadingAsFile.value) {
    const body = new FormData();
    body.append('images', coverForUploadingAsFile.value);
    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (response.ok) {
          const previousCoverFile =
            monographValues.cover && !IMAGE_LINK_REG_EXP.test(monographValues.cover)
              ? monographValues.cover
              : '';
          monographValues.cover = response._data[0];
          coverForUploadingAsFile.value = '';

          if (previousCoverFile) {
            await $fetch(`/api/images/${previousCoverFile}`, {
              method: 'delete',
              onResponse({ response }) {
                if (!response.ok) {
                  notifications.add({
                    id: 'mgraphs',
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
            id: 'mgraphs',
            title: String(response.status),
            description: response.statusText
          });
          return;
        }
      }
    });
  }
};

const handleMgraphLinkChange = () => {
  coverForUploadingAsFile.value = '';
  if (monographCover.value) {
    monographCover.value.coverImageInput.value = '';
  }
  setErrorsDefaultValues();

  if (!IMAGE_LINK_REG_EXP.test(coverForUploadingAsLink.value)) {
    coverErrorVisibility.value.linkValidationError = true;
    coverPreview.value = '';
    return;
  }
  coverPreview.value = coverForUploadingAsLink.value;
};

const handleAddingNewMonograph = async () => {
  submitError.value = '';

  if (!coverForUploadingAsFile.value && !coverForUploadingAsLink.value) {
    coverErrorVisibility.value.requiredError = true;
    return;
  }

  if (coverForUploadingAsLink.value) {
    monographValues.cover = coverForUploadingAsLink.value;
    coverForUploadingAsLink.value = '';
  }

  if (coverForUploadingAsFile.value) {
    await onImageDownload();
  }

  const newMonoBody = {
    title: monographValues.title,
    description: monographValues.description,
    cover: monographValues.cover,
    year: props.year
  };

  try {
    const newMonograph = await $fetch('/api/mgraphs', {
      method: 'post',
      body: newMonoBody
    });
    if (newMonograph) {
      monographsState.value = [...monographsState.value, newMonograph];
    }
    handleMonographFormClose();
    notifications.add({ id: 'mgraphs', title: 'Новая монография создана!' });
  } catch (error: any) {
    console.error(error);
    submitError.value = `${error.status}: ${error.data.message}`;
  }
};

const handleEditingMonograph = async () => {
  submitError.value = '';

  const originalValues = JSON.stringify(originalMonographValues);

  if (coverForUploadingAsLink.value && coverForUploadingAsLink.value !== monographValues.cover) {
    const initialCover = monographValues.cover;
    monographValues.cover = coverForUploadingAsLink.value;
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
    await onImageDownload();
  }

  const monoId = monographId.value;
  const { title, description, cover } = monographValues;
  const editedMonographBody = { title, description, cover };

  if (originalValues === JSON.stringify(editedMonographBody)) {
    handleMonographFormClose();
  } else {
    try {
      const editedMono = await $fetch(`/api/mgraphs/${monoId}`, {
        method: 'patch',
        body: editedMonographBody
      });
      const editedMonoIndex = monographsState.value.findIndex((mono) => mono._id === monoId);
      monographsState.value[editedMonoIndex] = editedMono;
      notifications.add({
        id: 'mgraphs',
        title: `Монография ${originalMonographValues.title} была изменена!`
      });
      handleMonographFormClose();
    } catch (error: any) {
      console.error(error);
      submitError.value = `${error.status}: ${error.data.message}`;
    }
  }
};

const submitHandler = computed(() =>
  props.isEditing ? handleEditingMonograph : handleAddingNewMonograph
);
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="handleMonographFormClose">
    <UForm
      :state="monographValues"
      :validate="validate"
      class="news-form news-form_popup"
      ref="monographForm"
      @submit="submitHandler"
    >
      <fieldset class="news-form__top-container">
        <CoverFormBlock
          ref="monographCover"
          :cover-error-visibility="coverErrorVisibility"
          :cover-preview="coverPreview"
          :vertical="true"
          v-model="coverForUploadingAsLink"
          @on-cover-input-change="handleMgraphInputChange"
          @on-cover-link-change="handleMgraphLinkChange"
        />
        <div class="news-form__header-inputs">
          <TitleFormBlock
            :placeholder="'Введите заголовок монографии...'"
            v-model="monographValues.title"
          />
          <DescriptionFormBlock
            :placeholder="'Введите описание монографии...'"
            v-model="monographValues.description"
          />
        </div>
      </fieldset>
      <span v-if="submitError" class="error">{{ submitError }}</span>
      <div class="news-form__btn-container">
        <MenuButton :size="'middle'" @click="handleMonographFormClose">Отмена</MenuButton>
        <MenuButton
          :button-type="'submit'"
          :size="'middle'"
          :is-active="true"
          :is-disabled="
            coverErrorVisibility.fileSizeError ||
            coverErrorVisibility.linkValidationError ||
            coverErrorVisibility.requiredError
          "
          >{{ isEditing ? 'Сохранить' : 'Создать' }}</MenuButton
        >
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
@import '~/assets/styles/components/newsForm.scss';
</style>
