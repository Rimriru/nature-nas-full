<script setup lang="ts">
import { CANVAS_OPTIONS, canvases } from '~/utils/canvasesData';
import { PAGE_LINK_REG_EXP } from '~/utils/regExp';
import { PAGE_LINK_VALIDATION_ERROR } from '~/utils/errorMessages';
import type { Form, FormError } from '#ui/types';
import type { RouteDataFromDb } from '~/types/RouteDataFromDb';

const newRouteValues = reactive({
  route: '',
  canvas: 'CanvasOne'
});
const form = ref(null);

const routesFromDb = useRoutesState();
const notifications = useToast();
const router = useRouter();
const isLoaderVisible = useLoaderVisibilityState();

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.route) errors.push({ path: 'route', message: 'Поле "Ссылка" является обязательным' });
  if (!PAGE_LINK_REG_EXP.test(state.route))
    errors.push({
      path: 'route',
      message: PAGE_LINK_VALIDATION_ERROR
    });
  return errors;
};

const handleCreatePageFormSubmit = async () => {
  isLoaderVisible.value = true;
  const newRouteBody = {
    name: newRouteValues.route.slice(1),
    path: newRouteValues.route,
    component: newRouteValues.canvas
  };

  if (router.hasRoute(newRouteBody.name)) {
    isLoaderVisible.value = false;
    return notifications.add({
      id: 'route-create',
      title: 'Такая страница уже существует!'
    });
  } else {
    try {
      const data = await $fetch('/api/routes', {
        method: 'post',
        body: newRouteBody
      });

      routesFromDb.value.push(data as RouteDataFromDb);

      router.addRoute({
        path: data.path,
        name: data.name,
        component: canvases[data.component],
        props: {
          routeData: data
        }
      });

      isLoaderVisible.value = false;
      notifications.add({ id: 'route-create', title: 'Страница создана!' });
      newRouteValues.route = '';
      newRouteValues.canvas = 'CanvasOne';
      (form.value as unknown as Form<string>).clear();
    } catch (error: any) {
      isLoaderVisible.value = false;
      console.error(error);
      notifications.add({ id: 'route-create', title: error.data.message });
    }
  }
};
</script>

<template>
  <div class="page-creation">
    <UForm
      :state="newRouteValues"
      :validate="validate"
      ref="form"
      class="page-creation__form"
      @submit="handleCreatePageFormSubmit"
    >
      <UFormGroup name="route" class="page-creation__text-field" :eager-validation="true">
        Путь на будущую страницу: ({{ $config.public.prodDomen }}*ссылка*)
        <span class="required">*</span>
        <UInput
          v-model.trim="newRouteValues.route"
          :eager-validation="true"
          placeholder="Введите ссылку на страницу латинницей: /..."
        />
      </UFormGroup>
      <URadioGroup
        v-model="newRouteValues.canvas"
        class="page-creation__canvases"
        :options="CANVAS_OPTIONS"
        legend="Выберите шаблон страницы:"
      >
        <template #label="{ option }">
          <div class="page-creation__canvas" :style="{ backgroundImage: `url(${option.img})` }">
            <span class="page-creation__tooltip">{{ option.tooltipText }}</span>
          </div>
        </template>
      </URadioGroup>
      <MenuButton
        :button-type="'submit'"
        :size="'middle'"
        :is-active="true"
        class="page-creation__submit-btn"
        >Создать страницу</MenuButton
      >
    </UForm>
  </div>
</template>

<style lang="scss">
@import url('~/assets/styles/components/pageCreation.scss');
</style>
