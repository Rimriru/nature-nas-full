<script setup lang="ts">
import { fileSizeError } from '~/utils/errorMessages';
defineProps<{
  isOpen: boolean;
  loadedPhoto?: File | string;
}>();
const emit = defineEmits(['onChange', 'onSubmit', 'onClose']);

const photoError = ref('');

const onPhotoChange = (event: Event) => {
  photoError.value = '';

  const fileInputData = event.target as HTMLInputElement;
  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 5000000) return (photoError.value = fileSizeError('5'));
    emit('onChange', file);
  } else {
    emit('onChange', '');
  }
};
</script>

<template>
  <ClientOnly>
    <AppPopup :is-opened="isOpen" @on-close="emit('onClose')">
      <form class="image-load" @submit.prevent="emit('onSubmit')">
        <h2>Загрузить главное фото сайта</h2>
        <label class="photos-input__label" for="carousel">
          <input
            style="display: none"
            id="carousel"
            type="file"
            ref="fileInput"
            accept="image/jpeg, image/png"
            @change="onPhotoChange"
          />
          <LoadButton @on-click="($refs.fileInput as HTMLInputElement).click()" />
        </label>
        <p class="photos-input__loaded">
          Загруженный файл: {{ loadedPhoto ? (loadedPhoto as File).name : 'отсутствует' }}
        </p>
        <span v-if="photoError" class="error">{{ photoError }}</span>
        <div class="image-load__btn-container">
          <MenuButton :size="'small'" @click="emit('onClose')">Отмена</MenuButton>
          <MenuButton
            :is-active="true"
            :is-disabled="loadedPhoto ? false : true"
            :size="'small'"
            :button-type="'submit'"
            >Загрузить</MenuButton
          >
        </div>
      </form>
    </AppPopup>
  </ClientOnly>
</template>

<style lang="scss">
.image-load {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;

  h2 {
    font-size: 18px;
  }

  .photos-input__loaded {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .image-load__btn-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }
}
</style>
