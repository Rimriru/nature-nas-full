<script setup lang="ts">
import type { Form, FormError } from '#ui/types';

const form = ref<Form<string> | null>(null);

const groupData = defineModel<{
  title: string;
}>();

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['onClose', 'onSubmit']);

const handlePopupClose = () => {
  form.value?.clear();
  emit('onClose');
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Название" является обязательным' });
  return errors;
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="handlePopupClose">
    <UForm ref="form" :state="groupData" :validate="validate" @submit="emit('onSubmit')">
      <UFormGroup name="title">
        Название
        <span class="required">*</span>
        <UInput color="sky" v-model="groupData!.title" placeholder="Введите название группы..." />
      </UFormGroup>
      <div>
        <MenuButton :size="'small'" @click="handlePopupClose"> Отменить </MenuButton>
        <MenuButton :size="'small'" :is-active="true" :button-type="'submit'">
          Сохранить
        </MenuButton>
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss"></style>
