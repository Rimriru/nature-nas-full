<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/constants';

const links = useLinksState();

const props = defineProps(['isInAdminPage']);
</script>

<template>
  <ul class="links-list">
    <li v-for="group of HEADER_LINK_GROUPS" :key="group.id">
      <p class="links-list__title">
        <Icon :icon="group.icon" />
        <span>
          {{ group.title }}
        </span>
      </p>
      <ul class="links-list__links">
        <LinksMenuItem
          :links-array="links"
          :group="group.group"
          :is-in-admin-page="props.isInAdminPage"
        />
      </ul>
    </li>
  </ul>
</template>

<style lang="scss">
.links-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 15vw;
}
.links-list__title {
  font-size: 20px;
  display: flex;
  align-items: center;

  span {
    font-weight: 600;
  }
}

.links-list__links {
  padding-left: 60px;
  list-style: disc;
}
</style>
