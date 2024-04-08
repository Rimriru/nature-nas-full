<script setup lang="ts">
import type { Form, FormError } from '#ui/types';

const form = ref<Form<string> | null>(null);

const groupData = defineModel<{
  title: string;
}>();

defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  error: string;
}>();

const emit = defineEmits(['onClose', 'onAdd', 'onEdit', 'onRemove']);

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
    <UForm
      ref="form"
      :state="groupData"
      :validate="validate"
      @submit="isEditing ? emit('onEdit') : emit('onAdd')"
      class="group-form"
    >
      <h4 class="group-form__heading">
        {{ isEditing ? 'Изменить или удалить ссылку' : 'Создать новую ссылку' }}
      </h4>
      <UFormGroup name="title">
        Название
        <span class="required">*</span>
        <UInput color="sky" v-model="groupData!.title" placeholder="Введите название группы..." />
      </UFormGroup>
      <span class="error" v-if="error">{{ error }}</span>
      <div class="group-form__btn-container">
        <MenuButton :size="'small'" @click="handlePopupClose"> Отменить </MenuButton>
        <MenuButton :size="'small'" :is-active="true" :button-type="'submit'">
          Сохранить
        </MenuButton>
      </div>
    </UForm>
    <div v-if="isEditing">
      <UDivider label="ИЛИ" class="divider" />
      <UButton block color="red" variant="soft" @click="emit('onRemove')">Удалить</UButton>
    </div>
  </AppPopup>
</template>

<style lang="scss">
.group-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-items: flex-end;
  text-align: left;

  .group-form__heading {
    font-size: 18px;
    text-align: center;
  }

  .group-form__btn-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
}

.divider {
  margin: 25px 0;
}
</style>
