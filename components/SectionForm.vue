<script setup lang="ts">
import type { Section } from '~/types/SectionDataFromDb';
import type { FormError, Form } from '#ui/types';

const sectionValues = defineModel<Section>('sectionValues');
const emit = defineEmits(['close', 'submit']);
const form = ref<Form<string> | null>(null);
const isSectionPopupOpened = useSectionPopupOpeningState();

const onClose = () => {
  form.value?.clear();
  emit('close');
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Заголовок" является обязательным' });
  if (!state.content)
    errors.push({ path: 'content', message: 'Поле "Содержимое" является обязательным' });
  return errors;
};
</script>

<template>
  <ClientOnly>
    <AppPopup @on-close="onClose" :is-opened="isSectionPopupOpened">
      <UForm
        :state="sectionValues"
        :validate="validate"
        class="section-form"
        ref="form"
        @submit="emit('submit')"
      >
        <h4 class="section-form__heading">Добавить новую секцию</h4>
        <UFormGroup name="title" class="section-form__label">
          Заголовок секции
          <span class="required">*</span>
          <UInput color="blue" v-model="sectionValues!.title" placeholder="Введите заголовок" />
        </UFormGroup>
        <UFormGroup name="content" class="section-form__label">
          Содержимое
          <span class="required">*</span>
          <ClientOnly>
            <ContentEditor v-model="sectionValues!.content" />
          </ClientOnly>
        </UFormGroup>
        <div class="section-form__btns">
          <MenuButton @click="onClose" :size="'middle'">Отмена</MenuButton>
          <MenuButton :is-active="true" :button-type="'submit'" :size="'middle'"
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
    font-size: 1.2rem;
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
