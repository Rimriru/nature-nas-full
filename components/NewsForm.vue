<script setup lang="ts">
import { IMAGE_LINK_REG_EXP } from '~/utils/regExp';
import type { Form, FormError } from '#ui/types';
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';
import type { DefineComponent } from 'vue';

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
const newsCover = ref<DefineComponent | null>(null);
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
    newsCover.value.coverImageInput.value = '';
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
    newsCover.value.coverImageInput.value = '';
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
    submitError.value = `${error.status}: ${error.data.message}`;
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
      submitError.value = `${error.status}: ${error.data.message}`;
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
        <CoverFormBlock
          ref="newsCover"
          :cover-error-visibility="coverErrorVisibility"
          :cover-preview="coverPreview"
          v-model="coverForUploadingAsLink"
          @on-news-cover-input-change="handleNewsCoverInputChange"
          @on-news-cover-link-change="handleNewsCoverLinkChange"
        />
        <div class="news-form__header-inputs">
          <TitleFormBlock :placeholder="'Введите заголовок новости...'" v-model="newsData.title" />
          <DescriptionFormBlock
            :placeholder="'Введите описание новости...'"
            v-model="newsData.description"
          />
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
@import '~/assets/styles/components/newsForm.scss';
</style>
