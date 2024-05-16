<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/linksData';
import homeIcon from '~/assets/images/home-icon.svg';
import mapIcon from '~/assets/images/map-icon.svg';
import type { LinkGroup } from '~/types/LinkDataFromDb';

const linkValue = reactive({
  title: '',
  to: ''
});
const groupingLink = reactive({
  title: '',
  groupId: ''
});
const linkGroupsState = useLinkGroupsState();
const loggedInState = useLoggedInState();
const isAddLinkPopupOpened = ref(false);
const addLinkError = ref('');
const notifications = useToast();
const { width } = useWindowSize();

const onSignOutBtnClick = async () => {
  try {
    const { message } = await $fetch('/api/users');
    loggedInState.value = false;
    notifications.add({ id: 'sign-out', title: message });
  } catch (error) {
    console.error(error);
  }
};

const onAddLinkButtonClick = (linkTitle: string, linkGroupId: string) => {
  isAddLinkPopupOpened.value = true;
  groupingLink.title = linkTitle;
  groupingLink.groupId = linkGroupId;
};

const resetFormFields = () => {
  linkValue.title = '';
  linkValue.to = '';
};

const onCloseLinkForm = () => {
  resetFormFields();
  isAddLinkPopupOpened.value = false;
  addLinkError.value = '';
  groupingLink.title = '';
  groupingLink.groupId = '';
};

const onAddLinkFormSubmit = async () => {
  const newLinkBody = {
    title: linkValue.title,
    to: linkValue.to,
    groupId: groupingLink.groupId
  };

  try {
    const { updatedGroup, newLinkTyped } = await $fetch('/api/links', {
      method: 'post',
      body: newLinkBody
    });
    if (updatedGroup) {
      const index = linkGroupsState.value.findIndex(
        (group: LinkGroup) => group._id === updatedGroup?._id
      );
      linkGroupsState.value[index] = updatedGroup;
    }
    notifications.add({ id: 'link-create', title: `Ссылка "${newLinkBody.title}" создана!` });
    onCloseLinkForm();
  } catch (err: any) {
    addLinkError.value = err.data.message;
  }
};
</script>

<template>
  <header class="header">
    <div class="header__top-bg">
      <nav class="header__top">
        <span class="header__name">Институт природопользования НАН Беларуси</span>
        <NuxtLink to="/" aria-label="Home">
          <Icon :icon="homeIcon" />
        </NuxtLink>
        <NuxtLink to="/site-map" aria-label="Site-map">
          <Icon :icon="mapIcon" />
        </NuxtLink>
      </nav>
      <div v-if="loggedInState" class="header__container">
        <NuxtLink to="/admin">Админ-панель</NuxtLink>
        <button v-if="loggedInState" class="sign-out-btn" type="button" @click="onSignOutBtnClick">
          Выйти
        </button>
      </div>
    </div>
    <div class="header__bottom-bg">
      <nav class="header__bottom">
        <ul class="header__bottom-links">
          <BurgerButton v-if="width <= 900" />
          <NuxtLink to="/" class="header__bottom-logo" aria-label="Link">
            <img src="/logo-white.png" alt="Логотип" width="62" height="53" />
          </NuxtLink>
          <li v-for="{ _id: id, title, group, to } of HEADER_LINK_GROUPS" :key="id">
            <DropdownMenu
              :title="title.toUpperCase()"
              :group="group"
              :link-groups="linkGroupsState"
              :to="to"
              @on-add-link="onAddLinkButtonClick"
            />
          </li>
        </ul>
      </nav>
    </div>
    <LazyLinkForm
      :link-value="linkValue"
      :is-opened="isAddLinkPopupOpened"
      :grouping-link-title="groupingLink.title"
      :error="addLinkError"
      :place="'header'"
      @on-close="onCloseLinkForm"
      @on-submit="onAddLinkFormSubmit"
    />
  </header>
</template>

<style lang="scss">
@import '~/assets/styles/components/appHeader.scss';
</style>
