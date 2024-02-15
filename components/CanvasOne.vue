<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';

const heading = ref('');
const description = ref('');
const plainText = ref('');
const photos = ref(null);
const sectionButtons = ref(['first', 'second']);
const sections = ref([
  { title: 'first', text: 'First' },
  { title: 'second', text: 'Second' }
]);
const isInEditMode = ref(false);
const whatSectionShown = ref('');

const props = defineProps(['heading', 'description', 'plainText']);

const onPhotosSelected = (event: any) => (photos.value = event.target.files);
const changeEditModeState = () => (isInEditMode.value = !isInEditMode.value);

const handleclock = (button: any) => {
  whatSectionShown.value = button;
  console.log(button);
  console.log(whatSectionShown.value);
};
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
        <Editor
          v-if="isInEditMode"
          v-model="plainText"
          api-key="j9zmlsfscynrcssyawis2dp00r22qej7ry4srjvz4k06rbo6"
          :init="{
            plugins: 'lists link image table code help wordcount autolink autosave media preview',
            toolbar_mode: 'sliding',
            language: 'ru'
          }"
        />
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
          <ul class="canvas__sections-titles">
            <li v-for="button in sectionButtons" :key="button">
              <button type="button" @click="handleclock(button)">{{ button }}</button>
            </li>
          </ul>
          <p class="canvas__sections-text">
            {{
              sections.length
                ? sections.find((section) => section.title === whatSectionShown)?.text
                : ''
            }}
          </p>
          <!-- <ul class="canvas__sections-text">
            <li v-for="{ title, text } in sections" :key="text" v-show="whatSectionShown === title">
              {{ text }}
            </li>
          </ul> -->
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
