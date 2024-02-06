<script setup lang="ts">
import CanvasOne from '~/components/CanvasOne.vue';
import CanvasTwo from '~/components/CanvasTwo.vue';
// import Editor from '@tinymce/tinymce-vue';

const router = useRouter();
const route = ref('');
const canvas = ref('canvas1');
const routes = ref(router.getRoutes());

const canvasToComponent = {
  canvas1: CanvasOne,
  canvas2: CanvasTwo
};

const getAllRoutes = () => {
  routes.value = router.getRoutes();
};

const handleCreatePageFormSubmit = () => {
  if (router.hasRoute(route.value)) {
    // TODO: сделать нормальный попап
    return alert('Такая страница уже существует');
  } else {
    router.addRoute({
      name: route.value,
      path: `/${route.value}`,
      component: canvasToComponent[canvas.value as keyof typeof canvasToComponent]
    });
    route.value = '';
    getAllRoutes();
  }
};

const handleRouteRemove = (name: string) => {
  router.removeRoute(name);
  getAllRoutes();
};
</script>

<template>
  <div class="content">
    <form novalidate @submit.prevent="handleCreatePageFormSubmit">
      <label class="route-input"
        >http://www.nature-nas.by/
        <input v-model="route" type="text" placeholder="Название страницы латинницей" required />
        <span class="required">*</span>
      </label>
      <fieldset>
        <p>Выберите шаблон страницы:</p>
        <label>
          <input v-model="canvas" type="radio" value="canvas1" name="canvas" />
        </label>
        <label>
          <input v-model="canvas" type="radio" value="canvas2" name="canvas" />
        </label>
        <label>
          <input v-model="canvas" type="radio" value="canvas3" name="canvas" />
        </label>
        <label>
          <input v-model="canvas" type="radio" value="canvas4" name="canvas" />
        </label>
        <label>
          <input v-model="canvas" type="radio" value="canvas5" name="canvas" />
        </label>
        <label>
          <input v-model="canvas" type="radio" value="canvas6" name="canvas" />
        </label>
      </fieldset>
      <button type="submit">Создать страницу</button>
    </form>
    <ol>
      <li v-for="{ name, path } in routes" :key="name">
        {{ path }}
        <button
          v-if="!path.startsWith('/admin') && path !== '/'"
          @click="handleRouteRemove(name as string)"
          class="remove-btn-small"
        ></button>
      </li>
    </ol>

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

<style>
.content {
  text-align: center;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.required {
  color: red;
}

.route-input input {
  width: clamp(100px, 15vw, 230px);
  padding-block: 8px;
  border-radius: 10px;
  border: none;
  outline: black solid 1px;
  margin-bottom: 30px;
  margin-right: 5px;
}

fieldset {
  border: none;
}

ol {
  /* list-style: none; */
  padding-left: 0;
}

.remove-btn-small {
  margin-left: 5px;
  background-image: url('~/assets/images/remove-btn.svg');
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: none;
  padding: 0;
  transition: opacity 0.3s ease-in-out;
}

.remove-btn-small:hover {
  cursor: pointer;
  opacity: 0.7;
}

.editor {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
