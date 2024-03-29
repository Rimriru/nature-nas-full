<script setup lang="ts">
import type { CanvasOneContent, OriginalContentValues } from '~/types/ContentDataFromDb';

const contentValues = ref<CanvasOneContent>({
  _id: '',
  title: '',
  description: '',
  text: '',
  photos: [],
  personaOne: {
    position: '',
    name: '',
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

const isInEditMode = ref(false);
let wasContentBefore = false;
const pageTitle = usePageTitle();
const notifications = useToast();
const config = useRuntimeConfig();

// данные о странице от router
const props = defineProps(['routeData']);

// динамичная смена заголовка в HeadingImage
watch(
  () => contentValues.value.title,
  (newValue) => {
    pageTitle.value = newValue;
  }
);

// запрос на контент
const content = await useFetch(`/api/content/${props.routeData._id}`, {
  watch: false,
  pick: ['_id', 'title', 'description', 'text', 'sections', 'photos', 'personaOne']
});

// если запрос был ранее сохранён, то
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
    telNumber: '',
    faxNumber: '',
    email: '',
    description: '',
    photo: ''
  }
};

const onPhotosSelected = (event: any) => {
  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length > 0) {
    const files = fileInputData.files;
    carouselPhotosForLoading.value = files;
  }
};

const onPersonaPhotoSelected = (newPhoto: File | string) => {
  personaPhotoForUploading.value = newPhoto;
  personaPhotoInputChanged.value = true;
};

// сохранение промежуточных значений контента и персоны
const enableEditMode = () => {
  originalState.title = contentValues.value.title;
  originalState.description = contentValues.value.description;
  originalState.text = contentValues.value.text;
  originalState.photos = contentValues.value.photos;

  originalState.personaOne.position = contentValues.value.personaOne.position;
  originalState.personaOne.name = contentValues.value.personaOne.name;
  originalState.personaOne.telNumber = contentValues.value.personaOne.telNumber;
  originalState.personaOne.faxNumber = contentValues.value.personaOne.faxNumber;
  originalState.personaOne.email = contentValues.value.personaOne.email;
  originalState.personaOne.description = contentValues.value.personaOne.description;
  originalState.personaOne.photo = contentValues.value.personaOne.photo;
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
  contentValues.value.personaOne.telNumber = originalState.personaOne.telNumber;
  contentValues.value.personaOne.faxNumber = originalState.personaOne.faxNumber;
  contentValues.value.personaOne.email = originalState.personaOne.email;
  contentValues.value.personaOne.description = originalState.personaOne.description;
  contentValues.value.personaOne.photo = originalState.personaOne.photo;

  disableEditMode();
};

// сабмит формы
const handleCanvasFormSubmit = async () => {
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
        } else {
          const previousPhoto = contentValues.value.personaOne.photo;
          contentValues.value.personaOne.photo = response._data[0];

          if (previousPhoto) {
            await $fetch(`/api/images/${previousPhoto}`, {
              method: 'delete'
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
        method: 'delete'
      });
    }
  }

  if (carouselPhotosForLoading.value.length > 0) {
    const body = new FormData();
    const images = Array.from(carouselPhotosForLoading.value);
    images.forEach((image) => {
      body.append('images', image);
    });

    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (!response.ok) {
          notifications.add({
            id: 'file-upload',
            title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
          });
        } else {
          const previousPhotos = contentValues.value.photos;
          contentValues.value.photos = response._data;
          if (previousPhotos) {
            previousPhotos.forEach(async (photo) => {
              await $fetch(`/api/images/${photo}`, {
                method: 'delete'
              });
            });
          }
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
      const data = await $fetch('/api/content', {
        method: 'post',
        body: newContentBody
      });
      disableEditMode();
      wasContentBefore = true;
    } catch (error) {
      console.error(error);
    }
  } else {
    if (JSON.stringify(originalState) === JSON.stringify(contentBody)) {
      disableEditMode();
    } else {
      try {
        const data = await $fetch(`/api/content/${contentValues.value._id}`, {
          method: 'patch',
          body: contentBody
        });
        disableEditMode();
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<template>
  <main class="page-content">
    <article v-if="!isInEditMode" class="page">
      <div class="page__container">
        <PersonaCard :persona-data="contentValues.personaOne"></PersonaCard>
        <p v-if="contentValues.description" class="page__description">
          {{ contentValues.description }}
        </p>
      </div>
      <div v-html="contentValues.text" class="page__plain-text"></div>
      <UCarousel
        v-if="contentValues.photos.length > 0"
        v-slot="{ item }"
        :items="contentValues.photos"
        :ui="{ item: 'basis-full snap-center justify-center' }"
        class="page__carousel"
        arrows
        indicator
      >
        <img
          :src="`${config.public.domen}/image/${item}`"
          class="page__carousel-img"
          draggable="false"
        />
      </UCarousel>
      <MenuButton class="page__edit-btn" :is-small="true" @click="enableEditMode">
        Редактировать
      </MenuButton>
    </article>
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
      <label for="carousel">
        Загрузить фото для галереи:
        <input
          style="display: none"
          id="carousel"
          type="file"
          multiple
          ref="fileInput"
          accept="image/gif, image/jpeg, image/png"
          @change="onPhotosSelected"
        />
        <UButton color="blue" variant="soft" @click="($refs.fileInput as HTMLInputElement).click()">
          Выбрать файл
        </UButton>
        <p v-if="carouselPhotosForLoading.length > 0">
          Последний загруженный файл:
          {{ (carouselPhotosForLoading[0] as File).name }}
        </p>
      </label>
    </CanvasForm>
    <!-- Секции -->
    <PageSections />
  </main>
</template>

<style lang="scss">
.page {
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  .page__container {
    display: flex;
    justify-content: space-around;
  }

  .page__plain-text {
    margin-bottom: 50px;
  }

  .page__carousel {
    max-width: 1000px;
    margin: 0 auto 30px;

    .page__carousel-img {
      max-width: 1000px;
      max-height: 564px;
      object-fit: contain;
    }
  }

  .page__edit-btn {
    margin: 0 auto;
  }
}
</style>
