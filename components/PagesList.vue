<script setup lang="ts">
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const isConfirmPopupOpen = ref(false);
const routeDataForRemove = reactive({
  id: '',
  name: '',
  path: ''
});
const removeRouteError = ref('');

const linkGroups = useLinkGroupsState();
const routesFromDb = useRoutesState();
const notifications = useToast();
const router = useRouter();

const onRemoveBtnClick = (routeId: string, name: string, path: string) => {
  isConfirmPopupOpen.value = true;
  routeDataForRemove.id = routeId;
  routeDataForRemove.name = name;
  routeDataForRemove.path = path;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  routeDataForRemove.id = '';
  routeDataForRemove.name = '';
  routeDataForRemove.path = '';
};

const handleRouteRemove = async () => {
  try {
    const { message, links } = await $fetch(`/api/routes/${routeDataForRemove.id}`, {
      method: 'delete'
    });
    routesFromDb.value = routesFromDb.value.filter(
      (route: RouteDataFromDb) => route._id !== routeDataForRemove.id
    );
    router.removeRoute(routeDataForRemove.name);

    if (links && links.length) {
      linkGroups.value = linkGroups.value.map((group) => {
        group.links = group.links.filter((groupLink) => {
          return links.every((link) => link._id !== groupLink._id);
        });
        return group;
      });
    }

    onConfirmPopupClose();
    notifications.add({ id: 'route-remove', title: message });
  } catch (error: any) {
    removeRouteError.value = error.data.message;
  }
};
</script>

<template>
  <div class="list">
    Список созданных вами страниц:
    <table class="list__table">
      <thead>
        <tr>
          <th>№</th>
          <th>Страница</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({ path, _id: id, name }, index) in routesFromDb" :key="id">
          <td>{{ index + 1 }}</td>
          <td>{{ path }}</td>
          <td><RemoveBtn @click="onRemoveBtnClick(id, name, path)" /></td>
        </tr>
      </tbody>
    </table>
    <LazyConfirmPopup
      :is-open="isConfirmPopupOpen"
      :what-is-removed="'route'"
      :removed-item-title="routeDataForRemove.path"
      :error="removeRouteError"
      @on-close="onConfirmPopupClose"
      @on-agree="handleRouteRemove"
    />
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/list.scss');
</style>
