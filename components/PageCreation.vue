<script setup lang="ts">
import CANVAS_OPTIONS from '~/utils/canvasesData';
import type { Form, FormError } from '#ui/types';
import type RouteDataFromDb from '~/types/RouteDataFromDb';

const newRouteValues = reactive({
  route: '',
  canvas: 'CanvasOne'
});
const form = ref(null);

const routesFromDb = useRoutesState();
const notifications = useToast();

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.route) errors.push({ path: 'route', message: 'Поле "Ссылка" является обязательным' });
  if (!/^\/(?!\/)[a-zA-Z]/.test(state.route))
    errors.push({
      path: 'route',
      message: 'Ссылка должна начинаться с / и содержать латинские символы после'
    });
  return errors;
};

const handleCreatePageFormSubmit = async () => {
  if (useRouteFindByPath(routesFromDb.value, newRouteValues.route)) {
    return notifications.add({
      id: 'route-create',
      title: 'Такая страница уже существует!'
    });
  } else {
    const newRouteBody = {
      path: newRouteValues.route,
      component: newRouteValues.canvas
    };

    try {
      const data = await $fetch('/api/routes', {
        method: 'post',
        body: newRouteBody
      });

      routesFromDb.value.push(data as unknown as RouteDataFromDb);
      notifications.add({ id: 'route-create', title: 'Страница создана!' });
      newRouteValues.route = '';
      newRouteValues.canvas = 'CanvasOne';
      (form.value as unknown as Form<string>).clear();
    } catch (error: any) {
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
        Путь на будущую страницу: (http://www.nature-nas.by*ссылка*)
        <span class="required">*</span>
        <UInput
          v-model="newRouteValues.route"
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
      <SubmitBtn>Создать страницу</SubmitBtn>
    </UForm>
  </div>
</template>

<style lang="scss">
@import url('../assets/styles/components/pageCreation.scss');
</style>
