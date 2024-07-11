<script setup lang="ts">
import defaultNewsCover from '~/assets/images/news-preview-default.jpg';
import {
  fileSizeError,
  NEWS_COVER_REQUIRED_ERROR,
  IMAGE_LINK_VALIDATION_ERROR
} from '~/utils/errorMessages';

defineProps<{
  coverErrorVisibility: {
    requiredError: boolean;
    linkValidationError: boolean;
    fileSizeError: boolean;
  };
  coverPreview: string;
}>();

const coverAsLinkModel = defineModel();

const emit = defineEmits(['onNewsCoverInputChange', 'onNewsCoverLinkChange']);

const coverImageInput = ref();

defineExpose({
  coverImageInput
});
</script>

<template>
  <UFormGroup name="cover">
    <div
      :class="[
        'news-form__cover-block',
        { 'news-form__cover-block_required': coverErrorVisibility.requiredError }
      ]"
    >
      <div
        class="news-form__cover-perview"
        :style="{ backgroundImage: `url(${coverPreview ? coverPreview : defaultNewsCover})` }"
      ></div>
      <p>
        <span class="required">*</span>
        Выбрать фото для обложки:
      </p>
      <div class="news-form__cover-file">
        <input
          style="display: none"
          id="newsCover"
          type="file"
          ref="coverImageInput"
          accept="image/jpeg, image/png"
          @change="(evt: Event) => emit('onNewsCoverInputChange', evt)"
        />
        <LoadButton
          class="w-30 mx-auto"
          @on-click="($refs.coverImageInput as HTMLInputElement).click()"
        />
        <span v-if="coverErrorVisibility.fileSizeError" class="error">{{
          fileSizeError('2')
        }}</span>
      </div>
      <UDivider label="или" class="mb-5" />
      <UInput
        v-model="coverAsLinkModel"
        placeholder="Вставьте ссылку на изображение..."
        @keyup="emit('onNewsCoverLinkChange')"
      />
      <span class="error cover-error" v-if="coverErrorVisibility.linkValidationError">{{
        IMAGE_LINK_VALIDATION_ERROR
      }}</span>
    </div>
    <span v-if="coverErrorVisibility.requiredError" class="error cover-error">{{
      NEWS_COVER_REQUIRED_ERROR
    }}</span>
  </UFormGroup>
</template>

<style lang="scss">
.cover-error {
  max-width: 300px;
}
</style>
