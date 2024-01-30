<script setup lang="ts">
const users = ref({});
const username = ref('');
const password = ref('');

const fetchUsers = async () => {
  const { data } = await useFetch('/api/users');
  return users.value = data;
};

fetchUsers();

const handleSubmit = async () => {
  useFetch('/api/users', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value
    }
  });
  
  fetchUsers();
}

</script>

<template>
  <div class="content">{{users}}
    <form @submit.prevent="handleSubmit">
      <label>Username
        <input v-model="username" type="text">
      </label>
      <br>
      <label>Password
        <input v-model="password" type="text">
      </label>
      <br>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style>
.content {
  text-align: center;
}
</style>