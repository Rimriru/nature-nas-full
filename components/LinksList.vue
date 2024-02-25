<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/constants';
const links = useLinksState();

const props = defineProps(['isInAdminPage']);
</script>

<template>
  <div>
    <ul>
      <li v-for="group of HEADER_LINK_GROUPS" :key="group.id">
        <p>
          <div></div>
          {{ group.title }}
        </p>
        <ul>
          <LinksMenuItem :links-array="links" :group="(group.group)" :is-in-admin-page="props.isInAdminPage" />
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="scss"></style>
