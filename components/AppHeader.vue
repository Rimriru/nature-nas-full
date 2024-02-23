<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/constants';

const isAddLinkPopupOpened = ref(false);
const groupingLink = reactive({
  title: '',
  group: ''
});

const links = reactive([
  {
    title: 'Учёный совет',
    group: 'about',
    to: '/look'
  },
  {
    title: 'Администрация',
    group: 'structure',
    to: '/something'
  }
]);

const onAddLinkButtonClick = (mainLinkTitle: string, mainLinkGroup: string) => {
  isAddLinkPopupOpened.value = true;
  groupingLink.title = mainLinkTitle;
  groupingLink.group = mainLinkGroup;
};

const onCloseBtnClick = () => {
  isAddLinkPopupOpened.value = false;
  groupingLink.title = '';
  groupingLink.group = '';
};

const onAddLinkFormSubmit = (title: string, path: string) => {
  links.push({ title, group: groupingLink.group, to: `/${path}` });
  console.log(links);
};
</script>

<template>
  <header class="header">
    <div class="header__top-bg">
      <nav class="header__top">
        <span class="header__name">Институт природопользования НАН Беларуси</span>
        <NuxtLink to="/">
          <div class="header__icon header__icon_home"></div>
        </NuxtLink>
        <NuxtLink to="/site-map">
          <div class="header__icon header__icon_map"></div>
        </NuxtLink>
      </nav>
    </div>
    <div class="header__bottom-bg">
      <nav class="header__bottom">
        <ul class="header__bottom-links">
          <NuxtLink to="/" class="header__bottom-logo">
            <NuxtImg src="/logo.png" alt="Логотип" width="60" />
          </NuxtLink>
          <li v-for="{ id, title, group } of HEADER_LINK_GROUPS" :key="id">
            <DropdownMenu
              :title="title"
              :group="group"
              :items="links"
              @on-add-link="onAddLinkButtonClick"
            />
          </li>
        </ul>
      </nav>
    </div>
    <LinkForm
      :is-opened="isAddLinkPopupOpened"
      :grouping-link-title="groupingLink.title"
      @on-close="onCloseBtnClick"
      @on-submit="onAddLinkFormSubmit"
    />
  </header>
</template>

<style lang="scss">
@use '~/assets/styles/variables.scss' as *;

.header {
  color: #fff;

  .header__top-bg {
    background-color: $dark-blue;
  }
  .header__top {
    margin-left: 15%;
    padding: 5px;
    display: flex;
    gap: 14px;

    .header__name {
      font-weight: 500;
    }

    .header__icon {
      width: 24px;
      height: 24px;
      background-size: 100%;

      &.header__icon_home {
        background-image: url('~/assets/images/home-icon.svg');
      }

      &.header__icon_map {
        background-image: url('~/assets/images/map-icon.svg');
      }
    }
  }

  .header__bottom-bg {
    background-color: $mid-blue;

    .header__bottom {
      padding-inline: 5px;

      .header__bottom-logo {
        width: 72px;
      }

      .header__bottom-links {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
      }
    }
  }
}
</style>
