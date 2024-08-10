<script setup lang="ts">
import { PAGE_LINK_REG_EXP } from '~/utils/regExp';
import { PAGE_LINK_VALIDATION_ERROR } from '~/utils/errorMessages';
import type { Form, FormError } from '#ui/types';

const form = ref<Form<string> | null>(null);

const props = defineProps([
  'linkValue',
  'isOpened',
  'groupingLinkTitle',
  'parentRoute',
  'isEditing',
  'isRequestPending',
  'error'
]);
const emit = defineEmits(['onClose', 'onSubmit']);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: 'title', message: 'Поле "Название" является обязательным' });
  if (!state.to)
    errors.push({ path: 'to', message: 'Поле "Ссылка на страницу" является обязательным' });
  if (props.parentRoute !== '/monographs' && !PAGE_LINK_REG_EXP.test(state.to))
    errors.push({
      path: 'to',
      message: PAGE_LINK_VALIDATION_ERROR
    });
  if (props.parentRoute === '/monographs' && !/^\/\w/.test(state.to)) {
    errors.push({
      path: 'to',
      message: 'Ссылка должна начинаться с / и иметь символы после'
    });
  }
  return errors;
};

const handleClose = () => {
  form.value?.clear();
  emit('onClose');
};
</script>

<template>
  <ClientOnly>
    <AppPopup :is-opened="isOpened" @on-close="handleClose">
      <UForm
        :state="linkValue"
        :validate="validate"
        ref="form"
        class="link-form"
        @submit="emit('onSubmit')"
      >
        <h4 class="link-form__heading">
          {{
            groupingLinkTitle ? `Добавить ссылку в ${groupingLinkTitle}` : 'Редактировать ссылку'
          }}
        </h4>
        <UFormGroup name="title">
          Название
          <span class="required">*</span>
          <UInput
            color="blue"
            v-model.trim="linkValue.title"
            placeholder="Введите название ссылки"
          />
        </UFormGroup>
        <UFormGroup name="to" :eager-validation="true">
          Ссылка ({{ $config.public.prodDomen }}{{ parentRoute ?? '' }}*ссылка*)
          <span class="required">*</span>
          <UInput
            color="blue"
            :disabled="parentRoute === '/monographs' && isEditing"
            :class="{ 'link-form__input': parentRoute === '/monographs' && isEditing }"
            v-model.trim="linkValue.to"
            placeholder="Введите ссылку: /..."
          />
          <div v-if="parentRoute === '/monographs' && !isEditing" class="link-form__message">
            <UIcon name="i-material-symbols-info-outline-rounded" class="icon" />
            <div>
              <span class="info">Можно ввести произвольную ссылку.</span>
              <span class="info">Она будет отображена в годе выпуска монографии.</span>
            </div>
          </div>
        </UFormGroup>
        <LazyTinyLoader v-show="isRequestPending" />
        <span class="error" v-if="error">{{ error }}</span>
        <div class="link-form__btns">
          <MenuButton :size="'small'" @click="handleClose">Отмена</MenuButton>
          <MenuButton
            :is-active="true"
            :is-disabled="isRequestPending"
            :button-type="'submit'"
            :size="'small'"
            >{{ isEditing ? 'Сохранить' : 'Добавить' }}</MenuButton
          >
        </div>
      </UForm>
      <slot />
    </AppPopup>
  </ClientOnly>
</template>

<style lang="scss">
.link-form {
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  text-align: left;

  .link-form__heading {
    font-size: 17px;
    text-align: center;
  }

  .link-form__input {
    input:disabled {
      --tw-ring-color: rgb(203 213 225);
    }
  }

  .link-form__message {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .link-form__btns {
    display: flex;
    gap: 15px;
    margin: 0 auto;
  }
}
</style>
