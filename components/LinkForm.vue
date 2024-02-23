<script setup lang="ts">
import type { Form, FormError } from '#ui/types';

const linkValue = reactive({
  title: '',
  path: ''
});
const form = ref(null);

const props = defineProps(['isOpened', 'groupingLinkTitle']);
const emit = defineEmits(['onClose', 'onSubmit']);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Название" является обязательным' });
  if (!state.path)
    errors.push({ path: 'path', message: 'Поле "Ссылка на страницу" является обязательным' });
  return errors;
};

const resetFormFields = () => {
  linkValue.title = '';
  linkValue.path = '';

  if (form.value) return (form.value as Form<string>).clear();
};

const onClose = () => {
  emit('onClose');
  resetFormFields();
};

const onSubmit = () => {
  emit('onSubmit', linkValue.title, linkValue.path);
  onClose();
};
</script>

<template>
  <AppPopup :is-opened="props.isOpened" @on-close="onClose">
    <UForm :state="linkValue" :validate="validate" class="link-form" @submit="onSubmit">
      <h3>Добавить ссылку в "{{ props.groupingLinkTitle }}"</h3>
      <UFormGroup name="title">
        Название
        <span class="required">*</span>
        <UInput color="blue" v-model="linkValue.title" placeholder="Введите название ссылки" />
      </UFormGroup>
      <UFormGroup name="path">
        Ссылка (http://www.nature-nas.by/*ссылка*)
        <span class="required">*</span>
        <UInput color="blue" v-model="linkValue.path" placeholder="Введите ссылку" />
      </UFormGroup>
      <div class="link-form__btns">
        <MenuButton @click="onClose" :is-small="true">Отмена</MenuButton>
        <MenuButton :is-active="true" :button-type="'submit'" :is-small="true">Добавить</MenuButton>
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
.link-form {
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .link-form__btns {
    display: flex;
    gap: 15px;
    margin: 0 auto;
  }
}
</style>
