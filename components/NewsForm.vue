<script setup lang="ts">
import defaultNewsCover from '~/assets/images/news-preview-default.jpg';
import { FILE_SIZE_ERROR_BEYOND_2_MB, NEWS_COVER_REQUIRED_ERROR } from '~/utils/errorMessages';
import type { Form, FormError } from '#ui/types';

const newsData = reactive({
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
  requiredError: false
});
const newsForm = ref<Form<string> | null>(null);
const newsCover = ref<HTMLInputElement | null>(null);
const notifications = useToast();

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
  coverErrorVisibility.value = {
    fileSizeError: false,
    requiredError: false
  };
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
  coverErrorVisibility.value = {
    fileSizeError: false,
    requiredError: false
  };
  coverPreview.value = coverForUploadingAsLink.value;
};

const handleResetFormFields = () => {
  newsData.title = '';
  newsData.description = '';
  newsData.cover = '';
  newsData.date = '';
  newsData.content = '';
  coverPreview.value = '';
};

const handleNewsFormSubmit = async () => {
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
          const previousCoverFile =
            newsData.cover &&
            (!newsData.cover.startsWith('http://') || !newsData.cover.startsWith('https://'))
              ? newsData.cover
              : '';
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

  const newsItemBody = {
    title: newsData.title,
    description: newsData.description,
    cover: newsData.cover,
    creationDate: newsData.date,
    content: newsData.content
  };

  try {
    const newNewsItem = await $fetch('/api/news', {
      method: 'post',
      body: newsItemBody
    });
    handleResetFormFields();
    notifications.add({ id: 'news', title: 'Новость создана!' });
  } catch (error: any) {
    console.error(error);
  }
};
</script>

<template>
  <UForm
    :state="newsData"
    :validate="validate"
    class="news-form"
    ref="newsForm"
    @submit="handleNewsFormSubmit"
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
            @change="handleNewsCoverLinkChange"
          />
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
        <ContentEditor
          v-model="newsData.content"
          :placeholder="'Начните печатать содержимое новости...'"
        />
      </ClientOnly>
    </UFormGroup>
    <SubmitBtn>Создать новость</SubmitBtn>
  </UForm>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.news-form {
  width: 100%;
  margin-right: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .news-form__top-container {
    display: flex;
    justify-content: space-evenly;
    gap: 20px;

    .news-form__cover-block {
      display: grid;
      row-gap: 10px;
      padding: 10px;
      margin-bottom: 5px;

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
}
</style>
