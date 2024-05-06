<script setup lang="ts">
const title = 'Конференции';

useSeoMeta({
  title
});

definePageMeta({
  title: 'Конференции'
});

const conferencesFromDb = await useConfs();
const conferenceState = useConfsState();

conferenceState.value = conferencesFromDb;
</script>

<template>
  <main class="main">
    <ConfCard :conf-item="conferenceState[0]" />
  </main>
</template>

<style lang="scss"></style>
