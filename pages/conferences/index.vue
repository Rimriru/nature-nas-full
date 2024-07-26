<script setup lang="ts">
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

const title = 'Конференции';

useSeoMeta({
  title,
  description: 'Конференции Института природопользования НАН Беларуси'
});

definePageMeta({
  title: 'Конференции'
});

const conferencesState = useConfsState();

const reversedConferences = computed(() => {
  return conferencesState.value ? conferencesState.value.slice().reverse() : conferencesState.value;
});

const isConfFormPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const confItemOfInterest = ref<ConfDataFromDb | ''>('');
const removeRequestError = ref('');
const isConfRemoveRequestPending = ref(false);
const notifications = useToast();

provide('confItem', confItemOfInterest);

const onEditBtnClick = (confItem: ConfDataFromDb) => {
  confItemOfInterest.value = confItem;
  isConfFormPopupOpen.value = true;
};

const resetConfItemOfInterest = () => {
  confItemOfInterest.value = '';
};

const onConfFormPopupClose = () => {
  isConfFormPopupOpen.value = false;
  resetConfItemOfInterest();
};

const onRemoveBtnClick = (confItem: ConfDataFromDb) => {
  isConfirmPopupOpen.value = true;
  confItemOfInterest.value = confItem;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  resetConfItemOfInterest();
  isConfRemoveRequestPending.value = false;
  removeRequestError.value = '';
};

const onConfirmPopupSubmit = async () => {
  isConfRemoveRequestPending.value = true;
  const confId = (confItemOfInterest.value as ConfDataFromDb)._id;
  try {
    await $fetch(`/api/confs/${confId}`, {
      method: 'delete'
    });

    conferencesState.value = conferencesState.value.filter((item) => item._id !== confId);

    notifications.add({
      id: 'news',
      title: 'Конференция удалена'
    });
    onConfirmPopupClose();
  } catch (error: any) {
    isConfRemoveRequestPending.value = false;
    removeRequestError.value = `${error.statusCode}: ${error.data.message}`;
    console.error(error);
  }
};
</script>

<template>
  <main class="main">
    <ul class="confs">
      <li v-for="conf of reversedConferences" :key="conf._id">
        <ConfCard :conf-item="conf" @edit-click="onEditBtnClick" @remove-click="onRemoveBtnClick" />
      </li>
    </ul>
    <ClientOnly>
      <LazyConfFormPopup :is-open="isConfFormPopupOpen" @close="onConfFormPopupClose" />
      <LazyConfirmPopup
        :is-open="isConfirmPopupOpen"
        :what-is-removed="'confItem'"
        :is-request-pending="isConfRemoveRequestPending"
        :error="removeRequestError"
        @on-close="onConfirmPopupClose"
        @on-agree="onConfirmPopupSubmit"
      />
    </ClientOnly>
  </main>
</template>

<style lang="scss">
.confs {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
}
</style>
