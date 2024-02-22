<script setup lang="ts">
const isSubMenuVisible = ref(false);
const props = defineProps(['title', 'items']);
</script>

<template>
  <div class="dropdown-menu">
    <a
      class="dropdown-menu__main-link"
      href="#"
      @mouseover="isSubMenuVisible = true"
      @mouseleave="isSubMenuVisible = false"
      >{{ title }}</a
    >
    <div v-if="isSubMenuVisible" class="dropdown-menu__sub-menu">
      <ul>
        <li v-for="item of props.items" :key="item.id">
          <NuxtLink :to="item.to">
            {{ item.title }}
          </NuxtLink>
        </li>
        <div class="dropdown-menu__btn-bg">
          <button class="dropdown-menu__add-btn" type="button" />
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.dropdown-menu {
  position: relative;

  .dropdown-menu__main-link {
    font-size: 15px;
    font-weight: 600;
    position: relative;
    text-align: center;
    display: flex;
    padding: 20px;

    &:hover {
      background-color: $light-blue;
    }
  }

  .dropdown-menu__sub-menu {
    position: absolute;
    bottom: -45px;
    background-color: gray;
    width: 100%;
    border-radius: 8px;

    .dropdown-menu__btn-bg {
      background-color: $dark-blue;
      border-radius: 8px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .dropdown-menu__add-btn {
        background-image: url('~/assets/images/plus-icon.svg');
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
