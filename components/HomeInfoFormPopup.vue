<script setup lang="ts">
import type { Form, FormError } from '#ui/types';

const infoData = reactive({
  id: '',
  content: ''
});
const form = ref<Form<string> | null>(null);

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);
const homeInfoState = useHomeInfoState();
const notifications = useToast();

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && homeInfoState.value) {
      infoData.id = homeInfoState.value?._id;
      infoData.content = homeInfoState.value.content;
    } else {
      form.value?.clear();
      infoData.id = '';
      infoData.content = '';
    }
  }
);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.content)
    errors.push({ path: 'content', message: 'Поле "Содержимое" является обязательным' });
  return errors;
};

const handleHomeInfoFormSubmit = async () => {
  const body = {
    content: infoData.content
  };

  try {
    const editedInfo = await $fetch(`/api/home-info/${infoData.id}`, {
      method: 'patch',
      body
    });
    homeInfoState.value = editedInfo;
    emit('close');
    notifications.add({ id: 'home-info', title: 'Информация о главной была изменена' });
  } catch (error: any) {
    console.error(error);
    notifications.add({
      id: 'home-info',
      title: String(error.status),
      description: error.data.message
    });
  }
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('close')">
    <UForm
      :state="infoData"
      :validate="validate"
      ref="form"
      @submit="handleHomeInfoFormSubmit"
      class="home-info-form"
    >
      <p class="home-info-form__title">Редактировать информацию о главной</p>
      <UFormGroup name="content">
        Содержимое
        <span class="required">*</span>
        <ClientOnly>
          <ContentEditor v-model="infoData.content" />
        </ClientOnly>
      </UFormGroup>
      <div class="home-info-form__btn-container">
        <MenuButton :size="'middle'" @click="emit('close')">Отмена</MenuButton>
        <MenuButton :size="'middle'" :button-type="'submit'" :is-active="true"
          >Сохранить</MenuButton
        >
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
.home-info-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  .home-info-form__title {
    font-size: 18px;
  }

  .home-info-form__btn-container {
    display: flex;
    gap: 10px;
  }
}
</style>
