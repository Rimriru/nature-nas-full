<script setup lang="ts">
type Section = {
  title: string;
  text: string;
};

const heading = ref('Заголовок');
const description = ref('Описание');
const plainText = ref('Текст');
const photos = ref(null);
const sections: Ref<Section[]> = ref([]);
const isInEditMode = ref(false);
const whatSectionShown = ref('');
const isAddSectionPopupOpened = usePopupOpeningState();

const props = defineProps(['heading', 'description', 'plainText']);

const originalStates = {
  heading: '',
  description: '',
  plainText: '',
  photos: null
};

const onPhotosSelected = (event: any) => (photos.value = event.target.files);

const onEditorInput = (val: string) => {
  plainText.value = val;
  console.log(plainText.value);
  console.log(val);
};
const enableEditMode = () => {
  originalStates.heading = heading.value;
  originalStates.description = description.value;
  originalStates.plainText = plainText.value;
  originalStates.photos = photos.value;

  isInEditMode.value = true;
};

const disableEditMode = () => (isInEditMode.value = false);

const handleCancelBtnClick = () => {
  heading.value = originalStates.heading;
  description.value = originalStates.description;
  plainText.value = originalStates.plainText;
  photos.value = originalStates.photos;

  disableEditMode();
};
</script>

<template>
  <div>
    <article v-if="!isInEditMode" class="canvas">
      <h1 class="canvas__heading">
        {{ heading }}
      </h1>
      <p class="canvas__description">
        {{ description }}
      </p>
      <p class="canvas__plain-text">
        {{ plainText }}
      </p>
      <Carousel>
        <Slide v-for="slide in photos" :key="slide">
          <div class="carousel__item">{{ slide }}</div>
        </Slide>
        <template #addons>
          <Navigation />
        </template>
      </Carousel>
      <MenuButton @click="enableEditMode" :is-small="true" :button-type="'button'">
        Редактировать
      </MenuButton>
    </article>
    <form v-else novalidate>
      <label for="heading">
        Заголовок страницы
        <input id="heading" v-model="heading" type="text" />
      </label>
      <label for="description">
        Описание
        <textarea id="description" v-model="description" />
      </label>
      <ClientOnly>
        <ContentEditor v-model="plainText" />
      </ClientOnly>
      <label for="carousel" v-if="isInEditMode">
        Загрузить фото для галереи:
        <input id="carousel" type="file" multiple @change="onPhotosSelected" />
      </label>
      <div>
        <MenuButton @click="handleCancelBtnClick" :is-small="true"> Отменить </MenuButton>
        <MenuButton :is-small="true" :is-active="true" :button-type="'submit'">
          Сохранить
        </MenuButton>
      </div>
    </form>
    <!-- Секции -->
    <div class="canvas__sections">
      <div class="canvas__sections-btns">
        <ul class="canvas__sections-titles" v-if="sections.length">
          <li v-for="{ title } in sections" :key="title">
            <MenuButton type="button" @click="() => (whatSectionShown = title)">{{
              title
            }}</MenuButton>
          </li>
        </ul>
        <button
          class="canvas__sections-add"
          @click="isAddSectionPopupOpened = true"
          type="button"
        ></button>
      </div>
      <p class="canvas__sections-text">
        {{
          sections.length
            ? sections.find((section) => section.title === whatSectionShown)?.text
            : ''
        }}
      </p>
    </div>
  </div>
</template>

<style>
.canvas__sections-btns {
  display: flex;
  gap: 20px;
}
.canvas__sections-add {
  background-image: url('../assets/images/add-btn-stretch.svg');
  background-size: 100%;
  background-repeat: no-repeat;
  width: clamp(100px, 15vw, 150px);
  transition: opacity 0.3s ease;
  height: 35px;

  &:hover {
    opacity: 0.7;
  }
}
</style>
