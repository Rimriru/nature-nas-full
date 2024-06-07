<script setup lang="ts">
const props = defineProps(['photosFromDb']);
const emit = defineEmits(['onPhotosSelected', 'update:photosFromDb']);

const photosForUpload = ref<FileList | []>([]);
const photosForDemonstration = ref<string[]>([]);
const photosError = ref('');
const config = useRuntimeConfig();

const onPhotosChange = (event: Event) => {
  photosError.value = '';
  let filesInputData = event.target as HTMLInputElement;
  if (filesInputData.files && filesInputData.files.length > 0) {
    const files = filesInputData.files;
    const filesArray = Array.from(files);
    let errorPresent = false;

    if (filesArray.length > 7) {
      photosError.value = 'Количество выбранных фото превышает рекомендуемое число!';
      errorPresent = true;
    }
    if (errorPresent) {
      filesInputData.value = '';
      return;
    }

    filesArray.forEach((file) => {
      if (file.size > 5242880) {
        photosError.value = fileSizeError('5');
        errorPresent = true;
      }
    });
    if (errorPresent) {
      filesInputData.value = '';
      return;
    }

    photosForUpload.value = files;

    filesArray.forEach((file) => {
      photosForDemonstration.value.push(URL.createObjectURL(file));
    });
  } else {
    emit('onPhotosSelected', []);
  }
};

const onRemovePhotoBtnClick = (src: string) => {
  if (src.startsWith('blob:')) {
    // находим индекс удаляемого фото
    const indexPhotoOfInterest = photosForDemonstration.value.findIndex((photo) => photo === src);

    // находим сам файл в массиве загруженных файлов, а затем оставшиеся файлы загружаем в новый filelist, даём измененный список файлов в массив для загрузки -> emit from watch
    if (photosForUpload.value.length > 1) {
      const photosForUploadArray = Array.from(photosForUpload.value);
      photosForUploadArray.splice(indexPhotoOfInterest, 1);
      const newFileList = new DataTransfer();
      photosForUploadArray.forEach((photo) => newFileList.items.add(photo));
      photosForUpload.value = newFileList.files;

      // убираем из фото для демонстрации
      photosForDemonstration.value.splice(indexPhotoOfInterest, 1);
    } else {
      photosForUpload.value = [];

      // убираем из фото для демонстрации
      photosForDemonstration.value.splice(indexPhotoOfInterest, 1);
    }
  } else {
    const splitedSrc = src.split('/');
    const fileName = splitedSrc[splitedSrc.length - 1];
    emit('update:photosFromDb', fileName);
    photosForDemonstration.value = photosForDemonstration.value.filter((photo) => photo !== src);
  }
};

watch(
  photosForUpload,
  () => {
    emit('onPhotosSelected', photosForUpload.value);
  },
  { deep: true }
);

onMounted(() => {
  if (props.photosFromDb.length > 0) {
    props.photosFromDb.forEach((photo: string) => {
      photosForDemonstration.value.push(
        `${config.public.process === 'production' ? '' : config.public.domen}/image/${photo}`
      );
    });
  }
});
</script>

<template>
  <div class="photos-input">
    <p class="photos-input__title">Фото</p>
    <span class="required photos-input__error">{{ photosError }}</span>
    <label class="photos-input__label" for="carousel">
      Загрузить фото для галереи:
      <input
        style="display: none"
        id="carousel"
        type="file"
        multiple
        ref="fileInput"
        accept="image/jpeg, image/png"
        @change="onPhotosChange"
      />
      <LoadButton @on-click="($refs.fileInput as HTMLInputElement).click()" />
    </label>
    <span class="text-gray-500 text-sm block"
      >Обратите внимание: одновременно можно загрузить лишь до 8 фото</span
    >
    <div class="photos-input__preview">
      <span class="photos-input__preview-text">Предпросмотр:</span>
      <UCarousel
        v-if="photosForDemonstration.length > 0"
        v-slot="{ item }"
        :items="photosForDemonstration"
        :ui="{ item: 'basis-full snap-center justify-center' }"
        class="carousel"
        arrows
        indicators
      >
        <div class="carousel__container">
          <img :src="item" class="carousel__img" draggable="false" />
          <button
            type="button"
            class="carousel__remove-btn button"
            @click="onRemovePhotoBtnClick(item)"
          />
        </div>
      </UCarousel>
      <span class="photos-input__preview-no-img" v-else>изображения отсутствуют</span>
    </div>
  </div>
</template>

<style lang="scss">
.photos-input {
  .photos-input__title {
    font-size: 1.3rem;
    margin-bottom: 5px;
  }

  .photos-input__error {
    font-weight: 500;
    display: block;
  }

  .photos-input__preview {
    margin-top: 10px;

    .photos-input__preview-text {
      margin-right: 5px;
    }

    .photos-input__preview-no-img {
      font-weight: 600;
    }
  }
}
</style>
