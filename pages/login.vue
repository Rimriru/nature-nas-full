<script setup lang="ts">
import type { FormError } from '#ui/types';

useServerSeoMeta({
  robots: 'none noarchive nositelinkssearchbox'
});

const userData = reactive({
  username: '',
  password: ''
});
const usernameInput = ref(null);
const passwordInput = ref(null);
const isPasswordTypePassword = ref(true);
const isAlertShown = ref(false);
const loginError = ref('');

const router = useRouter();
const loggedInState = useLoggedInState();

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.username)
    errors.push({ path: 'username', message: 'Поле "Имя пользователя" является обязательным' });
  if (!state.password)
    errors.push({ path: 'password', message: 'Поле "Пароль" является обязательным' });
  return errors;
};

const handleLoginFormSubmit = async () => {
  isAlertShown.value = false;
  loginError.value = '';
  const body = {
    username: userData.username,
    password: userData.password
  };
  try {
    await $fetch(`/api/users/${userData.username}`, {
      method: 'post',
      body
    });
    isAlertShown.value = true;
    loggedInState.value = true;
    setTimeout(() => {
      router.push('/admin');
    }, 5000);
  } catch (error: any) {
    isAlertShown.value = true;
    loginError.value = `${error.statusCode}: ${error.data.message}!`;
    console.error(error);
  }
};
</script>

<template>
  <UForm :state="userData" :validate="validate" class="login" @submit="handleLoginFormSubmit">
    <UAlert
      :title="loginError ? 'Ошибка!' : 'Успех!'"
      :description="loginError ? loginError : 'Вы будете перенаправлены на админскую панель.'"
      :class="[
        'login__alert',
        {
          login__alert_shown: isAlertShown
        }
      ]"
      :color="loginError ? 'red' : 'green'"
      variant="solid"
    />
    <h1 @click="isAlertShown = !isAlertShown">Вход в систему</h1>
    <UFormGroup name="username" class="login__input-group">
      <span
        :class="['login__title', { login__title_up: (usernameInput as any)?.input.value }]"
        @click="(usernameInput as any)?.input.focus()"
        >Имя пользователя</span
      >
      <UInput v-model="userData.username" ref="usernameInput" />
    </UFormGroup>
    <UFormGroup name="password" class="login__input-group">
      <span
        :class="['login__title', { login__title_up:(passwordInput as any)?.input.value }]"
        @click="(passwordInput as any)?.input.focus()"
        >Пароль</span
      >
      <UInput
        v-model="userData.password"
        ref="passwordInput"
        :type="isPasswordTypePassword ? 'password' : 'text'"
      >
        <button
          type="button"
          :class="[
            'login__password-eye',
            { 'login__password-eye_opened': !isPasswordTypePassword }
          ]"
          @click="isPasswordTypePassword = !isPasswordTypePassword"
        ></button>
      </UInput>
    </UFormGroup>
    <MenuButton class="login__submit-btn" :button-type="'submit'" :size="'middle'" :is-active="true"
      >Вход</MenuButton
    >
  </UForm>
</template>

<style lang="scss">
@import url('~/assets/styles/pages/login.scss');
</style>
