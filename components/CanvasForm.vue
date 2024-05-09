<script setup lang="ts">
import type { Form, FormError } from '#ui/types';
import type { CanvasOptions } from '~/types/ContentDataFromDb';
const canvasForm = ref(null);
const props = defineProps(['contentValues', 'onPhotosSelected', 'onPhotosFromDbRemoved']);
const emit = defineEmits(['onCancel', 'onSubmit']);

const canvas = inject<CanvasOptions>('canvas');

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Заголовок" является обязательным' });
  return errors;
};

const onCancel = () => {
  emit('onCancel');
  if (canvasForm.value) return (canvasForm.value as Form<string>).clear();
};
</script>

<template>
  <UForm
    class="canvas-form"
    :state="props.contentValues"
    ref="canvasForm"
    :validate="validate"
    @submit="emit('onSubmit')"
  >
    <UFormGroup name="title">
      Заголовок страницы
      <span class="required">*</span>
      <UInput
        color="sky"
        v-model="props.contentValues.title"
        placeholder="Введите заголовок страницы..."
      />
    </UFormGroup>

    <UFormGroup v-if="canvas === 'six'" name="plainText">
      Содержимое
      <ClientOnly>
        <ContentEditor v-model="props.contentValues.description" />
      </ClientOnly>
    </UFormGroup>

    <slot />

    <UFormGroup name="plainText">
      Содержимое
      <ClientOnly>
        <ContentEditor v-model="props.contentValues.text" />
      </ClientOnly>
    </UFormGroup>

    <PhotosInputField
      :photos-from-db="contentValues.photos"
      @on-photos-selected="props.onPhotosSelected"
      @update:photos-from-db="props.onPhotosFromDbRemoved"
    />

    <div class="canvas-form__btns-container">
      <MenuButton @click="onCancel" :size="'middle'"> Отменить </MenuButton>
      <MenuButton :size="'middle'" :is-active="true" :button-type="'submit'">
        Сохранить
      </MenuButton>
    </div>
  </UForm>
</template>

<style lang="scss">
.canvas-form {
  margin-right: 40px;
  display: grid;
  gap: 30px;

  .canvas-form__btns-container {
    display: flex;
    max-width: fit-content;
    margin: 0 auto;
    gap: 30px;
  }
}
</style>
