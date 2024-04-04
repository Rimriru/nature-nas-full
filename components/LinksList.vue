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
const linkId = ref('');
const linkGroupId = ref('');
const removedLinkTitle = ref('');
const isEditLinkPopupOpened = ref(false);
const isConfirmPopupOpened = ref(false);
const editLinkError = ref('');
const removeLinkError = ref('');
const editLinkForm: Ref<Form<string> | null> = ref(null);
const linkGroups = useLinkGroupsState();

const notifications = useToast();

const props = defineProps(['isInAdminPage']);

const onEditLinkClick = (id: string, title: string, to: string, groupId: string) => {
  linkData.title = title;
  linkData.to = to;
  linkData.groupId = groupId;
  linkDataBeforeEdit.title = title;
  linkDataBeforeEdit.to = to;
  linkId.value = id;
  isEditLinkPopupOpened.value = true;
};

const onRemoveLinkClick = (id: string, linkTitle: string, groupId: string) => {
  linkId.value = id;
  linkGroupId.value = groupId;
  removedLinkTitle.value = linkTitle;
  isConfirmPopupOpened.value = true;
};

provide('linkActions', { onEditLinkClick, onRemoveLinkClick });

const resetFormFields = () => {
  linkData.title = '';
  linkData.to = '';

  if (editLinkForm?.value) return editLinkForm.value.clear();
};

const onCloseLinkForm = () => {
  isEditLinkPopupOpened.value = false;
  resetFormFields();
  linkData.groupId = '';
  editLinkError.value = '';
  linkId.value = '';
};

const onCloseConfirmPopup = () => {
  isConfirmPopupOpened.value = false;
  removedLinkTitle.value = '';
  linkId.value = '';
  linkGroupId.value = '';
};

const onEditLinkFormMount = (form: Form<string>) => {
  editLinkForm.value = form;
};

const onEditLinkFormSubmit = async () => {
  if (linkData.title === linkDataBeforeEdit.title && linkData.to === linkDataBeforeEdit.to) {
    onCloseLinkForm();
  } else {
    try {
      const data = await $fetch(`/api/links/${linkId.value}`, {
        method: 'patch',
        body: linkData
      });

      const editedLinkGroupIndex = linkGroups.value.findIndex(
        (group) => group._id === linkData.groupId
      );
      if (editedLinkGroupIndex !== -1) {
        const editedLinkIndex = linkGroups.value[editedLinkGroupIndex].links.findIndex(
          (link) => link._id === data.editedLinkData?._id
        );
        linkGroups.value[editedLinkGroupIndex].links[editedLinkIndex] = data.editedLinkData as Link;
      }
      onCloseLinkForm();
      notifications.add({ id: 'link-edited', title: data.message });
    } catch (error: any) {
      editLinkError.value = error?.data.message;
    }
  }
};

const onRemoveLinkPopupAgree = async () => {
  try {
    const data = await $fetch(`/api/links/${linkId.value}`, {
      method: 'delete'
    });

    const removedLinkGroupIndex = linkGroups.value.findIndex(
      (group) => group._id === linkGroupId.value
    );
    if (removedLinkGroupIndex !== -1) {
      linkGroups.value[removedLinkGroupIndex].links = linkGroups.value[
        removedLinkGroupIndex
      ].links.filter((link) => {
        link._id !== linkId.value;
      });
    }

    console.log(linkGroups.value);

    // links.value = links.value.filter((link: Link) => link._id !== linkId.value);
    onCloseConfirmPopup();
    notifications.add({ id: 'link-removed', title: data.message });
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
      @on-mount="onEditLinkFormMount"
    />
    <LazyConfirmPopup
      v-if="props.isInAdminPage"
      :is-open="isConfirmPopupOpened"
      :what-is-removed="'link'"
      :removed-item-title="removedLinkTitle"
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
