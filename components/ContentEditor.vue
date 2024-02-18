<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
  output: {
    type: String,
    default: 'html'
  }
});
</script>

<template>
  <Editor
    api-key="j9zmlsfscynrcssyawis2dp00r22qej7ry4srjvz4k06rbo6"
    :init="{
      plugins:
        'lists link image table code help wordcount autolink autosave media preview autoresize',
      toolbar_mode: 'sliding',
      language: 'ru',
      statusbar: false,
      resize: true,
      min_height: 500
    }"
    model-events="change keydown focus paste undo redo"
    :output-format="props.output"
  />
</template>
