<script setup lang="ts">
import type { IMonographFromDb } from '~/types/MgraphsDataFromDb';
const route = useRoute();
const { year: selectedYear } = route.params as { year: string };

const monographsState = useMgraphsState();
// collect all monographs, display only with that year

const selectedYearMonographs = computed(() => {
  return monographsState.value.filter((graph) => graph.year === selectedYear).reverse();
});

let monoValues = {
  _id: '',
  title: '',
  description: '',
  cover: ''
};

const isMgraphPopupOpen = ref(false);
const isMonoGonnaEdit = ref(false);
const isConfirmPopupOpen = ref(false);
const removalSubmitError = ref('');
const page = ref(1);
const pageCount = ref(3);

const isLoggedIn = useLoggedInState();
const notifications = useToast();

const onOpenMonographForm = () => {
  isMgraphPopupOpen.value = true;
};

const resetMonoValues = () => {
  monoValues = {
    _id: '',
    title: '',
    description: '',
    cover: ''
  };
};

const onEditMonographBtnClick = (monograph: IMonographFromDb) => {
  isMonoGonnaEdit.value = true;
  const { _id, title, cover, description } = monograph;
  monoValues = { _id, title, cover, description };
  onOpenMonographForm();
};

const handleMonographFormClose = () => {
  isMonoGonnaEdit.value = false;
  isMgraphPopupOpen.value = false;
  resetMonoValues();
};

const onRemoveMonographBtnClick = (monograph: IMonographFromDb) => {
  monoValues._id = monograph._id;
  monoValues.title = monograph.title;
  isConfirmPopupOpen.value = true;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  resetMonoValues();
  removalSubmitError.value = '';
};

const handleMonographRemoval = async () => {
  const monoId = monoValues._id;
  try {
    const { message } = await $fetch(`/api/mgraphs/${monoId}`, {
      method: 'delete'
    });
    if (message) {
      monographsState.value = monographsState.value.filter((mono) => mono._id !== monoId);
    }
    notifications.add({ id: 'mgraphs', title: message });
    onConfirmPopupClose();
  } catch (error: any) {
    console.error(error);
    removalSubmitError.value = `${error.status}: ${error.data.message}`;
  }
};
</script>

<template>
  <div class="monographs__container">
    <ul class="monographs__items shadow-border">
      <li v-for="graph of selectedYearMonographs" :key="graph._id" class="monographs__item">
        <MgraphCard
          :item="graph"
          @on-edit-click="onEditMonographBtnClick"
          @on-remove-click="onRemoveMonographBtnClick"
        />
      </li>
    </ul>
    <ClientOnly>
      <MenuButton
        v-if="isLoggedIn"
        :size="'middle'"
        class="monographs__add-btn"
        @click="onOpenMonographForm"
        >Создать монографию</MenuButton
      >
      <LazyMgraphFormPopup
        v-if="isLoggedIn"
        :is-open="isMgraphPopupOpen"
        :is-editing="isMonoGonnaEdit"
        :monograph-values="monoValues"
        :year="selectedYear"
        @on-close="handleMonographFormClose"
      />
      <LazyConfirmPopup
        v-if="isLoggedIn"
        :is-open="isConfirmPopupOpen"
        :what-is-removed="'monograph'"
        :removed-item-title="monoValues.title"
        :error="removalSubmitError"
        @on-close="onConfirmPopupClose"
        @on-agree="handleMonographRemoval"
      />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
.monographs__container {
  flex-grow: 1;

  .monographs__items {
    display: flex;
    flex-direction: column;
    row-gap: 50px;
    padding: 40px;
    margin: 0 auto;

    .monographs__item {
      &:not(:last-child) {
        border-bottom: rgba(122, 119, 119, 0.4) 1px solid;
        padding-bottom: 50px;
      }
    }
  }

  .monographs__add-btn {
    display: block;
    margin: 25px auto 0;
  }

  .pagination {
    margin-top: 25px;
    justify-content: center;
  }
}

@media screen and (max-width: 900px) {
  .monographs__container {
    width: calc(100% - 20px * 2);
  }
}
</style>
