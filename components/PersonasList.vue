<script setup lang="ts">
import type { PersonaInstanceFromDb } from '~/types/PersonasDataFromDb';

const loggedInState = useLoggedInState();
const personasState = usePersonasState();
const notifications = useToast();

const props = defineProps<{
  placement: string;
  personas: PersonaInstanceFromDb[];
}>();

const isPersonaFormPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const isEditing = ref(false);
const personaOfInterest = ref<PersonaInstanceFromDb | null>(null);
const submitRemoveError = ref('');

const onAddBtnClick = () => {
  isEditing.value = false;
  isPersonaFormPopupOpen.value = true;
};

const onPersonaFormPopupClose = () => {
  isPersonaFormPopupOpen.value = false;
  isEditing.value = false;
  personaOfInterest.value = null;
};

const onEditPersonaCardBtnClick = (persona: PersonaInstanceFromDb) => {
  isEditing.value = true;
  personaOfInterest.value = persona;
  isPersonaFormPopupOpen.value = true;
};

const onRemovePersonaCardBtnClick = (persona: PersonaInstanceFromDb) => {
  personaOfInterest.value = persona;
  isConfirmPopupOpen.value = true;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  personaOfInterest.value = null;
};

const onPersonaRemove = async () => {
  if (personaOfInterest.value) {
    if (personaOfInterest.value.photo) {
      await $fetch(`/api/images/${personaOfInterest.value.photo}`, {
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
    const id = personaOfInterest.value._id;
    try {
      const { message } = await $fetch(`/api/personas/${id}`, {
        method: 'delete'
      });
      personasState.value = personasState.value.filter((persona) => persona._id !== id);
      onConfirmPopupClose();
      notifications.add({ id: 'personas', title: message });
    } catch (error: any) {
      submitRemoveError.value = `${error.status}: ${error.data.message}`;
      console.error(error);
    }
  }
};
</script>

<template>
  <div class="personas">
    <ul class="personas-list">
      <li class="personas-list__item" v-for="persona of personas" :key="persona._id">
        <PersonaCard
          :persona-data="persona"
          :is-alone="true"
          @edit-click="onEditPersonaCardBtnClick"
          @remove-click="onRemovePersonaCardBtnClick"
        />
      </li>
    </ul>
    <MenuButton v-if="loggedInState" :size="'middle'" class="personas__btn" @click="onAddBtnClick"
      >Добавить контакт</MenuButton
    >
    <ClientOnly>
      <LazyPersonaFormPopup
        :is-open="isPersonaFormPopupOpen"
        :is-editing="isEditing"
        :placement="placement"
        :persona-of-interest="personaOfInterest"
        @close="onPersonaFormPopupClose"
      />
      <LazyConfirmPopup
        :is-open="isConfirmPopupOpen"
        :what-is-removed="'persona'"
        :error="submitRemoveError"
        @on-close="onConfirmPopupClose"
        @on-agree="onPersonaRemove"
      />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
.personas {
  display: flex;
  flex-direction: column;
  gap: 40px;

  .personas-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;

    .personas-list__item {
      &:nth-child(2n) {
        .persona-card {
          .persona-card__main-block_alone {
            flex-direction: row-reverse;
          }
        }
      }
    }
  }
  .personas__btn {
    margin: 0 auto;
  }
}
</style>
