<script setup lang="ts">
import type { Content, OriginalContentValues } from '~/types/ContentDataFromDb';
import type { PersonaData, PersonaDataArray } from '~/types/PersonasDataFromDb';

const contentValues: Ref<Content> = ref({
  _id: '',
  title: '',
  description: '',
  text: '',
  photos: [],
  personas: [],
  sections: [],
  route: ''
});

// persona's refs

const personasOptions: Ref<PersonaDataArray> = ref([]);
const chosenPersona: Ref<PersonaData> = ref({
  _id: '',
  name: '',
  telNumber: '',
  faxNumber: '',
  email: '',
  description: '',
  photo: ''
});
const personaData: Ref<PersonaData> = ref({
  _id: '',
  name: '',
  telNumber: '',
  faxNumber: '',
  email: '',
  description: '',
  photo: ''
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

// выбираем персону - смена данных в рефе
watch(chosenPersona, (newValue: PersonaData) => {
  personaData.value = newValue;
});

// данные о странице от router
const props = defineProps(['routeData']);

// запрос на контент
const content = await useFetch(`/api/content/${props.routeData._id}`, {
  watch: false
});

// если запрос был ранее сохранён, то
// меняем значение wasContentBefore (на его основе происходит определение запроса, который будет отправляться - post или patch (см. handleCanvasFormSubmit))
// заполняем значения контента для формы и отображения на странице
// добавляем мета теги в виде заголовка и описания страницы
if (content.data.value) {
  wasContentBefore = true;
  contentValues.value = content.data.value;

  useSeoMeta({
    title: () => content.data.value.title,
    description: () => content.data.value.description
  });
}

// запрос на всех персон, что сохранены в db
const personasFromDB = await useFetch('/api/persona', {
  watch: false
});

// если персоны есть, то сохраняем
if (personasFromDB.data.value) {
  personasOptions.value = personasFromDB.data.value;
}

// пропс для PersonaInputFields, чтобы избежать props drilling
provide('personaData', personaData);

// переменная для сохранения промежуточные значений
// на её основе мы сохраняем значения полей контента в случае нажатия кнопки Отмена
// и определяем, есть ли изменения при сабмите формы (см. handleCanvasFormSubmit)
let originalState: OriginalContentValues = {
  title: '',
  description: '',
  text: '',
  photos: [],
  personaData: {
    name: '',
    telNumber: '',
    faxNumber: '',
    email: '',
    description: '',
    photo: ''
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

  originalState.personaData.name = personaData.value.name;
  originalState.personaData.telNumber = personaData.value.telNumber;
  originalState.personaData.faxNumber = personaData.value.faxNumber;
  originalState.personaData.email = personaData.value.email;
  originalState.personaData.description = personaData.value.description;
  originalState.personaData.photo = personaData.value.photo;

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
    personaData: {
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

  personaData.value.name = originalState.personaData.name;
  personaData.value.telNumber = originalState.personaData.faxNumber;
  personaData.value.faxNumber = originalState.personaData.faxNumber;
  personaData.value.email = originalState.personaData.email;
  personaData.value.description = originalState.personaData.description;
  personaData.value.photo = originalState.personaData.photo;

  disableEditMode();
};

// сабмит формы
const handleCanvasFormSubmit = async () => {
  const contentBody = {
    title: contentValues.value.title,
    description: contentValues.value.description,
    text: contentValues.value.text,
    photos: contentValues.value.photos,
    personas: contentValues.value.personas,
    sections: contentValues.value.sections
  };
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
    } catch (error) {
      console.error(error);
    }
  } else {
    const contentBefore = {
      title: contentValues.value.title,
      description: contentValues.value.description,
      text: contentValues.value.text,
      photos: contentValues.value.photos,
      personaData: {
        name: personaData.value.name,
        telNumber: personaData.value.telNumber,
        faxNumber: personaData.value.faxNumber,
        email: personaData.value.email,
        description: personaData.value.description,
        photo: personaData.value.photo
      }
    };

    if (JSON.stringify(originalState) === JSON.stringify(contentBefore)) {
      disableEditMode();
    } else {
      disableEditMode();
      //   try {
      //   const data = await $fetch(`/api/content/${contentValues.value._id}`, {
      //     method: 'patch',
      //     body: contentBody
      //   });
      //   disableEditMode();
      // } catch (error) {
      //   console.error(error);
      // }
    }
  }
};
</script>

<template>
  <main class="page-content">
    <article v-if="!isInEditMode" class="page">
      <div class="page__container">
        <div>
          <p></p>
          <PersonaCard :persona-data="personaData"></PersonaCard>
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
      <PersonaFieldset :personas-options="personasOptions" v-model:chosen-persona="chosenPersona" />
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
