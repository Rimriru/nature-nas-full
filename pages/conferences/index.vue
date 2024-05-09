<script setup lang="ts">
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

const title = 'Конференции';

useSeoMeta({
  title
});

definePageMeta({
  title: 'Конференции'
});

const conferenceState = useConfsState();

const isConfFormPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const confItemOfInterest = ref<ConfDataFromDb | ''>('');
const removeRequestError = ref('');
const notifications = useToast();

provide('confItem', confItemOfInterest);

const onEditBtnClick = (confItem: ConfDataFromDb) => {
  isConfFormPopupOpen.value = true;
  confItemOfInterest.value = confItem;
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
};

const onConfirmPopupSubmit = async () => {
  const confId = (confItemOfInterest.value as ConfDataFromDb)._id;
  try {
    await $fetch(`/api/confs/${confId}`, {
      method: 'delete'
    });

    conferenceState.value = conferenceState.value.filter((item) => item._id !== confId);

    notifications.add({
      id: 'news',
      title: 'Конференция удалена'
    });
    onConfirmPopupClose();
  } catch (error: any) {
    removeRequestError.value = `${error.statusCode}: ${error.data.message}`;
    console.error(error);
  }
};
</script>

<template>
  <main class="main">
    <ul class="confs">
      <li v-for="conf of conferenceState" :key="conf._id">
        <ConfCard :conf-item="conf" @edit-click="onEditBtnClick" @remove-click="onRemoveBtnClick" />
      </li>
    </ul>
    <ClientOnly>
      <LazyConfFormPopup :is-open="isConfFormPopupOpen" @close="onConfFormPopupClose" />
      <LazyConfirmPopup
        :is-open="isConfirmPopupOpen"
        :what-is-removed="'confItem'"
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
