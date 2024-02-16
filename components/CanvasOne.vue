<script setup lang="ts">
type Section = {
  title: string;
  text: string;
};

const heading = ref('');
const description = ref('');
const plainText = ref('');
const photos = ref(null);
const sections: Ref<Section[]> = ref([]);
const isInEditMode = ref(false);
const whatSectionShown = ref('');
const isAddSectionPopupOpened = usePopupOpeningState();

const props = defineProps(['heading', 'description', 'plainText']);

const onPhotosSelected = (event: any) => (photos.value = event.target.files);
const changeEditModeState = () => (isInEditMode.value = !isInEditMode.value);
</script>

<template>
  <div>
    <article class="canvas">
      <form class="novalidate">
        <!-- Здесь компонент карточки -->
        <input v-if="isInEditMode" v-model="heading" type="text" />
        <h1 v-else class="canvas__heading">
          {{ heading }}
        </h1>
        <textarea v-if="isInEditMode" v-model="description" />
        <p v-else class="canvas__description">
          {{ description }}
        </p>
        <ContentEditor v-if="isInEditMode" v-model="plainText" />
        <p v-else class="canvas__plain-text">
          {{ plainText }}
        </p>
        <input v-if="isInEditMode" type="file" multiple @change="onPhotosSelected" />
        <!-- <Carousel v-else>
          <Slide v-for="slide in photos" :key="slide">
            <div class="carousel__item">{{ slide }}</div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel> -->
        <div class="canvas__sections">
          <div>
            <ul class="canvas__sections-titles">
              <li v-for="{ title } in sections" :key="title">
                <button type="button" @click="() => (whatSectionShown = title)">{{ title }}</button>
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
        <button v-if="!isInEditMode" @click="changeEditModeState" type="button">
          Редактировать
        </button>
        <div v-else>
          <button @click="changeEditModeState">Отменить</button>
          <button type="submit">Сохранить</button>
        </div>
      </form>
    </article>
  </div>
</template>

<style>
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
