<script setup lang="ts">
const contentValues = ref({
  heading: '',
  description: '',
  plainText: '', // type HTMLElement?
  photos: []
});
const isInEditMode = ref(false);
const pageTitle = usePageTitle();

watch(
  () => contentValues.value.heading,
  (newValue, oldValue) => {
    pageTitle.value = newValue;
  }
);

// const props = defineProps(['heading', 'description', 'plainText']);

const originalState = {
  heading: '',
  description: '',
  plainText: '',
  photos: []
};

const onPhotosSelected = (event: any) => {
  console.log(event);
  contentValues.value.photos = event.target.files;
  console.log(contentValues.value.photos);
};

const enableEditMode = () => {
  originalState.heading = contentValues.value.heading;
  originalState.description = contentValues.value.description;
  originalState.plainText = contentValues.value.plainText;
  originalState.photos = contentValues.value.photos;

  isInEditMode.value = true;
};

const disableEditMode = () => (isInEditMode.value = false);

const handleCancelBtnClick = () => {
  contentValues.value.heading = originalState.heading;
  contentValues.value.description = originalState.description;
  contentValues.value.plainText = originalState.plainText;
  contentValues.value.photos = originalState.photos;

  disableEditMode();
};

const handleCanvasFormSubmit = (newVal: any) => {
  contentValues.value = newVal;
  console.log(contentValues.value);
  disableEditMode();

  // add seo to server!!!!
  // useSeoMeta({
  //   title: contentValues.value.heading,
  //   description: contentValues.value.description
  // });
};
</script>

<template>
  <main class="page-content">
    <article v-if="!isInEditMode" class="page">
      <div class="page__container">
        <PersonaCard></PersonaCard>
        <p class="page__description">
          {{ contentValues.description }}
        </p>
      </div>
      <div v-html="contentValues.plainText" class="page__plain-text"></div>
      <!-- <UCarousel></UCarousel> -->
      <MenuButton class="page__edit-btn" :is-small="true" @click="enableEditMode">
        Редактировать
      </MenuButton>
    </article>
    <CanvasForm
      v-else
      :content-values="contentValues"
      @on-cancel="handleCancelBtnClick"
      @submit="handleCanvasFormSubmit"
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
