<script setup lang="ts">
import defaultImg from '~/assets/images/slide-preview-default.jpg';
import {
  FILE_SIZE_ERROR_BEYOND_2_MB,
  NEWS_COVER_REQUIRED_ERROR,
  LINK_VALIDATION_ERROR
} from '~/utils/errorMessages';
import type Slide from '~/types/SlideDataFromDb';
import type { Form, FormError } from '#ui/types';

const slideEditedInfo = reactive<Slide>({
  _id: '',
  img: '',
  content: '',
  placement: ''
});
const imgErrorVisibility = ref({
  requiredError: false,
  fileSizeError: false,
  linkValidationError: false
});
const imgPreview = ref('');
const imgForUploadingAsLink = ref('');
const imgForUploadingAsFile = ref<File | ''>('');
const imgInput = ref<HTMLInputElement | null>(null);
const slideForm = ref<Form<string> | null>(null);
const submitError = ref('');
const config = useRuntimeConfig();
const notifications = useToast();

const slidesState = useHomeSlidesState();

let originalSlideData = {
  img: '',
  content: ''
};

const props = defineProps<{
  isOpen: boolean;
  slideData: Slide | '';
}>();

const emit = defineEmits(['onClose']);

watch(
  () => props.slideData,
  (newValue) => {
    if (newValue) {
      slideEditedInfo._id = newValue._id;
      slideEditedInfo.content = newValue.content;
      slideEditedInfo.img = newValue.img;
      slideEditedInfo.placement = newValue.placement;

      const { _id, placement, ...rest } = newValue;
      originalSlideData = rest;

      if (IMAGE_LINK_REG_EXP.test(newValue.img)) {
        imgForUploadingAsLink.value = newValue.img;
        imgPreview.value = newValue.img;
      } else {
        imgPreview.value = `${config.public.domen}/image/${newValue.img}`;
      }
    }
  }
);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.content)
    errors.push({ path: 'content', message: 'Поле "Содержимое" является обязательным' });
  if (state.content.length > 1200)
    errors.push({ path: 'content', message: 'Размер содержимого превышает лимит в 1200 символов' });
  return errors;
};

const handleClose = () => {
  resetFormValues();
  setErrorsDefaultValues();
  slideForm.value?.clear();
  if (imgInput.value) {
    imgInput.value.value = '';
  }
  emit('onClose');
};

const setErrorsDefaultValues = () => {
  imgErrorVisibility.value = {
    fileSizeError: false,
    linkValidationError: false,
    requiredError: false
  };
  submitError.value = '';
};

const resetFormValues = () => {
  slideEditedInfo._id = '';
  slideEditedInfo.content = '';
  slideEditedInfo.img = '';
  slideEditedInfo.placement = '';
  imgPreview.value = '';
  originalSlideData = {
    img: '',
    content: ''
  };
};

const handleImgFileChange = (event: Event) => {
  imgForUploadingAsLink.value = '';
  setErrorsDefaultValues();
  const fileInputData = event.target as HTMLInputElement;

  if (fileInputData.files && fileInputData.files.length) {
    const file = fileInputData.files[0];
    if (file.size > 2500000) return (imgErrorVisibility.value.fileSizeError = true);
    imgForUploadingAsFile.value = file;
    imgPreview.value = URL.createObjectURL(file);
  } else {
    imgForUploadingAsFile.value = '';
    imgPreview.value = '';
  }
};

const handleImgLinkChange = () => {
  imgForUploadingAsFile.value = '';
  if (imgInput.value) {
    imgInput.value.value = '';
  }
  setErrorsDefaultValues();
  if (!IMAGE_LINK_REG_EXP.test(imgForUploadingAsLink.value)) {
    imgErrorVisibility.value.linkValidationError = true;
    imgPreview.value = '';
    return;
  }
  imgPreview.value = imgForUploadingAsLink.value;
};

const handleSlideFormSubmit = async () => {
  const initialValues = JSON.stringify(originalSlideData);
  submitError.value = '';

  if (imgForUploadingAsLink.value && imgForUploadingAsLink.value !== slideEditedInfo.img) {
    const initialImg = slideEditedInfo.img;
    slideEditedInfo.img = imgForUploadingAsLink.value;
    imgForUploadingAsLink.value = '';

    if (initialImg && !IMAGE_LINK_REG_EXP.test(initialImg)) {
      await $fetch(`/api/images/${initialImg}`, {
        method: 'delete',
        onResponse({ response }) {
          if (!response.ok) {
            notifications.add({
              id: 'slides',
              title: String(response.status),
              description: response.statusText
            });
            return;
          }
        }
      });
    }
  }

  if (imgForUploadingAsFile.value) {
    const body = new FormData();
    body.append('images', imgForUploadingAsFile.value);
    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (response.ok) {
          const previousImgFile =
            slideEditedInfo.img && !IMAGE_LINK_REG_EXP.test(slideEditedInfo.img)
              ? slideEditedInfo.img
              : '';
          slideEditedInfo.img = response._data[0];
          imgForUploadingAsFile.value = '';

          if (previousImgFile) {
            await $fetch(`/api/images/${previousImgFile}`, {
              method: 'delete',
              onResponse({ response }) {
                if (!response.ok) {
                  notifications.add({
                    id: 'slides',
                    title: String(response.status),
                    description: response.statusText
                  });
                  return;
                }
              }
            });
          }
        } else {
          notifications.add({
            id: 'slides',
            title: String(response.status),
            description: response.statusText
          });
          return;
        }
      }
    });
  }
  const editedSlideId = slideEditedInfo._id;
  const { img, content } = slideEditedInfo;
  const slideBody = { img, content };

  if (initialValues === JSON.stringify(slideBody)) {
    handleClose();
  } else {
    try {
      const editedSlide = await $fetch(`/api/slides/${editedSlideId}`, {
        method: 'patch',
        body: slideBody
      });
      const previousSlideIndex = slidesState.value.findIndex(
        (slide) => slide._id === editedSlideId
      );
      slidesState.value[previousSlideIndex] = editedSlide;
      notifications.add({
        id: 'slides',
        title: 'Слайд был изменён!'
      });
      handleClose();
    } catch (error: any) {
      submitError.value = `${error.statusCode}: ${error.message}`;
      console.log(error);
    }
  }
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="handleClose">
    <UForm
      :state="slideEditedInfo"
      :validate="validate"
      ref="slideForm"
      class="slide-form"
      @submit="handleSlideFormSubmit"
    >
      <h3 class="slide-form__title">Редактировать слайд</h3>
      <UFormGroup name="img" class="slide-form__img-block">
        <div
          :class="[
            'slide-form__img-container',
            { 'slide-form__img-container_required': imgErrorVisibility.requiredError }
          ]"
        >
          <div
            class="slide-form__img-perview"
            :style="{ backgroundImage: `url(${imgPreview ? imgPreview : defaultImg})` }"
          ></div>
          <p>
            <span class="required">*</span>
            Выбрать фото для обложки:
          </p>
          <div class="slide-form__img-file">
            <input
              style="display: none"
              id="img"
              type="file"
              ref="imgInput"
              accept="image/jpeg, image/png"
              @change="handleImgFileChange"
            />
            <LoadButton
              class="w-30 mx-auto"
              @on-click="($refs.imgInput as HTMLInputElement).click()"
            />
            <span v-if="imgErrorVisibility.fileSizeError" class="error">{{
              FILE_SIZE_ERROR_BEYOND_2_MB
            }}</span>
          </div>
          <UDivider label="или" class="mb-5" />
          <UInput
            v-model="imgForUploadingAsLink"
            placeholder="Вставьте ссылку на изображение..."
            @keyup="handleImgLinkChange"
          />
          <span class="error" v-if="imgErrorVisibility.linkValidationError">{{
            LINK_VALIDATION_ERROR
          }}</span>
        </div>
        <span v-if="imgErrorVisibility.requiredError" class="error">{{
          NEWS_COVER_REQUIRED_ERROR
        }}</span>
      </UFormGroup>
      <UFormGroup name="content">
        Содержимое
        <span class="required">*</span>
        <ClientOnly>
          <ContentEditor v-model="slideEditedInfo.content" />
        </ClientOnly>
      </UFormGroup>
      <span v-if="submitError" class="error">{{ submitError }}</span>
      <div class="slide-form__btn-container">
        <MenuButton :size="'middle'" @click="handleClose">Отмена</MenuButton>
        <MenuButton
          :button-type="'submit'"
          :size="'middle'"
          :is-active="true"
          :is-disabled="
            imgErrorVisibility.fileSizeError ||
            imgErrorVisibility.linkValidationError ||
            imgErrorVisibility.requiredError
          "
          >Сохранить</MenuButton
        >
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.slide-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .slide-form__title {
    font-size: 18px;
    text-align: center;
  }

  .slide-form__img-block {
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;

    &_required {
      border: $required 1px solid;
      border-radius: 0.375rem;
    }

    .slide-form__img-perview {
      width: clamp(200px, 35vw, 600px);
      height: 300px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      margin: 0 auto;
      border-radius: 10px;
    }

    .slide-form__img-file {
      padding-bottom: 30px;
      display: grid;
      position: relative;
      width: 100%;

      span.error {
        position: absolute;
        text-align: left;
        top: 33px;
        margin-block: 0;
      }
    }
  }
  .slide-form__btn-container {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
}
</style>
