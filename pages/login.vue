<script setup lang="ts">
import type { Form, FormError } from '#ui/types';

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

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.username)
    errors.push({ path: 'username', message: 'Поле "Имя пользователя" является обязательным' });
  if (!state.password)
    errors.push({ path: 'password', message: 'Поле "Пароль" является обязательным' });
  return errors;
};

const handleLoginFormSubmit = async () => {
  const body = {
    username: userData.username,
    password: userData.password
  };
  try {
    const { message } = await $fetch(`/api/users/${userData.username}`, {
      method: 'post',
      body
    });
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <UForm :state="userData" :validate="validate" class="login" @submit="handleLoginFormSubmit">
    <h1>Вход в систему</h1>
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
.login {
  max-width: 340px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  flex-grow: 1;
  justify-content: center;
  gap: 50px;

  h1 {
    font-size: 20px;
    text-align: center;
  }

  .login__input-group {
    position: relative;
    flex-grow: 0;

    &:focus-within {
      .login__title {
        top: -1.8rem;
      }
    }

    .login__title {
      position: absolute;
      top: 0.2rem;
      left: 8px;
      z-index: 3;
      transition: top 0.3s ease;

      &_up {
        top: -1.8rem;
      }
    }

    .login__password-eye {
      background-image: url('~/assets/images/eye-closed.svg');
      width: 25px;
      height: 25px;
      background-size: 100% 100%;
      position: absolute;
      top: 4px;
      right: 10px;

      &_opened {
        background-image: url('~/assets/images/eye-opened.svg');
      }
    }
  }

  .login__submit-btn {
    margin: 0 auto;
  }
}
</style>
