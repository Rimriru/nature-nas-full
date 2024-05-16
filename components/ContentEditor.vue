<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Начните печатать...'
  }
});

const init = {
  language: 'ru',
  plugins: 'lists image link table charmap fullscreen preview anchor insertdatetime media autosave',
  toolbar_mode: 'sliding',
  toolbar:
    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap  preview | image media link anchor',
  statusbar: false,
  resize: true,
  min_height: 500,
  placeholder: props.placeholder,
  referrer_policy: 'origin',
  resize_img_proportional: true
};

const contentModel = defineModel();
</script>

<template>
  <div>
    <Editor
      :api-key="$config.public.tinymce"
      :init="init"
      model-events="change keydown focus paste undo redo"
      output-format="html"
      v-model="contentModel"
    />
    <span class="error" style="font-size: 13px; line-height: 1.5"
      >Если при работе с редактором вы заметили, что форма стала размытой – это ошибка браузера
      Chrome. Попробуйте воспользоваться другим браузером, если размытость вам мешает.</span
    >
  </div>
</template>
