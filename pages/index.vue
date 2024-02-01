<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
// const users = ref({});
const username = ref('');
const password = ref('');

// const fetchUsers = async () => {
//   const { data } = await useFetch('/api/users');
//   users.value = data;
// };

// fetchUsers();

const handleSubmit = async () => {
  useFetch('/api/users', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value
    }
  });
  
  // fetchUsers();
  username.value = '';
  password.value = '';
}

</script>

<template>
  <div class="content">{{username}}
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
    <div class="editor">
      <Editor 
      api-key="j9zmlsfscynrcssyawis2dp00r22qej7ry4srjvz4k06rbo6"
      :init="{
        plugins: 'lists link image table code help wordcount autolink autosave media preview',
        toolbar_mode: 'sliding',
        language: 'ru'
      }"
    />
    </div>
  </div>
</template>

<style>
.content {
  text-align: center;
}

.editor {
  max-width: 1000px;
  margin: 0 auto;
}
</style>