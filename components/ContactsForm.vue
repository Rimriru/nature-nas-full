<script setup lang="ts">
import type { Form, FormError } from '#ui/types';

const props = defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(['close']);

const contactsFormState = reactive({
  _id: '',
  address: '',
  telNumber: '',
  faxNumber: '',
  email: '',
  content: ''
});
const form = ref<Form<string> | null>(null);
const contactsState = useContactsState();
const notifications = useToast();

let originalContactsData = {
  address: '',
  telNumber: '',
  faxNumber: '',
  email: '',
  content: ''
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && contactsState.value) {
      contactsFormState._id = contactsState.value._id;
      contactsFormState.address = contactsState.value.address;
      contactsFormState.telNumber = contactsState.value.telNumber;
      contactsFormState.faxNumber = contactsState.value.faxNumber;
      contactsFormState.email = contactsState.value.email;
      contactsFormState.content = contactsState.value.content;

      originalContactsData.address = contactsState.value.address;
      originalContactsData.telNumber = contactsState.value.telNumber;
      originalContactsData.faxNumber = contactsState.value.faxNumber;
      originalContactsData.email = contactsState.value.email;
      originalContactsData.content = contactsState.value.content;
    } else {
      contactsFormState._id = '';
      contactsFormState.address = '';
      contactsFormState.telNumber = '';
      contactsFormState.faxNumber = '';
      contactsFormState.email = '';
      contactsFormState.content = '';
      form.value?.clear();
      originalContactsData = {
        address: '',
        telNumber: '',
        faxNumber: '',
        email: '',
        content: ''
      };
    }
  }
);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.address)
    errors.push({ path: 'address', message: 'Поле "Адрес" является обязательным' });
  if (!state.telNumber)
    errors.push({ path: 'tel', message: 'Поле "Номер телефона" является обязательным' });
  if (!state.faxNumber)
    errors.push({ path: 'fax', message: 'Поле "Номер факса" является обязательным' });
  if (!state.email) errors.push({ path: 'email', message: 'Поле "Email" является обязательным' });
  return errors;
};

const handleContactsFormSubmit = async () => {
  const initialContactsData = JSON.stringify(originalContactsData);
  const { address, telNumber, faxNumber, email, content } = contactsFormState;
  const contactsBody = { address, telNumber, faxNumber, email, content };
  const contactsId = contactsFormState._id;

  if (initialContactsData === JSON.stringify(contactsBody)) {
    emit('close');
  } else {
    try {
      const editedContactsData = await $fetch(`/api/contacts/${contactsId}`, {
        method: 'patch',
        body: contactsBody
      });
      contactsState.value = editedContactsData;
      emit('close');
      notifications.add({ id: 'contacts', title: 'Контактные данные были изменены' });
    } catch (error: any) {
      notifications.add({
        id: 'contacts',
        title: error.statusCode,
        description: error.data.message
      });
      console.error(error);
    }
  }
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('close')">
    <UForm
      :state="contactsFormState"
      :validate="validate"
      ref="form"
      class="contacts-form"
      @submit="handleContactsFormSubmit"
    >
      <h4 class="contacts-form__title">Редактировать контактные данные</h4>
      <UFormGroup name="address">
        Адрес
        <span class="required">*</span>
        <UInput v-model="contactsFormState.address" placeholder="Введите адрес..." />
      </UFormGroup>
      <UFormGroup name="tel">
        Номер телефона
        <span class="required">*</span>
        <UInput v-model="contactsFormState.telNumber" placeholder="Введите номер телефона..." />
      </UFormGroup>
      <UFormGroup name="fax">
        Номер факса
        <span class="required">*</span>
        <UInput v-model="contactsFormState.faxNumber" placeholder="Введите номер факса..." />
      </UFormGroup>
      <UFormGroup name="email">
        Email
        <span class="required">*</span>
        <UInput
          v-model="contactsFormState.email"
          placeholder="Введите адрес электронной почты..."
        />
      </UFormGroup>
      <ClientOnly>
        <ContentEditor v-model="contactsFormState.content" />
      </ClientOnly>
      <div class="contacts-form__btn-container">
        <MenuButton :size="'small'" @click="emit('close')">Отмена</MenuButton>
        <MenuButton :size="'small'" :button-type="'submit'" :is-active="true">Сохранить</MenuButton>
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss">
.contacts-form {
  display: grid;
  row-gap: 15px;
  max-width: 900px;
  width: 100%;

  .contacts-form__title {
    font-size: 18px;
  }

  .contacts-form__btn-container {
    display: flex;
    gap: 20px;
    margin: 0 auto;
  }
}
</style>
