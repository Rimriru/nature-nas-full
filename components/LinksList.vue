<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/linksData';
import type { Link } from '~/types/LinkDataFromDb';
import type { Form } from '#ui/types';

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
  removedOrEditedLinkData.id = id;
  removedOrEditedLinkData.groupId = groupId;
  removedOrEditedLinkData.title = linkTitle;
  isConfirmPopupOpened.value = true;
};

provide('linkActions', { onEditLinkClick, onRemoveLinkClick });

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
};

const onCloseConfirmPopup = () => {
  isConfirmPopupOpened.value = false;
  removedOrEditedLinkData.title = '';
  removedOrEditedLinkData.id = '';
  removedOrEditedLinkData.groupId = '';
};

const onEditLinkFormSubmit = async () => {
  if (linkData.title === linkDataBeforeEdit.title && linkData.to === linkDataBeforeEdit.to) {
    onCloseLinkForm();
  } else {
    try {
      const { editedLinkData, message } = await $fetch(`/api/links/${removedOrEditedLinkData.id}`, {
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

      onCloseLinkForm();
      notifications.add({ id: 'link-edited', title: message });
    } catch (error: any) {
      editLinkError.value = error?.data.message;
    }
  }
};

const onRemoveLinkPopupAgree = async () => {
  try {
    const { message, editedGroup } = await $fetch(`/api/links/${removedOrEditedLinkData.id}`, {
      method: 'delete',
      query: {
        groupId: removedOrEditedLinkData.groupId
      }
    });

    // поиск группы в глобальном стейте, а затем заменяем на отредактированную

    const removedLinkGroupIndex = linkGroups.value.findIndex(
      (group) => group._id === removedOrEditedLinkData.groupId
    );
    if (removedLinkGroupIndex !== -1) {
      linkGroups.value[removedLinkGroupIndex] = editedGroup;
    }

    onCloseConfirmPopup();
    notifications.add({ id: 'link-removed', title: message });
  } catch (error: any) {
    removeLinkError.value = error.data.message;
  }
};
</script>

<template>
  <div>
    <ul class="links-list">
      <li v-for="group of HEADER_LINK_GROUPS" :key="group.id">
        <a :href="group.to" class="links-list__title">
          <Icon :icon="group.icon" />
          <span>
            {{ group.title }}
          </span>
        </a>
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
      :error="editLinkError"
      @on-close="onCloseLinkForm"
      @on-submit="onEditLinkFormSubmit"
    />
    <LazyConfirmPopup
      v-if="props.isInAdminPage"
      :is-open="isConfirmPopupOpened"
      :what-is-removed="'link'"
      :removed-item-title="removedOrEditedLinkData.title"
      :error="removeLinkError"
      @on-close="onCloseConfirmPopup"
      @on-agree="onRemoveLinkPopupAgree"
    />
  </div>
</template>

<style lang="scss">
.links-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 5vw;

  .links-list__title {
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 16px;

    span {
      font-weight: 600;
    }
  }

  .links-list__links {
    padding-left: 60px;
    list-style: disc;
  }
}
</style>
