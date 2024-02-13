<script setup lang="ts">
import CanvasOne from '~/components/CanvasOne.vue';
import CanvasTwo from '~/components/CanvasTwo.vue';
import { useRouteFind } from '~/composables/routes';
// import Editor from '@tinymce/tinymce-vue';

const route = ref('');
const canvas = ref('canvas1');

const canvasToComponent = {
  canvas1: CanvasOne,
  canvas2: CanvasTwo
};

const props = defineProps(['routesFromDb']);
const emit = defineEmits(['submit']);

// TODO: disable submit button when the input isn't valid

const handleCreatePageFormSubmit = async () => {
  if (useRouteFind(props.routesFromDb, route.value)) {
    // TODO: сделать нормальный попап
    return alert('Такая страница уже существует');
  } else {
    const routeName = route.value;
    const routePath = `/${route.value}`;
    const componentCanvas = canvas.value as keyof typeof canvasToComponent;
    const newRoute = await useFetch('/api/routes', {
      method: 'post',
      body: {
        name: routeName,
        path: routePath,
        file: canvasToComponent[componentCanvas]
      }
    });
    console.log(newRoute);
    emit('submit', newRoute.data.value);
    route.value = '';
  }
};
</script>

<template>
  <div class="page-creation">
    <p>Ты на странице создания</p>
    <form class="page-creation__form" novalidate @submit.prevent="handleCreatePageFormSubmit">
      <label class="page-creation__text-filed"
        >http://www.nature-nas.by/
        <input v-model="route" type="text" placeholder="Название страницы латинницей" required />
        <span class="required">*</span>
      </label>
      <fieldset class="page-creation__canvases">
        <p>Выберите шаблон страницы:</p>
        <label class="page-creation__canvas">
          <input v-model="canvas" type="radio" value="canvas1" name="canvas" />
          <img src="../assets/images/canvas-1.png" />
        </label>
        <label class="page-creation__canvas">
          <input v-model="canvas" type="radio" value="canvas2" name="canvas" />
          <img src="../assets/images/canvas-2.png" />
        </label>
        <label class="page-creation__canvas">
          <input v-model="canvas" type="radio" value="canvas3" name="canvas" />
          <img src="../assets/images/canvas-3.png" />
        </label>
        <label class="page-creation__canvas">
          <input v-model="canvas" type="radio" value="canvas4" name="canvas" />
          <img src="../assets/images/canvas-4.png" />
        </label>
        <label class="page-creation__canvas">
          <input v-model="canvas" type="radio" value="canvas5" name="canvas" />
          <img src="../assets/images/canvas-5.png" />
        </label>
        <label class="page-creation__canvas">
          <input v-model="canvas" type="radio" value="canvas6" name="canvas" />
          <img src="../assets/images/canvas-6.png" />
        </label>
      </fieldset>
      <button class="page-creation__submit-btn" type="submit">Создать страницу</button>
    </form>

    <!-- <div class="editor">
      <Editor
        api-key="j9zmlsfscynrcssyawis2dp00r22qej7ry4srjvz4k06rbo6"
        :init="{
          plugins: 'lists link image table code help wordcount autolink autosave media preview',
          toolbar_mode: 'sliding',
          language: 'ru'
        }"
      />
    </div> -->
  </div>
</template>

<style lang="scss">
@import url('../assets/styles/components/pageCreation.scss');
</style>
