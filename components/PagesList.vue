<script setup lang="ts">
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const isConfirmPopupOpen = ref(false);
const routeDataForRemove = reactive({
  id: '',
  path: ''
});
const removeRouteError = ref('');

const links = useLinksState();
const routesFromDb = useRoutesState();
const notifications = useToast();
const router = useRouter();

const onRemoveBtnClick = (routeId: string, path: string) => {
  isConfirmPopupOpen.value = true;
  routeDataForRemove.id = routeId;
  routeDataForRemove.path = path;
};

const onConfirmPopupClose = () => {
  isConfirmPopupOpen.value = false;
  routeDataForRemove.id = '';
  routeDataForRemove.path = '';
};

const handleRouteRemove = async () => {
  try {
    const data = await $fetch(`/api/routes/${routeDataForRemove.id}`, {
      method: 'delete'
    });
    links.value = links.value.filter((link) => link.to !== routeDataForRemove.path);
    routesFromDb.value = routesFromDb.value.filter(
      (route: RouteDataFromDb) => route._id !== routeDataForRemove.id
    );
    router.removeRoute(routeDataForRemove.path);
    onConfirmPopupClose();
    notifications.add({ id: 'route-remove', title: data.message });
  } catch (error: any) {
    removeRouteError.value = error.data.message;
  }
};
</script>

<template>
  <div class="pages-list">
    Список созданных вами страниц:
    <table class="pages-list__table">
      <thead>
        <tr>
          <th>№</th>
          <th>Страница</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({ path, _id: id }, index) in routesFromDb" :key="id">
          <td>{{ index + 1 }}</td>
          <td>{{ path }}</td>
          <td><RemoveBtn @click="onRemoveBtnClick(id, path)" /></td>
        </tr>
      </tbody>
    </table>
    <ConfirmPopup
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
.pages-list {
  width: 100%;
  margin-right: 60px;

  .pages-list__table {
    width: 100%;

    th {
      border-bottom: 1px solid #ddd;
    }

    &,
    th,
    td {
      text-align: center;
      padding-block: 4px;
    }

    tr:not(:last-of-type) {
      border-bottom: 1px solid #eeececb7;
    }

    tr td:last-of-type {
      display: flex;
      justify-content: center;
    }

    tbody tr:hover {
      background-color: rgba(69, 138, 242, 0.243);
    }
  }
}
</style>
