<script setup lang="ts">
import defaultHorizontalCover from '~/assets/images/news-preview-default.jpg';
import defaultVerticalCover from '~/assets/images/journal-preview-default.jpg';

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
  coverSizeLimit?: string;
  centered?: boolean;
  vertical?: boolean;
}>();

const coverAsLinkModel = defineModel<string | number | undefined>();
const emit = defineEmits(['onCoverInputChange', 'onCoverLinkChange']);

const coverImageInput = ref();

defineExpose({
  coverImageInput
});
</script>

<template>
  <UFormGroup name="cover" :class="['cover', { cover_centered: centered }]">
    <div
      :class="[
        'cover-block',
        {
          'cover-block_required': coverErrorVisibility.requiredError
        }
      ]"
    >
      <div
        :class="['cover-block__perview', { 'cover-block__perview_vertical': vertical }]"
        :style="{
          backgroundImage: `url(${
            coverPreview ? coverPreview : vertical ? defaultVerticalCover : defaultHorizontalCover
          })`
        }"
      ></div>
      <p>
        <span class="required">*</span>
        Выбрать фото для обложки:
      </p>
      <div class="cover-block__cover-file">
        <input
          style="display: none"
          id="newsCover"
          type="file"
          ref="coverImageInput"
          accept="image/jpeg, image/png"
          @change="(evt: Event) => emit('onCoverInputChange', evt)"
        />
        <LoadButton
          class="w-30 mx-auto"
          @on-click="($refs.coverImageInput as HTMLInputElement).click()"
        />
        <span v-if="coverErrorVisibility.fileSizeError" class="error">{{
          fileSizeError(coverSizeLimit ? coverSizeLimit : '2,5')
        }}</span>
      </div>
      <UDivider label="или" class="mb-5" />
      <UInput
        v-model="coverAsLinkModel"
        placeholder="Вставьте ссылку на изображение..."
        @keyup="emit('onCoverLinkChange')"
      />
      <span class="error" v-if="coverErrorVisibility.linkValidationError">{{
        IMAGE_LINK_VALIDATION_ERROR
      }}</span>
    </div>
    <span v-if="coverErrorVisibility.requiredError" class="error">{{
      NEWS_COVER_REQUIRED_ERROR
    }}</span>
  </UFormGroup>
</template>

<style lang="scss">
@import url('~/assets/styles/components/coverBlock.scss');
</style>
