<script setup lang="ts">
import type { PersonaInstanceFromDb } from '~/types/PersonasDataFromDb';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  placement: string;
  personaOfInterest: PersonaInstanceFromDb | null;
}>();

const emit = defineEmits(['close']);

const personaData = reactive({
  position: '',
  name: '',
  phd: '',
  telNumber: '',
  faxNumber: '',
  email: '',
  description: '',
  photo: ''
});
const personaId = ref('');
const photoForUploading = ref<File | ''>('');
const submitError = ref('');

const personasState = usePersonasState();
const notifications = useToast();

let originalPersonaData = {
  position: '',
  name: '',
  phd: '',
  telNumber: '',
  faxNumber: '',
  email: '',
  description: '',
  photo: ''
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.isEditing && props.personaOfInterest) {
      const { _id, position, name, phd, telNumber, faxNumber, email, description, photo } =
        props.personaOfInterest;
      personaId.value = _id;
      personaData.position = position;
      personaData.name = name;
      personaData.phd = phd;
      personaData.telNumber = telNumber;
      personaData.faxNumber = faxNumber;
      personaData.email = email;
      personaData.description = description;
      personaData.photo = photo;

      originalPersonaData = {
        position,
        name,
        phd,
        telNumber,
        faxNumber,
        email,
        description,
        photo
      };
    } else if (!newValue) {
      personaId.value = '';
      personaData.position = '';
      personaData.name = '';
      personaData.phd = '';
      personaData.telNumber = '';
      personaData.faxNumber = '';
      personaData.email = '';
      personaData.description = '';
      personaData.photo = '';
      submitError.value = '';

      originalPersonaData = {
        position: '',
        name: '',
        phd: '',
        telNumber: '',
        faxNumber: '',
        email: '',
        description: '',
        photo: ''
      };
    }
  }
);

const onPhotoChange = (file: File | '') => {
  photoForUploading.value = file;
};

const handlePersonaFormSubmit = async () => {
  if (photoForUploading.value) {
    const body = new FormData();
    body.append('images', photoForUploading.value);

    await $fetch('/api/images', {
      method: 'post',
      body,
      async onResponse({ response }) {
        if (!response.ok) {
          notifications.add({
            id: 'images',
            title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
          });
          return;
        } else {
          const previousPhoto = personaData.photo;
          personaData.photo = response._data[0];

          if (props.isEditing && previousPhoto) {
            await $fetch(`/api/images/${previousPhoto}`, {
              method: 'delete',
              onResponse({ response }) {
                if (!response.ok) {
                  notifications.add({
                    id: 'images',
                    title: `Ошибка ${response._data.statusCode}: ${response._data.message}`
                  });
                  return;
                }
              }
            });
          }
        }
      }
    });
  }

  const newPersonasBody: { [key: string]: any } = {
    position: personaData.position,
    name: personaData.name,
    phd: personaData.phd,
    telNumber: personaData.telNumber,
    faxNumber: personaData.faxNumber,
    email: personaData.email,
    description: personaData.description,
    photo: personaData.photo
  };

  if (!props.isEditing) {
    newPersonasBody.placement = props.placement;
    console.log(newPersonasBody);
    try {
      const newPersona = await $fetch('/api/personas', {
        method: 'post',
        body: newPersonasBody
      });
      personasState.value = [...personasState.value, newPersona];
      emit('close');
      notifications.add({ id: 'personas', title: 'Новый контакт добавлен!' });
    } catch (error: any) {
      submitError.value = `${error.status}: ${error.data.message}`;
      console.error(error);
    }
  } else {
    if (JSON.stringify(originalPersonaData) === JSON.stringify(newPersonasBody)) {
      emit('close');
    } else {
      try {
        const editedPersona = await $fetch(`/api/personas/${personaId.value}`, {
          method: 'patch',
          body: newPersonasBody
        });
        const personaIndex = personasState.value.findIndex(
          (persona) => persona._id === personaId.value
        );
        personasState.value[personaIndex] = editedPersona;
        emit('close');
        notifications.add({ id: 'personas', title: 'Контакт был изменён' });
      } catch (error: any) {
        submitError.value = `${error.status}: ${error.data.message}`;
        console.error(error);
      }
    }
  }
};
</script>

<template>
  <AppPopup :is-opened="isOpen" @on-close="emit('close')">
    <UForm :state="personaData" @submit="handlePersonaFormSubmit">
      <PersonaInputFields
        v-model:persona-data="personaData"
        :photo="personaData.photo"
        @on-photo-change="onPhotoChange"
      />
      <span v-if="submitError" class="error">{{ submitError }}</span>
      <div class="flex gap-2 justify-center mt-4">
        <MenuButton :size="'middle'" @click="emit('close')">Отмена</MenuButton>
        <MenuButton :is-active="true" :size="'middle'" :button-type="'submit'">{{
          isEditing ? 'Сохранить' : 'Создать'
        }}</MenuButton>
      </div>
    </UForm>
  </AppPopup>
</template>

<style lang="scss"></style>
