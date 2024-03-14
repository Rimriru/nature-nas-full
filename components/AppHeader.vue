<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/linksData';
import homeIcon from '~/assets/images/home-icon.svg';
import mapIcon from '~/assets/images/map-icon.svg';
import type { Link, Group } from '~/types/LinkDataFromDb';
import type { Form } from '#ui/types';

const linkValue = reactive({
  title: '',
  to: ''
});
const groupingLink = reactive({
  title: '',
  group: ''
});
const linkForm: Ref<Form<string> | null> = ref(null);
const linksState = useLinksState();
const isAddLinkPopupOpened = ref(false);
const addLinkError = ref('');
const notifications = useToast();

const onLinkFormMount = (form: Form<string>) => {
  linkForm.value = form;
};

const onAddLinkButtonClick = (mainLinkTitle: string, mainLinkGroup: string) => {
  isAddLinkPopupOpened.value = true;
  groupingLink.title = mainLinkTitle;
  groupingLink.group = mainLinkGroup;
};

const resetFormFields = () => {
  linkValue.title = '';
  linkValue.to = '';

  if (linkForm?.value) return linkForm.value.clear();
};

const onCloseLinkForm = () => {
  resetFormFields();
  isAddLinkPopupOpened.value = false;
  addLinkError.value = '';
  groupingLink.title = '';
  groupingLink.group = '';
};

const onAddLinkFormSubmit = async () => {
  const newLinkBody: Link = {
    title: linkValue.title,
    to: linkValue.to,
    group: groupingLink.group as Group
  };
  const { data, error } = await useFetch('/api/links', {
    method: 'post',
    body: newLinkBody
  });
  if (data.value) {
    linksState.value.push(data.value as unknown as Link);
    notifications.add({ id: 'link-create', title: `Ссылка ${newLinkBody.title} создана!` });
    onCloseLinkForm();
  } else {
    addLinkError.value = error.value?.data.message;
  }
};
</script>

<template>
  <header class="header">
    <div class="header__top-bg">
      <nav class="header__top">
        <span class="header__name">Институт природопользования НАН Беларуси</span>
        <NuxtLink to="/" external>
          <Icon :icon="homeIcon" />
        </NuxtLink>
        <NuxtLink to="/site-map">
          <Icon :icon="mapIcon" />
        </NuxtLink>
      </nav>
    </div>
    <div class="header__bottom-bg">
      <nav class="header__bottom">
        <ul class="header__bottom-links">
          <NuxtLink to="/" class="header__bottom-logo">
            <NuxtImg src="/logo.png" alt="Логотип" width="60" />
          </NuxtLink>
          <li v-for="{ id, title, group, to } of HEADER_LINK_GROUPS" :key="id">
            <DropdownMenu
              :title="title.toUpperCase()"
              :group="group"
              :items="linksState"
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
      @on-mount="onLinkFormMount"
    />
  </header>
</template>

<style lang="scss">
@import '~/assets/styles/components/appHeader.scss';
</style>
