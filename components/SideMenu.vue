<script setup lang="ts">
import type { Link } from '~/types/LinkDataFromDb';
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

const route = useRoute();
const router = useRouter();
const notifications = useToast();
const isLoggedIn = useLoggedInState();

const labsCentersLinkGroups = computed(() => {
  return allGroupLinks.value.filter((group) => group.group === 'labs-and-centers');
});

const handleGroupLinkShowedToggle = async (groupId: string, links: Link[]) => {
  groupLinkShowed.value = groupId;
  if (links.length) {
    await navigateTo(`/labs-and-centers${links[0].to}`);
  } else {
    await navigateTo('/labs-and-centers');
  }
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
    const data = await $fetch('/api/groups', {
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
    requestError.value = error.data.message;
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
      const data = await $fetch(`/api/groups/${groupData.id}`, {
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
      requestError.value = `Ошибка ${error.statusCode}: ${error.data.message}`;
      console.error(error);
    }
  }
};

const handleRemoveLinkGroup = async () => {
  const groupId = groupDataForRemoval.value.id;
  try {
    const data = await $fetch(`/api/groups/${groupId}`, {
      method: 'delete'
    });

    const groupIndex = labsCentersLinkGroups.value.findIndex((group) => group._id === groupId);
    const firstGroup = labsCentersLinkGroups.value[0];
    if (labsCentersLinkGroups.value.length > 1 && groupIndex > 0) {
      handleGroupLinkShowedToggle(firstGroup._id, firstGroup.links);
    } else {
      await navigateTo('/labs-and-centers');
    }
    allGroupLinks.value = allGroupLinks.value.filter((group) => group._id !== groupId);

    handleConfirmPopupClose();
    notifications.add({
      id: 'link-group',
      title: data.message
    });
  } catch (error: any) {
    requestError.value = `Ошибка ${error.statusCode}: ${error.data.message}`;
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
    if (updatedGroup) {
      const groupIndex = allGroupLinks.value.findIndex((group) => group._id === updatedGroup._id);
      allGroupLinks.value[groupIndex].links.push(newLinkTyped);
    }
    handleLinkFormClose();
    notifications.add({
      id: 'link',
      title: `Ссылка "${body.title}" создана!`
    });
    await navigateTo(`/labs-and-centers${newLinkTyped.to}`);
  } catch (error: any) {
    requestError.value = `Ошибка ${error.statusCode}: ${error.data.message}`;
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
      requestError.value = `Ошибка ${error.statusCode}: ${error.data.message}`;
      console.error(error);
    }
  }
};

const handleRemoveLink = async () => {
  const { linkId, groupId } = linkValuesForRemoval.value;

  try {
    const data = await $fetch(`/api/links/${linkId}`, {
      method: 'delete',
      query: {
        groupId
      }
    });

    const removedLinkGroupIndex = allGroupLinks.value.findIndex((group) => group._id === groupId);
    const groupLinks = allGroupLinks.value[removedLinkGroupIndex].links;
    const removedLinkIndex = groupLinks.findIndex((link) => link._id === linkId);

    if (groupLinks.length > 1 && removedLinkIndex !== 0) {
      await navigateTo(`/labs-and-centers${groupLinks[removedLinkIndex - 1].to}`);
    } else if (groupLinks.length > 1 && removedLinkIndex === 0) {
      await navigateTo(`/labs-and-centers${groupLinks[removedLinkIndex + 1].to}`);
    } else {
      // в случае, если количество ссылок было равно 1
      const removedLinkGroupIndexInLabsAndCentersGroup = labsCentersLinkGroups.value.findIndex(
        (group) => group._id === groupId
      );
      const previousGroup =
        labsCentersLinkGroups.value[removedLinkGroupIndexInLabsAndCentersGroup - 1];
      if (previousGroup) {
        groupLinkShowed.value = previousGroup._id;
        await navigateTo(`/labs-and-centers${previousGroup.links[0].to}`);
      } else {
        await navigateTo('/labs-and-centers');
      }
    }

    allGroupLinks.value[removedLinkGroupIndex].links = groupLinks.filter(
      (link) => link._id !== linkId
    );

    handleConfirmPopupClose();
    notifications.add({
      id: 'link-group',
      title: data.message
    });
  } catch (error: any) {
    requestError.value = `Ошибка ${error.statusCode}: ${error.data.message}`;
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
  if (labsCentersLinkGroups.value && labsCentersLinkGroups.value.length) {
    const linkTo = route.fullPath.split('/labs-and-centers')[1];
    if (linkTo) {
      const filteredGroups = labsCentersLinkGroups.value.filter((group) => {
        return group.links.some((link) => link.to === linkTo);
      });
      groupLinkShowed.value = filteredGroups[0]._id;
    } else {
      router.push({
        path: `/labs-and-centers${labsCentersLinkGroups.value[0].links[0].to}`,
        replace: true
      });
      groupLinkShowed.value = labsCentersLinkGroups.value[0]._id;
    }
  }
});
</script>

<template>
  <aside class="side-menu">
    <ul class="side-menu__link-groups">
      <li
        v-for="{ _id: groupId, title, links } of labsCentersLinkGroups"
        class="side-menu__link-group"
        :key="groupId"
      >
        <div class="side-menu__group-container">
          <ClientOnly>
            <EditBtn
              :color="'gray'"
              class="side-menu-edit-btn"
              @click="handleEditGroupBtnClick(title, groupId)"
            />
          </ClientOnly>
          <p class="side-menu__group-title" @click="handleGroupLinkShowedToggle(groupId, links)">
            {{ title }}
          </p>
        </div>
        <ul
          :class="[{ 'side-menu__links_showed': groupLinkShowed === groupId }, 'side-menu__links']"
        >
          <li v-for="{ _id: linkId, title, to } of links" :key="linkId" class="side-menu__link">
            <ClientOnly>
              <EditBtn
                :color="'gray'"
                class="side-menu-edit-btn"
                @click="handleEditLinkBtnClick(title, to, linkId, groupId)"
              />
            </ClientOnly>
            <NuxtLink
              :to="`/labs-and-centers${to}`"
              :class="{ 'side-menu__link_active': route.fullPath === `/labs-and-centers${to}` }"
            >
              {{ title }}
            </NuxtLink>
          </li>
          <ClientOnly>
            <AddLinkButton
              :color="'mid-blue'"
              :size="'md'"
              @on-click="handleAddLinkBtnClick(title, groupId)"
            />
          </ClientOnly>
        </ul>
      </li>
    </ul>
    <ClientOnly>
      <AddLinkButton :color="'white'" :size="'md'" @on-click="handleAddGroupBtnClick" />
      <LazyLinkGroupForm
        v-if="isLoggedIn"
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
        v-if="isLoggedIn"
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
    </ClientOnly>
  </aside>
</template>

<style lang="scss">
@import url('~/assets/styles/components/sideMenu.scss');
</style>
