<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Начните печатать...'
  }
});

const contentModel = defineModel();
</script>

<template>
  <div>
    <Editor
      api-key="j9zmlsfscynrcssyawis2dp00r22qej7ry4srjvz4k06rbo6"
      :init="{
        plugins:
          'lists link image table code help wordcount autolink autosave media preview autoresize',
        toolbar_mode: 'sliding',
        language: 'ru',
        statusbar: false,
        resize: true,
        min_height: 500,
        placeholder: props.placeholder,
        referrer_policy: 'origin'
      }"
      model-events="change keydown focus paste undo redo"
      output-format="html"
      v-model="contentModel"
    />
    <span class="error" style="font-size: 13px; line-height: 1.5"
      >Если при вставке мультимедиа вы заметили, что форма стала размытой – это ошибка браузера
      Chrome. Попробуйте воспользоваться другим браузером, если размытость вам мешает.</span
    >
  </div>
</template>
