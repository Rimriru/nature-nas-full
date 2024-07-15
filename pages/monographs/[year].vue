<script setup lang="ts">
const route = useRoute();
const { year: selectedYear } = route.params;

const monographsState = useMgraphsState();
// collect all monographs, display only with that year

const selectedYearMonographs = computed(() => {
  return monographsState.value.filter((graph) => graph.year === selectedYear);
});
</script>

<template>
  <ul class="monographs__container">
    <li v-for="graph of selectedYearMonographs" :key="graph._id">
      {{ graph.title }}
    </li>
  </ul>
</template>

<style lang="scss">
.monographs__container {
  flex-grow: 1;
}
</style>
