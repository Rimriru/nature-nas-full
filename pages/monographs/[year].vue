<script setup lang="ts">
import type { IMonographFromDb } from '~/types/MgraphsDataFromDb';
const route = useRoute();
const { year: selectedYear } = route.params as { year: string };

const monographsState = useMgraphsState();
// collect all monographs, display only with that year

const selectedYearMonographs = computed(() => {
  return monographsState.value.filter((graph) => graph.year === selectedYear);
});

let monoValues = {
  _id: '',
  title: '',
  description: '',
  cover: ''
};

const isMgraphPopupOpen = ref(false);
const isMonoGonnaEdit = ref(false);

const isLoggedIn = useLoggedInState();

const onOpenMonographForm = () => {
  isMgraphPopupOpen.value = true;
};

const onEditMonographBtnClick = (monograph: IMonographFromDb) => {
  onOpenMonographForm();
  monoValues = monograph;
  isMonoGonnaEdit.value = true;
};

const handleMonographFormClose = () => {
  isMonoGonnaEdit.value = false;
  isMgraphPopupOpen.value = false;
  monoValues = {
    _id: '',
    title: '',
    description: '',
    cover: ''
  };
};
</script>

<template>
  <div class="monographs__container">
    <ul class="monographs__items shadow-border">
      <li v-for="graph of selectedYearMonographs" :key="graph._id" class="monographs__item">
        <MgraphCard :item="graph" />
      </li>
    </ul>
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

    .monographs__item {
      &:not(:last-child) {
        border-bottom: rgba(122, 119, 119, 0.4) 1px solid;
        padding-bottom: 50px;
      }
    }
  }

  .monographs__add-btn {
    display: block;
    margin: 25px auto;
  }
}
</style>
