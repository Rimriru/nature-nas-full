<script setup lang="ts">
const props = defineProps(['photosFromDb']);
const emit = defineEmits(['onPhotosSelected']);

const photosForDemonstration = ref<string[]>([]);
const photosError = ref('');
const config = useRuntimeConfig();

const onPhotosChange = (event: Event) => {
  photosError.value = '';
  photosForDemonstration.value = [];
  const filesInputData = event.target as HTMLInputElement;
  if (filesInputData.files && filesInputData.files.length > 0) {
    const files = filesInputData.files;
    const filesArray = Array.from(files);
    let errorPresent = false;
    filesArray.forEach((file) => {
      if (file.size > 5242880) {
        photosError.value = 'Размер одного из загружаемых файлов превышает 5 мб!';
        errorPresent = true;
      }
    });

    if (errorPresent) return;

    emit('onPhotosSelected', files);

    filesArray.forEach((file) => {
      photosForDemonstration.value.push(URL.createObjectURL(file));
    });
  } else {
    emit('onPhotosSelected', []);
  }
};

const onRemovePhotoBtnClick = () => {
  //console.log(photosForDemonstration.value);
};

onMounted(() => {
  if (props.photosFromDb.length > 0) {
    props.photosFromDb.forEach((photo: string) => {
      photosForDemonstration.value.push(`${config.public.domen}/image/${photo}`);
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
      <UButton color="blue" variant="soft" @click="($refs.fileInput as HTMLInputElement).click()">
        Выбрать файл
      </UButton>
    </label>
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
          <button class="carousel__remove-btn" @click="onRemovePhotoBtnClick" />
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
