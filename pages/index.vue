<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
const route = ref('');
const canvas = ref('');
</script>

<template>
  <div class="content">
    <form novalidate>
      <label class="route-input"
        >http://www.nature-nas.by/
        <input v-model="route" type="text" placeholder="Название страницы латинницей" required />
        <span class="required">*</span>
      </label>
      <fieldset>
        <p>Выберите шаблон страницы:</p>
        <label>
          <input v-model="canvas" type="radio" value="canvas1" name="canvas" checked />
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
    <div class="editor">
      <Editor
        api-key="j9zmlsfscynrcssyawis2dp00r22qej7ry4srjvz4k06rbo6"
        :init="{
          plugins: 'lists link image table code help wordcount autolink autosave media preview',
          toolbar_mode: 'sliding',
          language: 'ru'
        }"
      />
    </div>
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

.editor {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
