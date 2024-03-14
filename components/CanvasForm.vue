<script setup lang="ts">
import type { Form, FormError } from '#ui/types';
const canvasForm = ref(null);
const props = defineProps(['contentValues']);
const emit = defineEmits(['onCancel', 'submit']);

const formValues = reactive({
  heading: props.contentValues.heading,
  description: props.contentValues.description,
  plainText: props.contentValues.plainText,
  photos: props.contentValues.photos
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.heading)
    errors.push({ path: 'heading', message: 'Поле "Заголовок" является обязательным' });
  return errors;
};

const onCancel = () => {
  emit('onCancel');
  if (canvasForm.value) return (canvasForm.value as Form<string>).clear();
};

const onSubmit = () => {
  emit('submit', formValues);
};
</script>

<template>
  <UForm
    class="canvas-form"
    :state="formValues"
    ref="canvasForm"
    :validate="validate"
    @submit="onSubmit"
  >
    <UFormGroup name="heading">
      Заголовок страницы
      <span class="required">*</span>
      <UInput
        color="sky"
        v-model="formValues.heading"
        placeholder="Введите заголовок страницы..."
      />
    </UFormGroup>

    <UFormGroup name="description">
      Описание
      <UTextarea
        color="sky"
        size="xl"
        v-model="formValues.description"
        placeholder="Введите описание..."
      />
    </UFormGroup>

    <UFormGroup name="plainText">
      Содержимое
      <ClientOnly>
        <ContentEditor v-model="formValues.plainText" />
      </ClientOnly>
    </UFormGroup>
    <slot />

    <div class="canvas-form__btns-container">
      <MenuButton @click="onCancel" :is-small="true"> Отменить </MenuButton>
      <MenuButton :is-small="true" :is-active="true" :button-type="'submit'">
        Сохранить
      </MenuButton>
    </div>
  </UForm>
</template>

<style lang="scss">
.canvas-form {
  margin: 0 auto;
  display: grid;
  grid-column: 1fr;
  gap: 30px;

  .canvas-form__btns-container {
    display: flex;
    max-width: fit-content;
    margin: 0 auto;
    gap: 30px;
  }
}
</style>
