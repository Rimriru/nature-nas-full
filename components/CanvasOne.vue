<script setup lang="ts">
import type { Content, OriginalContentValues } from '~/types/ContentDataFromDb';
//import type RouteDataFromDb from '~/types/RouteDataFromDb';

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
const isInEditMode = ref(false);
let wasContentBefore = false;
const pageTitle = usePageTitle();

watch(
  () => contentValues.value.title,
  (newValue) => {
    pageTitle.value = newValue;
  }
);

const props = defineProps(['routeData']);

const { data } = await useFetch(`/api/content/${props.routeData._id}`, {
  watch: false
});

if (data.value) {
  wasContentBefore = true;
  contentValues.value = data.value;

  useSeoMeta({
    title: () => data.value.title,
    description: () => data.value.description
  });
}

const originalState: OriginalContentValues = {
  title: '',
  description: '',
  text: '',
  photos: []
};

const onPhotosSelected = (event: any) => {
  contentValues.value.photos = event.target.files;
  console.log(contentValues.value.photos);
};

const enableEditMode = () => {
  originalState.title = contentValues.value.title;
  originalState.description = contentValues.value.description;
  originalState.text = contentValues.value.text;
  originalState.photos = contentValues.value.photos;

  isInEditMode.value = true;
};

const disableEditMode = () => (isInEditMode.value = false);

const handleCancelBtnClick = () => {
  contentValues.value.title = originalState.title;
  contentValues.value.description = originalState.description;
  contentValues.value.text = originalState.text;
  contentValues.value.photos = originalState.photos;

  disableEditMode();
};

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
      console.log('After:', data);
      disableEditMode();
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const data = await $fetch(`/api/content/${contentValues.value._id}`, {
        method: 'patch',
        body: contentBody
      });
      console.log('After:', data);
      disableEditMode();
    } catch (error) {
      console.error(error);
    }
  }

  // add seo to server!!!!
  // useSeoMeta({
  //   title: contentValues.value.heading,
  //   description: contentValues.value.description
  // });
};
</script>

<template>
  <ClientOnly>
    <main class="page-content">
      <article v-if="!isInEditMode" class="page">
        <div class="page__container">
          <PersonaCard></PersonaCard>
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
        <!-- <fieldset>
          <legend>Контакт</legend>
          Выбрать существующий: <UInputMenu></UInputMenu>
          Создать новый:
          <UFormGroup></UFormGroup>
          <UFormGroup></UFormGroup>
          <UInput />
        </fieldset> -->
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
          <UButton
            color="blue"
            variant="soft"
            @click="($refs.fileInput as HTMLInputElement).click()"
          >
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
  </ClientOnly>
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
