<script setup lang="ts">
import type {
  CanvasContent,
  OriginalContentValues,
  ContentFromDb,
  CanvasOptions
} from '~/types/ContentDataFromDb';

const contentValues = ref<CanvasContent & { [key: string]: any }>({
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
  personaTwo: {
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
const personaOnePhoto = ref<{ photoForUploading: File | string; isInputTouched: boolean }>({
  photoForUploading: '',
  isInputTouched: false
});
const personaTwoPhoto = ref<{ photoForUploading: File | string; isInputTouched: boolean }>({
  photoForUploading: '',
  isInputTouched: false
});
const carouselPhotosForLoading = ref<FileList | []>([]);
const carouselPhotosFromDbForRemove = ref<string[]>([]);
const isInEditMode = ref(false);
let wasContentBefore = false;
const isLoaderVisible = useLoaderVisibilityState();
const pageTitle = usePageTitle();
const notifications = useToast();

// данные о странице и шаблоне от router и родителя
const props = defineProps(['routeId', 'content']);
const canvas = inject<CanvasOptions>('canvas');

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

// если контент был ранее сохранён, то
// меняем значение wasContentBefore (на его основе происходит определение запроса, который будет отправляться - post или patch (см. handleCanvasFormSubmit))
// заполняем значения контента для формы и отображения на странице
// добавляем мета теги в виде заголовка и описания страницы
if (props.content) {
  wasContentBefore = true;

  if (!props.content.personaTwo) {
    const personaTwoFromDB = {
      position: '',
      name: '',
      phd: '',
      telNumber: '',
      faxNumber: '',
      email: '',
      description: '',
      photo: ''
    };

    contentValues.value = {
      ...contentValues.value,
      ...props.content,
      personaTwo: personaTwoFromDB
    };
  } else {
    contentValues.value = props.content;
  }

  useSeoMeta({
    title: () => props.content.title,
    description: () => props.content.description
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
  },
  personaTwo: {
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
  const { title, description, text, photos, personaOne, personaTwo } = contentValues.value;
  originalState = {
    title,
    description,
    text,
    photos,
    personaOne,
    personaTwo
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
    },
    personaTwo: {
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
  // @ts-ignore
  carouselPhotosForLoading.value = [...carouselPhotosForLoading.value, ...files];
};

const onPhotosFromDbRemove = (removedValue: string) => {
  contentValues.value.photos = contentValues.value.photos.filter((photo) => photo !== removedValue);
  carouselPhotosFromDbForRemove.value.push(removedValue);
};

const onPersonaOnePhotoSelected = (newPhoto: File | string) => {
  personaOnePhoto.value.photoForUploading = newPhoto;
  personaOnePhoto.value.isInputTouched = true;
};

const onPersonaTwoPhotoSelected = (newPhoto: File | string) => {
  personaTwoPhoto.value.photoForUploading = newPhoto;
  personaTwoPhoto.value.isInputTouched = true;
};

// логика загрузки фото контакта
const uploadPersonaPhoto = async (
  personaPhoto: File | string,
  persona: string,
  isTouched: boolean
) => {
  if (personaPhoto) {
    const body = new FormData();
    body.append('images', personaPhoto);

    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (!response.ok) {
          isLoaderVisible.value = false;
          notifications.add({
            id: 'file-upload',
            title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
          });
          return;
        } else {
          personaPhoto = '';
          const previousPhoto =
            persona === 'personaOne'
              ? contentValues.value.personaOne.photo
              : contentValues.value.personaTwo.photo;
          contentValues.value[persona].photo = response._data[0];

          if (previousPhoto) {
            await $fetch(`/api/images/${previousPhoto}`, {
              method: 'delete',
              onResponse({ response }) {
                isLoaderVisible.value = false;
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
  } else if (!personaPhoto && isTouched) {
    const previousPhoto =
      persona === 'personaOne'
        ? contentValues.value.personaOne.photo
        : contentValues.value.personaTwo.photo;
    contentValues.value[persona].photo = '';
    isTouched = false;

    if (previousPhoto) {
      await $fetch(`/api/images/${previousPhoto}`, {
        method: 'delete',
        onResponse({ response }) {
          if (!response.ok) {
            isLoaderVisible.value = false;
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
};

// сабмит формы
const handleCanvasFormSubmit = async () => {
  const originalValues = JSON.stringify(originalState);
  isLoaderVisible.value = true;

  await uploadPersonaPhoto(
    personaOnePhoto.value.photoForUploading,
    'personaOne',
    personaOnePhoto.value.isInputTouched
  );
  await uploadPersonaPhoto(
    personaTwoPhoto.value.photoForUploading,
    'personaTwo',
    personaTwoPhoto.value.isInputTouched
  );

  if (carouselPhotosFromDbForRemove.value.length) {
    await $fetch('/api/images', {
      method: 'delete',
      body: carouselPhotosFromDbForRemove.value,
      onResponse({ response }) {
        if (!response.ok) {
          isLoaderVisible.value = false;
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
          isLoaderVisible.value = false;
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

  const { title, description, text, photos, personaOne, personaTwo } = contentValues.value;
  const contentBody = { title, description, text, photos, personaOne, personaTwo };

  if (!wasContentBefore) {
    const newContentBody = {
      ...contentBody,
      route: props.routeId
    };
    try {
      const newContent = await $fetch('/api/content', {
        method: 'post',
        body: newContentBody
      });
      contentValues.value._id = (newContent as unknown as ContentFromDb)._id;
      disableEditMode();
      wasContentBefore = true;
      isLoaderVisible.value = false;
    } catch (error) {
      isLoaderVisible.value = false;
      console.error(error);
    }
  } else {
    if (originalValues === JSON.stringify(contentBody)) {
      isLoaderVisible.value = false;
      disableEditMode();
      return;
    }

    try {
      await $fetch(`/api/content/${contentValues.value._id}`, {
        method: 'patch',
        body: contentBody
      });
      isLoaderVisible.value = false;
      disableEditMode();
    } catch (error) {
      isLoaderVisible.value = false;
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
      @edit-btn-click="enableEditMode"
    />
    <LazyCanvasForm
      v-else
      :content-values="contentValues"
      @on-cancel="handleCancelBtnClick"
      @on-submit="handleCanvasFormSubmit"
      :on-photos-selected="onPhotosSelected"
      :on-photos-from-db-removed="onPhotosFromDbRemove"
    >
      <UFormGroup v-if="canvas === 'one' || canvas === 'two'" name="description">
        Описание
        <UTextarea
          color="sky"
          size="xl"
          v-model="contentValues.description"
          placeholder="Введите описание..."
        />
      </UFormGroup>
      <PersonaInputFields
        v-if="['one', 'two', 'three', 'four'].includes(canvas!)"
        v-model:persona-data="contentValues.personaOne"
        :photo="contentValues.personaOne.photo"
        :heading="`Контакт${canvas === 'three' || canvas === 'four' ? ' 1' : ''}`"
        @on-photo-change="onPersonaOnePhotoSelected"
      />
      <PersonaInputFields
        v-if="canvas === 'three' || canvas === 'four'"
        v-model:persona-data="contentValues.personaTwo"
        :photo="contentValues.personaTwo.photo"
        :heading="'Контакт 2'"
        @on-photo-change="onPersonaTwoPhotoSelected"
      />
    </LazyCanvasForm>
    <PageSections
      v-if="!isInEditMode && contentValues._id"
      :sections="contentValues.sections"
      :content-id="contentValues._id"
      :is-single="false"
    />
  </main>
</template>

<style lang="scss"></style>
