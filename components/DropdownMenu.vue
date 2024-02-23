<script setup lang="ts">
const isSubMenuVisible = ref(false);
const props = defineProps(['title', 'group', 'items']);
const emit = defineEmits(['onAddLink']);

const linksOfTheGroup = computed(() => {
  return props.items.filter((item) => item.group === props.group);
});
</script>

<template>
  <div
    class="dropdown-menu"
    @mouseover="isSubMenuVisible = true"
    @mouseleave="isSubMenuVisible = false"
  >
    <a class="dropdown-menu__main-link" href="#">{{ title }}</a>
    <ul v-if="isSubMenuVisible && group" class="dropdown-menu__sub-menu">
      <li v-for="item of linksOfTheGroup" :key="JSON.stringify(item)">
        <NuxtLink :to="item.to" v-if="item.group === props.group">
          {{ item.title }}
        </NuxtLink>
      </li>
      <div class="dropdown-menu__btn-bg" @click="emit('onAddLink', title, props.group)">
        <button class="dropdown-menu__add-btn" type="button" />
      </div>
    </ul>
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
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    &:hover {
      background-color: $light-blue;
    }
  }

  .dropdown-menu__sub-menu {
    position: absolute;
    top: 64px;
    background-color: #587495;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    width: clamp(100%, 10vw, 150%);
    display: flex;
    flex-direction: column;

    li {
      padding: 8px;
      &:hover {
        background-color: #7195bf;
      }
    }

    .dropdown-menu__btn-bg {
      background-color: $dark-blue;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: opacity 0.3s ease-in-out;

      &:hover {
        opacity: 0.7;
      }

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
