<script setup lang="ts">
import type { FormError, FormSubmitEvent, Form } from '#ui/types';

const sectionValue = reactive({
  title: '',
  text: ''
});
const form = ref(null);
const isAddSectionPopupOpened = useSectionPopupOpeningState();

const resetFormFields = () => {
  sectionValue.title = '';
  sectionValue.text = '';

  if (form.value) return (form.value as Form<string>).clear();
};

const onClose = () => {
  isAddSectionPopupOpened.value = false;
  resetFormFields();
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Заголовок" является обязательным' });
  if (!state.text)
    errors.push({ path: 'text', message: 'Поле "Содержимое" является обязательным' });
  return errors;
};

const handleSubmit = async (evt: FormSubmitEvent<any>) => {
  console.log(evt.data);
};
</script>

<template>
  <ClientOnly>
    <AppPopup @on-close="onClose" :is-opened="isAddSectionPopupOpened">
      <UForm
        :state="sectionValue"
        :validate="validate"
        class="section-form"
        ref="form"
        @submit="handleSubmit"
      >
        <h3 class="section-form__heading">Добавить новую секцию</h3>

        <UFormGroup name="title" class="section-form__label">
          Заголовок секции
          <span class="required">*</span>
          <UInput color="blue" v-model="sectionValue.title" placeholder="Введите заголовок" />
        </UFormGroup>

        <UFormGroup name="text" class="section-form__label">
          Содержимое
          <span class="required">*</span>
          <ClientOnly>
            <ContentEditor v-model="sectionValue.text" />
          </ClientOnly>
        </UFormGroup>

        <div class="section-form__btns">
          <MenuButton @click="onClose" :is-small="true">Отмена</MenuButton>
          <MenuButton :is-active="true" :button-type="'submit'" :is-small="true"
            >Добавить</MenuButton
          >
        </div>
      </UForm>
    </AppPopup>
  </ClientOnly>
</template>

<style lang="scss">
.section-form {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .section-form__heading {
    text-align: center;
  }

  .section-form__label {
    input {
      border-radius: 10px;
      border: #f6f6f6 1px solid;
      outline: none;
      padding: 8px;
      font-size: 15px;
      width: 100%;
    }
  }

  .section-form__btns {
    display: flex;
    gap: 15px;
    margin: 0 auto;
  }
}
</style>
