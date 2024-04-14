<script setup lang="ts">
import type {
  CanvasOneContent,
  OriginalContentValues,
  ContentFromDb
} from '~/types/ContentDataFromDb';

const contentValues = ref<CanvasOneContent>({
  _id: '',
  title: '',
  description: '',
  text: '',
  photos: [],
  personaOne: {
    position: '',
    name: '',
    phd: '',
    telNumber: '',
    faxNumber: '',
    email: '',
    description: '',
    photo: ''
  },
  sections: []
});
const personaPhotoForUploading = ref<File | string>('');
const personaPhotoInputChanged = ref(false);
const carouselPhotosForLoading = ref<FileList | []>([]);
const carouselPhotosFromDbForRemove = ref<string[]>([]);
const isInEditMode = ref(false);
let wasContentBefore = false;
const pageTitle = usePageTitle();
const notifications = useToast();

// данные о странице от router
const props = defineProps(['routeData']);

// динамичная смена заголовка в HeadingImage
watch(
  () => contentValues.value.title,
  (newValue) => {
    pageTitle.value = newValue;
  }
);
// при редактировании происходит скролл до верхнего края window
watch(isInEditMode, (newValue) => {
  if (newValue) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
});

// запрос на контент
const content = await useFetch(`/api/content/${props.routeData._id}`, {
  watch: false,
  pick: ['_id', 'title', 'description', 'text', 'sections', 'photos', 'personaOne']
});

// если контент был ранее сохранён, то
// меняем значение wasContentBefore (на его основе происходит определение запроса, который будет отправляться - post или patch (см. handleCanvasFormSubmit))
// заполняем значения контента для формы и отображения на странице
// добавляем мета теги в виде заголовка и описания страницы
if (content.data.value) {
  wasContentBefore = true;
  contentValues.value = content.data.value as CanvasOneContent;

  useSeoMeta({
    title: () => content.data.value!.title,
    description: () => content.data.value!.description
  });
}

// переменная для сохранения промежуточные значений
// на её основе мы сохраняем значения полей контента в случае нажатия кнопки Отмена
// и определяем, есть ли изменения при сабмите формы (см. handleCanvasFormSubmit)
let originalState: OriginalContentValues = {
  title: '',
  description: '',
  text: '',
  photos: [],
  personaOne: {
    position: '',
    name: '',
    phd: '',
    telNumber: '',
    faxNumber: '',
    email: '',
    description: '',
    photo: ''
  }
};

const enableEditMode = () => {
  const { title, description, text, photos, personaOne } = contentValues.value;
  originalState = {
    title,
    description,
    text,
    photos,
    personaOne
  };
  isInEditMode.value = true;
};

// очистка промежуточных значений
const disableEditMode = () => {
  isInEditMode.value = false;

  originalState = {
    title: '',
    description: '',
    text: '',
    photos: [],
    personaOne: {
      position: '',
      name: '',
      phd: '',
      telNumber: '',
      faxNumber: '',
      email: '',
      description: '',
      photo: ''
    }
  };
};

// применение промежуточных значений контента и персоны
const handleCancelBtnClick = () => {
  contentValues.value.title = originalState.title;
  contentValues.value.description = originalState.description;
  contentValues.value.text = originalState.text;
  contentValues.value.photos = originalState.photos;

  contentValues.value.personaOne.position = originalState.personaOne.position;
  contentValues.value.personaOne.name = originalState.personaOne.name;
  contentValues.value.personaOne.phd = originalState.personaOne.phd;
  contentValues.value.personaOne.telNumber = originalState.personaOne.telNumber;
  contentValues.value.personaOne.faxNumber = originalState.personaOne.faxNumber;
  contentValues.value.personaOne.email = originalState.personaOne.email;
  contentValues.value.personaOne.description = originalState.personaOne.description;
  contentValues.value.personaOne.photo = originalState.personaOne.photo;

  disableEditMode();
};

const onPhotosSelected = (files: FileList) => {
  carouselPhotosForLoading.value = files;
};

const onPhotosFromDbRemove = (removedValue: string) => {
  contentValues.value.photos = contentValues.value.photos.filter((photo) => photo !== removedValue);
  carouselPhotosFromDbForRemove.value.push(removedValue);
};

const onPersonaPhotoSelected = (newPhoto: File | string) => {
  personaPhotoForUploading.value = newPhoto;
  personaPhotoInputChanged.value = true;
};

// сабмит формы
const handleCanvasFormSubmit = async () => {
  const originalValues = JSON.stringify(originalState);

  if (personaPhotoForUploading.value) {
    const body = new FormData();
    body.append('images', personaPhotoForUploading.value);

    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (!response.ok) {
          notifications.add({
            id: 'file-upload',
            title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
          });
          return;
        } else {
          personaPhotoForUploading.value = '';
          const previousPhoto = contentValues.value.personaOne.photo;
          contentValues.value.personaOne.photo = response._data[0];

          if (previousPhoto) {
            await $fetch(`/api/images/${previousPhoto}`, {
              method: 'delete',
              onResponse({ response }) {
                if (!response.ok) {
                  notifications.add({
                    id: 'file-delete',
                    title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
                  });
                  return;
                }
              }
            });
          }
        }
      }
    });
  } else if (!personaPhotoForUploading.value && personaPhotoInputChanged.value) {
    const previousPhoto = contentValues.value.personaOne.photo;
    contentValues.value.personaOne.photo = '';

    if (previousPhoto) {
      await $fetch(`/api/images/${previousPhoto}`, {
        method: 'delete',
        onResponse({ response }) {
          if (!response.ok) {
            notifications.add({
              id: 'file-delete',
              title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
            });
            return;
          }
        }
      });
    }
  }

  if (carouselPhotosFromDbForRemove.value.length) {
    await $fetch('/api/images', {
      method: 'delete',
      body: carouselPhotosFromDbForRemove.value,
      onResponse({ response }) {
        if (!response.ok) {
          notifications.add({
            id: 'file-delete',
            title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
          });
          return;
        } else {
          carouselPhotosFromDbForRemove.value = [];
        }
      }
    });
  }

  if (carouselPhotosForLoading.value.length) {
    const body = new FormData();
    const images = Array.from(carouselPhotosForLoading.value);
    images.forEach((image) => body.append('images', image));

    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (!response.ok) {
          notifications.add({
            id: 'file-upload',
            title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
          });
          return;
        } else {
          carouselPhotosForLoading.value = [];
          response._data.forEach((photo: string) => {
            return contentValues.value.photos.push(photo);
          });
        }
      }
    });
  }

  const { title, description, text, photos, personaOne } = contentValues.value;
  const contentBody = { title, description, text, photos, personaOne };

  if (!wasContentBefore) {
    const newContentBody = {
      ...contentBody,
      route: props.routeData._id
    };
    try {
      const newContent = await $fetch('/api/content', {
        method: 'post',
        body: newContentBody
      });
      contentValues.value._id = (newContent as unknown as ContentFromDb)._id;
      disableEditMode();
      wasContentBefore = true;
    } catch (error) {
      console.error(error);
    }
  } else {
    if (originalValues === JSON.stringify(contentBody)) {
      disableEditMode();
      return;
    }

    try {
      await $fetch(`/api/content/${contentValues.value._id}`, {
        method: 'patch',
        body: contentBody
      });
      disableEditMode();
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<template>
  <main class="main">
    <CanvasContent
      v-if="!isInEditMode"
      :content-values="contentValues"
      :canvas="'two'"
      @edit-btn-click="enableEditMode"
    />
    <CanvasForm
      v-else
      :content-values="contentValues"
      @on-cancel="handleCancelBtnClick"
      @on-submit="handleCanvasFormSubmit"
    >
      <PersonaInputFields
        v-model:persona-data="contentValues.personaOne"
        :photo="contentValues.personaOne.photo"
        @on-photo-change="onPersonaPhotoSelected"
      />
      <PhotosInputField
        :photos-from-db="contentValues.photos"
        @on-photos-selected="onPhotosSelected"
        @update:photos-from-db="onPhotosFromDbRemove"
      />
    </CanvasForm>
    <PageSections
      v-if="!isInEditMode && contentValues._id"
      :sections="contentValues.sections"
      :content-id="contentValues._id"
      :is-single="false"
    />
  </main>
</template>
