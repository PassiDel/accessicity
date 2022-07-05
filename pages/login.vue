<script setup lang="ts">

import {definePageMeta, defineWebPagePartial, ref, useFetch, useSchemaOrg} from "#imports";
import {useAuthStore} from "~/store/auth";
import {useFetchWithHeader} from "~/composable/fetch";
import useVuelidate from "@vuelidate/core";
import {email as _email, minLength, required} from "~/utils/i18n-validators";
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";

definePageMeta({
  layout: 'auth',
  description: 'Login with an account',
  title: 'Login',
  image: '/image.jpgggg'
});
useSchemaOrg([
  defineWebPagePartial({
    image: '/image.jpgggg',
  })
])

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const accept = ref(false)
const i18n = useI18n()
const v$ = useVuelidate({
  email: {
    required: required(i18n),
    email: _email(i18n)
  },
  password: {
    required: required(i18n),
    minLength: minLength(i18n, 8)
  },
  accept: {
    required: required(i18n)
  }
}, {email, password, accept})


const submit = async () => {
  const valid = await v$.value.$validate()
  if (!valid) {
    // notify user form is invalid
    alert('invalid')
    return
  }

  console.log(email.value, password.value)
  const {data: result} = await useFetch('/api/login', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value
    }
  })
  console.log(result.value)

  auth.login(result.value)

  const {data} = await useFetchWithHeader('/api/user')
  console.log(data)
}
</script>

<template>
  <div>
    <h1>test</h1>
    <h2 v-if="auth.user" class="dark:text-white">Logged in</h2>
    <InputField v-model:model="email" :name="$t('input.email')" :v="v$.email" type="email"/>
    <br>
    <InputField v-model:model="password" :name="$t('input.password')" :v="v$.password" type="password"/>
    <br>
    <InputField v-model:model="accept" :name="$t('input.password')" :v="v$.accept" type="checkbox"/>
    <br>
    <button :class="{'cursor-pointer': !v$.$invalid, 'cursor-not-allowed': v$.$invalid}"
            :disabled="v$.$invalid"
            class="p-3 dark:bg-white dark:disabled:bg-gray-500 rounded" @click.prevent="submit">submit
    </button>
  </div>
</template>

<style scoped>

</style>
