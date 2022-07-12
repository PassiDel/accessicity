<script setup lang="ts">

import {definePageMeta, defineWebPagePartial, navigateTo, ref, useFetch, useRoute, useSchemaOrg} from "#imports";
import {useAuthStore} from "~/store/auth";
import useVuelidate from "@vuelidate/core";
import {email as _email, minLength, required} from "~/utils/i18n-validators";
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";

definePageMeta({
  layout: 'auth',
  description: 'Login with an account',
  title: 'Login',
  image: '/image.jpgggg',
  middleware: 'noauth'
});
useSchemaOrg([
  defineWebPagePartial({
    image: '/image.jpgggg',
  })
])

const route = useRoute()
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

const loading = ref(false)
const authError = ref<true | Error>(null)

const submit = async () => {
  loading.value = true
  const valid = await v$.value.$validate()
  if (!valid) {
    return
  }

  const {data: result, error} = await useFetch('/api/login', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value
    }
  })
  authError.value = error.value

  if (error.value) {
    v$.value.$reset()
    return
  }

  auth.login(result.value)
  loading.value = false

  const redirect = route.query.r && (typeof route.query.r === 'string' ? route.query.r : route.query.r[0]) || '/'

  navigateTo(redirect === '/login' ? '' : redirect)

}
</script>

<template>
  <div>
    <h1>test</h1>
    <h2 v-if="auth.user" class="dark:text-white">Logged in</h2>
    <InputField v-model:model="email" :name="$t('input.email')" :v="v$.email" icon="alternate_email" type="email"/>
    <br>
    <InputField v-model:model="password" :name="$t('input.password')" :v="v$.password" icon="key" type="password"/>
    <br>
    <InputField v-model:model="accept" :name="$t('input.password')" :v="v$.accept" type="checkbox"/>
    <br>
    <span v-if="authError" class="flex items-center font-medium tracking-wide text-red-500 text-m mt-1 ml-1">
			{{ authError.data.statusMessage }}
		</span>
    <button :disabled="loading || v$.$invalid"
            class="p-3 dark:bg-white dark:disabled:bg-gray-500 rounded cursor-pointer disabled:cursor-not-allowed "
            @click.prevent="submit">submit
    </button>
    <div v-if="loading" class="m-3">
      <Spinner/>
    </div>
  </div>
</template>

<style scoped>

</style>
