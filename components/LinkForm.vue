<script setup lang="ts">
import type { FormError } from '#ui/types';

const form = ref(null);

const props = defineProps(['linkValue', 'isOpened', 'groupingLinkTitle', 'error', 'place']);
const emit = defineEmits(['onClose', 'onSubmit', 'onMount']);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Название" является обязательным' });
  if (!state.to)
    errors.push({ path: 'to', message: 'Поле "Ссылка на страницу" является обязательным' });
  if (!/^\/(?!\/)[a-zA-Z]/.test(state.to))
    errors.push({
      path: 'to',
      message: 'Ссылка должна начинаться с / и содержать латинские символы после'
    });
  return errors;
};

onMounted(() => {
  emit('onMount', form.value);
});
</script>

<template>
  <AppPopup :is-opened="props.isOpened" @on-close="emit('onClose')">
    <UForm
      :state="props.linkValue"
      :validate="validate"
      ref="form"
      class="link-form"
      @submit="emit('onSubmit')"
    >
      <h3>
        {{
          props.place === 'header'
            ? `Добавить ссылку в ${props.groupingLinkTitle}`
            : 'Редактировать ссылку'
        }}
      </h3>
      <UFormGroup name="title">
        Название
        <span class="required">*</span>
        <UInput
          color="blue"
          v-model="props.linkValue.title"
          placeholder="Введите название ссылки"
        />
      </UFormGroup>
      <UFormGroup name="to" :eager-validation="true">
        Ссылка (http://www.nature-nas.by*ссылка*)
        <span class="required">*</span>
        <UInput color="blue" v-model="props.linkValue.to" placeholder="Введите ссылку: /..." />
      </UFormGroup>
      <span class="error" v-if="props.error">{{ props.error }}</span>
      <div class="link-form__btns">
        <MenuButton @click="emit('onClose')" :is-small="true">Отмена</MenuButton>
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
  max-width: 350px;

  .link-form__btns {
    display: flex;
    gap: 15px;
    margin: 0 auto;
  }
}
</style>
