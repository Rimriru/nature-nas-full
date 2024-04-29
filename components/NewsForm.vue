<script setup lang="ts">
import defaultNewsCover from '~/assets/images/news-preview-default.jpg';
import {
  FILE_SIZE_ERROR_BEYOND_2_MB,
  NEWS_COVER_REQUIRED_ERROR,
  LINK_VALIDATION_ERROR
} from '~/utils/errorMessages';
import { IMAGE_LINK_REG_EXP } from '~/utils/regExp';
import type { Form, FormError } from '#ui/types';
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

const newsData = reactive<NewsDataFromDb>({
  _id: '',
  title: '',
  description: '',
  cover: '',
  date: '',
  content: ''
});
const coverForUploadingAsFile = ref<File | ''>('');
const coverForUploadingAsLink = ref('');
const coverPreview = ref('');
const coverErrorVisibility = ref({
  fileSizeError: false,
  linkValidationError: false,
  requiredError: false
});
const newsForm = ref<Form<string> | null>(null);
const newsCover = ref<HTMLInputElement | null>(null);
const submitError = ref('');
const notifications = useToast();
const newsState = useNewsState();
const config = useRuntimeConfig();

let originalNewsItemData = {
  title: '',
  description: '',
  cover: '',
  content: ''
};

const props = defineProps<{
  isInPopup: boolean;
}>();

const emit = defineEmits(['onClose', 'pass']);

if (props.isInPopup) {
  const newsItemForEditing: Ref<NewsDataFromDb> | undefined = inject('newsItem');

  watch(
    () => newsItemForEditing,
    (newValue) => {
      if (newValue?.value) {
        newsForm.value?.clear();
        newsData._id = newValue.value._id;
        newsData.title = newValue.value.title;
        newsData.description = newValue.value.description;
        newsData.date = newValue.value.date;
        newsData.cover = newValue.value.cover;
        newsData.content = newValue.value.content;

        const { _id, date, ...others } = newValue.value;
        originalNewsItemData = others;

        if (IMAGE_LINK_REG_EXP.test(newsData.cover)) {
          coverPreview.value = newsData.cover;
          coverForUploadingAsLink.value = newsData.cover;
        } else {
          coverPreview.value = `${config.public.domen}/image/${newsData.cover}`;
        }
      }
    },
    { deep: true }
  );
}

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Заголовок" является обязательным' });
  if (!state.description)
    errors.push({ path: 'description', message: 'Поле "Описание" является обязательным' });
  if (!state.content)
    errors.push({ path: 'content', message: 'Поле "Содержимое" является обязательным' });
  return errors;
};

const handleNewsCoverInputChange = (event: Event) => {
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

const handleNewsCoverLinkChange = () => {
  coverForUploadingAsFile.value = '';
  if (newsCover.value) {
    newsCover.value.value = '';
  }
  setErrorsDefaultValues();

  if (!IMAGE_LINK_REG_EXP.test(coverForUploadingAsLink.value)) {
    coverErrorVisibility.value.linkValidationError = true;
    coverPreview.value = '';
    return;
  }
  coverPreview.value = coverForUploadingAsLink.value;
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
  newsData._id = '';
  newsData.title = '';
  newsData.description = '';
  newsData.cover = '';
  newsData.date = '';
  newsData.content = '';
  coverPreview.value = '';
  if (newsCover.value) {
    newsCover.value.value = '';
  }

  originalNewsItemData = {
    title: '',
    description: '',
    cover: '',
    content: ''
  };
};

const handleNewsItemCreationFormSubmit = async () => {
  if (!coverForUploadingAsFile.value && !coverForUploadingAsLink.value) {
    coverErrorVisibility.value.requiredError = true;
    return;
  }

  const date = new Date();
  const creationDate = date.toLocaleDateString();
  const creationTime = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  newsData.date = `${creationDate} ${creationTime}`;

  if (coverForUploadingAsLink.value) {
    newsData.cover = coverForUploadingAsLink.value;
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
          newsData.cover = response._data[0];
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

  const newsItemBody = {
    title: newsData.title,
    description: newsData.description,
    cover: newsData.cover,
    date: newsData.date,
    content: newsData.content
  };

  try {
    const newNewsItem = await $fetch('/api/news', {
      method: 'post',
      body: newsItemBody
    });
    newsState.value = [...newsState.value, newNewsItem];
    handleResetFormFields();
    notifications.add({ id: 'news', title: 'Новость создана!' });
  } catch (error: any) {
    submitError.value = `${error.statusCode}: ${error.message}`;
    console.error(error);
  }
};

const handleNewsItemEditFormSubmit = async () => {
  const initialValues = JSON.stringify(originalNewsItemData);
  submitError.value = '';

  if (coverForUploadingAsLink.value && coverForUploadingAsLink.value !== newsData.cover) {
    const initialCover = newsData.cover;
    newsData.cover = coverForUploadingAsLink.value;
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
            newsData.cover && !IMAGE_LINK_REG_EXP.test(newsData.cover) ? newsData.cover : '';
          newsData.cover = response._data[0];
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
  const newsItemId = newsData._id;
  const { title, description, content, cover } = newsData;
  const newsItemBody = { title, description, content, cover };

  if (initialValues === JSON.stringify(newsItemBody)) {
    emit('onClose');
  } else {
    try {
      const editedNewsItem = await $fetch(`/api/news/${newsItemId}`, {
        method: 'patch',
        body: newsItemBody
      });
      const previousItemIndex = newsState.value.findIndex((item) => item._id === newsItemId);
      newsState.value[previousItemIndex] = editedNewsItem;
      notifications.add({
        id: 'news',
        title: `Новость "${originalNewsItemData.title}" была изменена!`
      });
      emit('onClose');
    } catch (error: any) {
      submitError.value = `${error.statusCode}: ${error.message}`;
      console.log(error);
    }
  }
};

const submitHandler = props.isInPopup
  ? handleNewsItemEditFormSubmit
  : handleNewsItemCreationFormSubmit;

onMounted(() => {
  if (props.isInPopup) {
    emit('pass', [handleResetFormFields, setErrorsDefaultValues]);
  }
});
</script>

<template>
  <div class="container">
    <UForm
      :state="newsData"
      :validate="validate"
      :class="['news-form', { 'news-form_popup': isInPopup }]"
      ref="newsForm"
      @submit="submitHandler"
    >
      <fieldset class="news-form__top-container">
        <UFormGroup name="cover">
          <div
            :class="[
              'news-form__cover-block',
              { 'news-form__cover-block_required': coverErrorVisibility.requiredError }
            ]"
          >
            <div
              class="news-form__cover-perview"
              :style="{ backgroundImage: `url(${coverPreview ? coverPreview : defaultNewsCover})` }"
            ></div>
            <p>
              <span class="required">*</span>
              Выбрать фото для обложки:
            </p>
            <div class="news-form__cover-file">
              <input
                style="display: none"
                id="newsCover"
                type="file"
                ref="newsCover"
                accept="image/jpeg, image/png"
                @change="handleNewsCoverInputChange"
              />
              <LoadButton
                class="w-30 mx-auto"
                @on-click="($refs.newsCover as HTMLInputElement).click()"
              />
              <span v-if="coverErrorVisibility.fileSizeError" class="error">{{
                FILE_SIZE_ERROR_BEYOND_2_MB
              }}</span>
            </div>
            <UDivider label="или" class="mb-5" />
            <UInput
              v-model="coverForUploadingAsLink"
              placeholder="Вставьте ссылку на изображение..."
              @keyup="handleNewsCoverLinkChange"
            />
            <span class="error" v-if="coverErrorVisibility.linkValidationError">{{
              LINK_VALIDATION_ERROR
            }}</span>
          </div>
          <span v-if="coverErrorVisibility.requiredError" class="error">{{
            NEWS_COVER_REQUIRED_ERROR
          }}</span>
        </UFormGroup>
        <div class="news-form__header-inputs">
          <UFormGroup name="title">
            Заголовок
            <span class="required">*</span>
            <UInput size="lg" v-model="newsData.title" placeholder="Введите заголовок новости..." />
          </UFormGroup>
          <UFormGroup name="description">
            Описание
            <span class="required">*</span>
            <UTextarea
              size="lg"
              :rows="13"
              resize
              v-model="newsData.description"
              placeholder="Введите описание новости..."
            />
          </UFormGroup>
        </div>
      </fieldset>
      <UFormGroup name="content">
        Содержимое
        <span class="required">*</span>
        <ClientOnly>
          <ContentEditor v-model="newsData.content" />
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
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.container {
  height: 100%;
}

.news-form {
  width: 100%;
  margin-right: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &_popup {
    margin: 0 auto;
  }

  .news-form__top-container {
    display: flex;
    justify-content: space-evenly;
    gap: 40px;

    .news-form__cover-block {
      display: grid;
      grid-template-columns: 1fr;
      row-gap: 10px;
      padding: 10px;
      margin-bottom: 5px;
      max-width: 300px;

      &_required {
        border: $required 1px solid;
        border-radius: 0.375rem;
      }

      .news-form__cover-perview {
        width: 308px;
        height: 200px;
        background-size: cover;
        background-position: center;
        border-radius: 10px;
        margin: 0 auto;
      }

      .news-form__cover-file {
        padding-bottom: 30px;
        margin: 0 auto;
        display: grid;
        position: relative;
        width: 100%;

        span.error {
          position: absolute;
          text-align: left;
          top: 33px;
          margin-block: 0;
        }
      }
    }

    .news-form__header-inputs {
      flex-basis: 40%;
      display: grid;
      row-gap: 10px;
    }
  }

  p {
    margin-bottom: 10px;
  }

  .news-form__btn-container {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
}

@media screen and (max-width: 1350px) {
  .news-form {
    .news-form__top-container {
      flex-wrap: wrap;

      .news-form__header-inputs {
        flex-basis: 100%;
      }
    }
  }
}
</style>
