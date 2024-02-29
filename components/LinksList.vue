<script setup lang="ts">
import { HEADER_LINK_GROUPS } from '~/utils/constants';
import type { Link } from '~/types/LinkDataFromDb';
import type { Form } from '#ui/types';

const linkData = reactive({
  title: '',
  to: ''
});
const linkDataBeforeEdit = reactive({
  title: '',
  to: ''
});
const linkId = ref('');
const removedLinkTitle = ref('');
const isEditLinkPopupOpened = ref(false);
const isConfirmPopupOpened = ref(false);
const editLinkError = ref('');
const removeLinkError = ref('');
const editLinkForm: Ref<Form<string> | null> = ref(null);

const links = useLinksState();
const notifications = useToast();

const props = defineProps(['isInAdminPage']);

const onEditLinkClick = (id: string, title: string, to: string) => {
  linkData.title = title;
  linkData.to = to;
  linkDataBeforeEdit.title = title;
  linkDataBeforeEdit.to = to;
  linkId.value = id;
  isEditLinkPopupOpened.value = true;
};

const onRemoveLinkClick = (id: string, linkTitle: string) => {
  linkId.value = id;
  removedLinkTitle.value = linkTitle;
  isConfirmPopupOpened.value = true;
};

const resetFormFields = () => {
  linkData.title = '';
  linkData.to = '';

  if (editLinkForm?.value) return editLinkForm.value.clear();
};

const onCloseLinkForm = () => {
  resetFormFields();
  isEditLinkPopupOpened.value = false;
  editLinkError.value = '';
  linkId.value = '';
};

const onCloseConfirmPopup = () => {
  isConfirmPopupOpened.value = false;
  removedLinkTitle.value = '';
  linkId.value = '';
};

const onEditLinkFormMount = (form: Form<string>) => {
  editLinkForm.value = form;
};

const onEditLinkFormSubmit = async () => {
  if (linkData.title === linkDataBeforeEdit.title && linkData.to === linkDataBeforeEdit.to) {
    onCloseLinkForm();
  } else {
    const { data, error } = await useFetch(`/api/links/${linkId.value}`, {
      method: 'patch',
      body: {
        title: linkData.title,
        to: linkData.to
      }
    });
    if (data.value) {
      const editedLinkIndex = links.value.findIndex(
        (link) => link._id === data.value?.editedLinkData?._id
      );
      links.value[editedLinkIndex] = data.value.editedLinkData as Link;
      onCloseLinkForm();
      notifications.add({ id: 'link-edited', title: data.value.message });
    } else {
      editLinkError.value = error.value?.data.message;
    }
  }
};

const onRemoveLinkPopupAgree = async () => {
  const { data, error } = await useFetch(`/api/links/${linkId.value}`, {
    method: 'delete'
  });

  if (data.value) {
    links.value = links.value.filter((link) => link._id !== linkId.value);
    onCloseConfirmPopup();
    notifications.add({ id: 'link-removed', title: data.value.message });
  } else {
    removeLinkError.value = error.value?.data.message;
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
          <LinksMenuItem
            :links-array="links"
            :group="group.group"
            :is-in-admin-page="props.isInAdminPage"
            @on-edit="onEditLinkClick"
            @on-remove="onRemoveLinkClick"
          />
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
