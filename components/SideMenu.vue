<script setup lang="ts">
import type RemovedItem from '~/types/RemovedItemForConfirmPopup';

const groupData = reactive({
  title: '',
  id: ''
});
let groupTitleBeforeEdit = '';
const groupDataForRemoval = ref({
  title: '',
  id: ''
});

const linkValues = reactive({
  linkId: '',
  title: '',
  to: ''
});
let linkValuesBeforeEdit = {
  title: '',
  to: ''
};
const linkValuesForRemoval = ref({
  title: '',
  linkId: '',
  groupId: ''
});

const groupDataForAddingOrEditingLink = ref({
  id: '',
  title: ''
});
const instanceBeingRemoved = ref<RemovedItem>('');
const isGroupPopupOpen = ref(false);
const isLinkPopupOpen = ref(false);
const isConfirmPopupOpen = ref(false);
const isEditing = ref(false);
const requestError = ref('');
const allGroupLinks = useLinkGroupsState();
const groupLinkShowed = ref('');

const notifications = useToast();

const labsCentersLinkGroups = computed(() => {
  return allGroupLinks.value.filter((group) => group.group === 'labs-and-centers');
});

const handleGroupLinkShowedToggle = (groupId: string) => {
  groupLinkShowed.value = groupId;
};

const handleAddGroupBtnClick = () => {
  isGroupPopupOpen.value = true;
};

const handleEditGroupBtnClick = (title: string, groupId: string) => {
  groupData.title = title;
  groupData.id = groupId;
  groupTitleBeforeEdit = title;
  isEditing.value = true;
  isGroupPopupOpen.value = true;
};

const handleAddLinkBtnClick = (groupTitle: string, groupId: string) => {
  groupDataForAddingOrEditingLink.value.title = groupTitle;
  groupDataForAddingOrEditingLink.value.id = groupId;
  isLinkPopupOpen.value = true;
};

const handleEditLinkBtnClick = (
  linkTitle: string,
  linkTo: string,
  linkId: string,
  groupId: string
) => {
  linkValues.title = linkTitle;
  linkValues.to = linkTo;
  linkValues.linkId = linkId;
  groupDataForAddingOrEditingLink.value.id = groupId;

  linkValuesBeforeEdit = {
    title: linkTitle,
    to: linkTo
  };
  isEditing.value = true;
  isLinkPopupOpen.value = true;
};

const handleLinkFormClose = () => {
  isLinkPopupOpen.value = false;
  linkValues.title = '';
  linkValues.to = '';
  linkValues.linkId = '';
  groupDataForAddingOrEditingLink.value = {
    id: '',
    title: ''
  };
  isEditing.value = false;
  requestError.value = '';
};

const handleGroupLinkFormClose = () => {
  isGroupPopupOpen.value = false;
  isEditing.value = false;
  groupTitleBeforeEdit = '';
  groupData.title = '';
  groupData.id = '';
  requestError.value = '';
};

const handleRemoveLinkGroupBtnClick = () => {
  groupDataForRemoval.value.title = groupData.title;
  groupDataForRemoval.value.id = groupData.id;
  handleGroupLinkFormClose();
  instanceBeingRemoved.value = 'linkGroup';
  isConfirmPopupOpen.value = true;
};

const handleRemoveLinkBtnClick = () => {
  linkValuesForRemoval.value.title = linkValues.title;
  linkValuesForRemoval.value.linkId = linkValues.linkId;
  linkValuesForRemoval.value.groupId = groupDataForAddingOrEditingLink.value.id;
  handleLinkFormClose();
  instanceBeingRemoved.value = 'link';
  isConfirmPopupOpen.value = true;
};

const handleConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  groupDataForRemoval.value = {
    title: '',
    id: ''
  };
  linkValuesForRemoval.value = {
    title: '',
    linkId: '',
    groupId: ''
  };
  instanceBeingRemoved.value = '';
  requestError.value = '';
};

const handleAddLinkGroup = async () => {
  try {
    const data = await $fetch('/api/link-groups', {
      method: 'post',
      body: {
        title: groupData.title,
        group: 'labs-and-centers'
      }
    });
    allGroupLinks.value = [...allGroupLinks.value, data];
    handleGroupLinkFormClose();
    notifications.add({ id: 'link-group', title: `Группа ссылок ${data.title} была добавлена` });
  } catch (error: any) {
    requestError.value = error.message;
    console.error(error);
  }
};

const handleEditLinkGroup = async () => {
  const body = {
    title: groupData.title
  };
  if (groupTitleBeforeEdit === groupData.title) {
    handleGroupLinkFormClose();
  } else {
    try {
      const data = await $fetch(`/api/link-groups/${groupData.id}`, {
        method: 'patch',
        body
      });

      if (data) {
        const index = allGroupLinks.value.findIndex((group) => group._id === data._id);
        allGroupLinks.value[index].title = data.title;
      }

      handleGroupLinkFormClose();

      notifications.add({
        id: 'link-group',
        title: `Группа ссылок ${groupData.title} была изменена`
      });
    } catch (error: any) {
      requestError.value = `Ошибка ${error.statusCode}: ${error.message}`;
      console.error(error);
    }
  }
};

const handleRemoveLinkGroup = async () => {
  const groupId = groupDataForRemoval.value.id;
  try {
    const data = await $fetch(`/api/link-groups/${groupId}`, {
      method: 'delete'
    });

    allGroupLinks.value = allGroupLinks.value.filter((group) => group._id !== groupId);
    handleConfirmPopupClose();
    notifications.add({
      id: 'link-group',
      title: data.message
    });
  } catch (error: any) {
    requestError.value = `Ошибка ${error.statusCode}: ${error.message}`;
    console.error(error);
  }
};

const handleAddLink = async () => {
  const body = {
    title: linkValues.title,
    to: linkValues.to
  };

  try {
    const newLinkBody = {
      ...body,
      groupId: groupDataForAddingOrEditingLink.value.id
    };
    const { updatedGroup, newLinkTyped } = await $fetch('/api/links', {
      method: 'post',
      body: newLinkBody
    });
    const groupIndex = allGroupLinks.value.findIndex((group) => group._id === updatedGroup._id);
    allGroupLinks.value[groupIndex].links.push(newLinkTyped);
    handleLinkFormClose();
    notifications.add({
      id: 'link',
      title: `Ссылка ${body.title} создана!`
    });
  } catch (error: any) {
    requestError.value = `Ошибка ${error.statusCode}: ${error.message}`;
    console.error(error);
  }
};

const handleEditLink = async () => {
  const linkId = linkValues.linkId;
  const groupId = groupDataForAddingOrEditingLink.value.id;
  const body = {
    title: linkValues.title,
    to: linkValues.to
  };
  const linkDataBeforeEditStringified = JSON.stringify(linkValuesBeforeEdit);

  if (JSON.stringify(body) === linkDataBeforeEditStringified) {
    handleLinkFormClose();
  } else {
    try {
      const data = await $fetch(`/api/links/${linkId}`, {
        method: 'patch',
        body
      });

      if (data) {
        const groupIndex = allGroupLinks.value.findIndex((group) => group._id === groupId);
        const linkIndex = allGroupLinks.value[groupIndex].links.findIndex(
          (link) => link._id === data._id
        );
        allGroupLinks.value[groupIndex].links[linkIndex] = data;
      }

      handleLinkFormClose();
      notifications.add({
        id: 'link',
        title: `Ссылка "${body.title}" была изменена`
      });
    } catch (error: any) {
      requestError.value = `Ошибка ${error.statusCode}: ${error.message}`;
      console.error(error);
    }
  }
};

const handleRemoveLink = async () => {
  const linkId = linkValuesForRemoval.value.linkId;
  const groupId = linkValuesForRemoval.value.groupId;

  try {
    const data = await $fetch(`/api/links/${linkId}`, {
      method: 'delete',
      query: {
        groupId
      }
    });

    const removedLinkGroupIndex = allGroupLinks.value.findIndex((group) => group._id === groupId);
    allGroupLinks.value[removedLinkGroupIndex].links = allGroupLinks.value[
      removedLinkGroupIndex
    ].links.filter((link) => link._id !== linkId);

    handleConfirmPopupClose();
    notifications.add({
      id: 'link-group',
      title: data.message
    });
  } catch (error: any) {
    requestError.value = `Ошибка ${error.statusCode}: ${error.message}`;
    console.error(error);
  }
};

const addOrEditHandlersForLinkFormSubmit = computed(() => {
  return isEditing.value ? handleEditLink : handleAddLink;
});

const removedInstanceData = computed(() => {
  return instanceBeingRemoved.value === 'link'
    ? { title: linkValuesForRemoval.value.title, handler: handleRemoveLink }
    : { title: groupDataForRemoval.value.title, handler: handleRemoveLinkGroup };
});

onMounted(() => {
  if (
    labsCentersLinkGroups.value &&
    labsCentersLinkGroups.value.length &&
    labsCentersLinkGroups.value[0].links.length
  ) {
    groupLinkShowed.value = labsCentersLinkGroups.value[0]._id;
  }
});
</script>

<template>
  <div class="side-menu">
    <ul class="side-menu__link-groups">
      <li
        v-for="{ _id: groupId, title, links } of labsCentersLinkGroups"
        class="side-menu__link-group"
        :key="groupId"
      >
        <div class="side-menu__group-container">
          <EditBtn
            :color="'gray'"
            :appliedClass="'edit-btn'"
            @click="handleEditGroupBtnClick(title, groupId)"
          />
          <p class="side-menu__group-title" @click="handleGroupLinkShowedToggle(groupId)">
            {{ title }}
          </p>
        </div>
        <ul
          :class="[{ 'side-menu__links_showed': groupLinkShowed === groupId }, 'side-menu__links']"
        >
          <li v-for="{ _id: linkId, title, to } of links" :key="linkId" class="side-menu__link">
            <EditBtn :color="'gray'" @click="handleEditLinkBtnClick(title, to, linkId, groupId)" />
            <NuxtLink
              :to="`/labs-and-centers${to}`"
              :class="{ 'side-menu__link_active': $route.fullPath === `/labs-and-centers${to}` }"
            >
              {{ title }}
            </NuxtLink>
          </li>
          <AddLinkButton :color="'blue'" @on-click="handleAddLinkBtnClick(title, groupId)" />
        </ul>
      </li>
    </ul>
    <AddLinkButton
      :color="'white'"
      :applied-styles="'add-btn'"
      @on-click="handleAddGroupBtnClick"
    />
    <LazyLinkGroupForm
      v-model="groupData"
      :is-open="isGroupPopupOpen"
      :is-editing="isEditing"
      :error="requestError"
      @on-close="handleGroupLinkFormClose"
      @on-add="handleAddLinkGroup"
      @on-edit="handleEditLinkGroup"
      @on-remove="handleRemoveLinkGroupBtnClick"
    />
    <LazyLinkForm
      :link-value="linkValues"
      :is-opened="isLinkPopupOpen"
      :grouping-link-title="groupDataForAddingOrEditingLink.title"
      :error="requestError"
      @on-submit="addOrEditHandlersForLinkFormSubmit"
      @on-close="handleLinkFormClose"
    >
      <div v-if="isEditing">
        <UDivider label="ИЛИ" class="divider" />
        <UButton block color="red" variant="soft" @click="handleRemoveLinkBtnClick"
          >Удалить</UButton
        >
      </div>
    </LazyLinkForm>
    <LazyConfirmPopup
      :is-open="isConfirmPopupOpen"
      :what-is-removed="instanceBeingRemoved"
      :removedItemTitle="removedInstanceData.title"
      @on-close="handleConfirmPopupClose"
      @on-agree="removedInstanceData.handler"
    />
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/sideMenu.scss');
</style>
