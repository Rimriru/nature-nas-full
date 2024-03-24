<script setup lang="ts">
import type {
  ContentFromDb,
  CanvasOneContent,
  OriginalContentValues
} from '~/types/ContentDataFromDb';

const contentValues: Ref<CanvasOneContent> = ref({
  _id: '',
  title: '',
  description: '',
  text: '',
  photos: [],
  personaOne: {
    name: '',
    telNumber: '',
    faxNumber: '',
    email: '',
    description: '',
    photo: {
      path: '',
      filename: ''
    }
  },
  sections: []
});

const isInEditMode = ref(false);
let wasContentBefore = false;
const pageTitle = usePageTitle();

// динамичная смена заголовка в HeadingImage
watch(
  () => contentValues.value.title,
  (newValue) => {
    pageTitle.value = newValue;
  }
);

// данные о странице от router
const props = defineProps(['routeData']);

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
  console.log(content.data.value);
  contentValues.value = content.data.value as CanvasOneContent;
  console.log(contentValues.value);

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
    name: '',
    telNumber: '',
    faxNumber: '',
    email: '',
    description: '',
    photo: {
      path: '',
      filename: ''
    }
  }
};

// временно
const onPhotosSelected = (event: any) => {
  contentValues.value.photos = event.target.files;
  console.log(contentValues.value.photos);
};

// сохранение промежуточных значений контента и персоны
const enableEditMode = () => {
  originalState.title = contentValues.value.title;
  originalState.description = contentValues.value.description;
  originalState.text = contentValues.value.text;
  originalState.photos = contentValues.value.photos;

  console.log(contentValues.value.personaOne);

  originalState.personaOne.name = contentValues.value.personaOne.name;
  originalState.personaOne.telNumber = contentValues.value.personaOne.telNumber;
  originalState.personaOne.faxNumber = contentValues.value.personaOne.faxNumber;
  originalState.personaOne.email = contentValues.value.personaOne.email;
  originalState.personaOne.description = contentValues.value.personaOne.description;
  originalState.personaOne.photo.path = contentValues.value.personaOne.photo.path;
  originalState.personaOne.photo.filename = contentValues.value.personaOne.photo.filename;
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
      name: '',
      telNumber: '',
      faxNumber: '',
      email: '',
      description: '',
      photo: {
        path: '',
        filename: ''
      }
    }
  };
};

// применение промежуточных значений контента и персоны
const handleCancelBtnClick = () => {
  contentValues.value.title = originalState.title;
  contentValues.value.description = originalState.description;
  contentValues.value.text = originalState.text;
  contentValues.value.photos = originalState.photos;

  contentValues.value.personaOne.name = originalState.personaOne.name;
  contentValues.value.personaOne.telNumber = originalState.personaOne.faxNumber;
  contentValues.value.personaOne.faxNumber = originalState.personaOne.faxNumber;
  contentValues.value.personaOne.email = originalState.personaOne.email;
  contentValues.value.personaOne.description = originalState.personaOne.description;
  contentValues.value.personaOne.photo.path = originalState.personaOne.photo.path;
  contentValues.value.personaOne.photo.filename = originalState.personaOne.photo.filename;

  disableEditMode();
};

// сабмит формы
const handleCanvasFormSubmit = async () => {
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
      // disableEditMode();
      wasContentBefore = true;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log(JSON.stringify(originalState) === JSON.stringify(contentBody));
    console.log(originalState);
    console.log(contentBody);
    // if (JSON.stringify(originalState) === JSON.stringify(contentBody)) {
    //   disableEditMode();
    // } else {
    //   try {
    //     const data = await $fetch(`/api/content/${contentValues.value._id}`, {
    //       method: 'patch',
    //       body: contentBody
    //     });
    //     disableEditMode();
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  }
};
</script>

<template>
  <main class="page-content">
    <article v-if="!isInEditMode" class="page">
      <div class="page__container">
        <div>
          <p></p>
          <PersonaCard :persona-data="contentValues.personaOne"></PersonaCard>
        </div>
        <p class="page__description">
          {{ contentValues.description }}
        </p>
      </div>
      <div v-html="contentValues.text" class="page__plain-text"></div>
      <!-- <UCarousel></UCarousel> -->
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
      <PersonaInputFields v-model:persona-data="contentValues.personaOne" />
      <label for="carousel" v-if="isInEditMode">
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
        <p>
          Последний загруженный файл:
          {{ contentValues.photos.length > 0 ? (contentValues.photos[0] as File).name : '' }}
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
    gap: 20px;
  }

  .page__plain-text {
    margin-bottom: 50px;
  }

  .page__edit-btn {
    margin: 0 auto;
  }
}
</style>
