<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/linksData';
import type { Link } from '~/types/LinkDataFromDb';

const linkData = reactive({
  title: '',
  to: '',
  groupId: ''
});
const linkDataBeforeEdit = reactive({
  title: '',
  to: ''
});
const removedOrEditedLinkData = reactive({
  id: '',
  title: '',
  groupId: ''
});
const isEditLinkPopupOpened = ref(false);
const isConfirmPopupOpened = ref(false);
const editLinkError = ref('');
const removeLinkError = ref('');
const isLinkRequestPending = ref(false);

const linkGroups = useLinkGroupsState();
const notifications = useToast();

const props = defineProps(['isInAdminPage']);

const onEditLinkClick = (id: string, title: string, to: string, groupId: string) => {
  linkData.title = title;
  linkData.to = to;
  linkData.groupId = groupId;
  linkDataBeforeEdit.title = title;
  linkDataBeforeEdit.to = to;
  removedOrEditedLinkData.id = id;
  isEditLinkPopupOpened.value = true;
};

const onRemoveLinkClick = (id: string, linkTitle: string, groupId: string) => {
  isLinkRequestPending.value = false;
  removedOrEditedLinkData.id = id;
  removedOrEditedLinkData.groupId = groupId;
  removedOrEditedLinkData.title = linkTitle;
  isConfirmPopupOpened.value = true;
};

provide('linkActions', { onEditLinkClick, onRemoveLinkClick });

const labsAndCentersLinks = computed(() => {
  return linkGroups.value.filter((group) => group.group === 'labs-and-centers');
});

provide('labsAndCentersGroups', labsAndCentersLinks.value);

const resetFormFields = () => {
  linkData.title = '';
  linkData.to = '';
};

const onCloseLinkForm = () => {
  isEditLinkPopupOpened.value = false;
  resetFormFields();
  linkData.groupId = '';
  editLinkError.value = '';
  removedOrEditedLinkData.id = '';
  isLinkRequestPending.value = false;
};

const onCloseConfirmPopup = () => {
  isConfirmPopupOpened.value = false;
  removedOrEditedLinkData.title = '';
  removedOrEditedLinkData.id = '';
  removedOrEditedLinkData.groupId = '';
  isLinkRequestPending.value = false;
};

const onEditLinkFormSubmit = async () => {
  isLinkRequestPending.value = true;
  if (linkData.title === linkDataBeforeEdit.title && linkData.to === linkDataBeforeEdit.to) {
    onCloseLinkForm();
  } else {
    try {
      const editedLinkData = await $fetch(`/api/links/${removedOrEditedLinkData.id}`, {
        method: 'patch',
        body: linkData
      });

      // поиск самой группы в массиве групп, затем поиск ссылки, что была изменена в запросе. Затем в первичном массиве (что хранится в глобальной переменной) мы находим группу, в ней необходимую ссылку и уже её заменяем на полученную в запросе

      const editedLinkGroupIndex = linkGroups.value.findIndex(
        (group) => group._id === linkData.groupId
      );
      if (editedLinkGroupIndex !== -1) {
        const editedLinkIndex = linkGroups.value[editedLinkGroupIndex].links.findIndex(
          (link) => link._id === editedLinkData?._id
        );
        linkGroups.value[editedLinkGroupIndex].links[editedLinkIndex] = editedLinkData as Link;
      }

      notifications.add({ id: 'link', title: `Ссылка "${linkData.title}" была изменена` });
      onCloseLinkForm();
    } catch (error: any) {
      isLinkRequestPending.value = false;
      editLinkError.value = error?.data.message;
    }
  }
};

const onRemoveLinkPopupAgree = async () => {
  isLinkRequestPending.value = true;
  try {
    const { message } = await $fetch(`/api/links/${removedOrEditedLinkData.id}`, {
      method: 'delete',
      query: {
        groupId: removedOrEditedLinkData.groupId
      }
    });

    // поиск группы в глобальном стейте, а затем фильтруем её ссылки

    const removedLinkGroupIndex = linkGroups.value.findIndex(
      (group) => group._id === removedOrEditedLinkData.groupId
    );
    if (removedLinkGroupIndex !== -1) {
      linkGroups.value[removedLinkGroupIndex].links = linkGroups.value[
        removedLinkGroupIndex
      ].links.filter((link) => link._id !== removedOrEditedLinkData.id);
    }
    onCloseConfirmPopup();
    notifications.add({ id: 'link', title: message });
  } catch (error: any) {
    isLinkRequestPending.value = false;
    removeLinkError.value = error.data.message;
  }
};
</script>

<template>
  <div>
    <ul class="links-list">
      <li v-for="group of HEADER_LINK_GROUPS" :key="group._id" class="links-list__item">
        <p v-if="!group.to" class="links-list__title">
          <UIcon :name="group.icon" class="icon" />
          <span>
            {{ group.title }}
          </span>
        </p>
        <NuxtLink v-else :href="group.to" class="links-list__title" :aria-label="group.title">
          <UIcon :name="group.icon" class="icon" />
          <span>
            {{ group.title }}
          </span>
        </NuxtLink>
        <ul class="links-list__links">
          <LinksListFilter :group="group.group" :is-admin-page="props.isInAdminPage" />
        </ul>
      </li>
    </ul>
    <LazyLinkForm
      v-if="props.isInAdminPage"
      :link-value="linkData"
      :is-opened="isEditLinkPopupOpened"
      :place="'link-list'"
      :is-editing="true"
      :is-request-pending="isLinkRequestPending"
      :error="editLinkError"
      @on-close="onCloseLinkForm"
      @on-submit="onEditLinkFormSubmit"
    />
    <LazyConfirmPopup
      v-if="props.isInAdminPage"
      :is-open="isConfirmPopupOpened"
      :what-is-removed="'link'"
      :removed-item-title="removedOrEditedLinkData.title"
      :is-request-pending="isLinkRequestPending"
      :error="removeLinkError"
      @on-close="onCloseConfirmPopup"
      @on-agree="onRemoveLinkPopupAgree"
    />
  </div>
</template>

<style scoped lang="scss">
.links-list {
  display: grid;
  gap: 15px;
  grid-template-columns: auto minmax(50%, 600px);
  grid-template-areas:
    '1 column'
    '2 column'
    '3 column'
    '4 column'
    '5 column'
    '6 column'
    '7 column';

  .links-list__item {
    &:nth-of-type(1) {
      grid-area: 1;
    }
    &:nth-of-type(2) {
      grid-area: column;
    }
    &:nth-of-type(3) {
      grid-area: 2;
    }
    &:nth-of-type(4) {
      grid-area: 3;
    }
    &:nth-of-type(5) {
      grid-area: 4;
    }
    &:nth-of-type(6) {
      grid-area: 5;
    }
    &:nth-of-type(7) {
      grid-area: 6;
    }
    &:nth-of-type(8) {
      grid-area: 7;
    }

    .links-list__title {
      font-size: clamp(16px, 2vw, 20px);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;

      span {
        font-weight: 600;
      }
    }

    .links-list__links {
      padding-left: 60px;
      list-style: disc;
      display: flex;
      gap: 10px;
      flex-direction: column;
    }
  }
}

@media screen and (max-width: 600px) {
  .links-list {
    display: block;

    .links-list__item {
      margin-bottom: 15px;
    }
  }
}
</style>
