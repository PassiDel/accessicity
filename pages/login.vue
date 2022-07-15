<script lang="ts" setup>

import {definePageMeta, defineWebPagePartial, navigateTo, ref, useFetch, useRoute, useSchemaOrg} from "#imports";
import {useAuthStore} from "~/store/auth";
import useVuelidate from "@vuelidate/core";
import {email as _email, maxLength, minLength, required} from "~/utils/i18n-validators";
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
const redirect = route.query.r && (typeof route.query.r === 'string' ? route.query.r : route.query.r[0]) || '/'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const i18n = useI18n()
const v$ = useVuelidate({
  email: {
    required: required(i18n),
    maxLength: maxLength(i18n, 190),
    email: _email(i18n)
  },
  password: {
    required: required(i18n),
    minLength: minLength(i18n, 8)
  }
}, {email, password})

const loading = ref(false)
const authError = ref<true | Error>(null)

const submit = async () => {
  authError.value = null
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
    setTimeout(() => {
      loading.value = false
    }, 1000)
    return
  }

  auth.login(result.value)
  loading.value = false


  navigateTo(redirect === '/login' ? '' : redirect)

}
</script>

<template>
  <div class="mx-auto p-16 pt-[0] shadow-xl rounded w-full sm:w-[36rem] text-center">
    <h1 class="text-5xl font-light my-10 text-primary dark:text-white">{{ $t('login.title') }}</h1>
    <InputField v-model:model="email" :name="$t('input.email')" :v="v$.email" type="email"/>
    <InputField v-model:model="password" :name="$t('input.password')" :v="v$.password" type="password"/>

    <p class="flex h-6 items-center font-medium tracking-wide text-red-500 text-m mt-1 ml-1">
      <span v-if="authError">{{ authError.data?.statusMessage ?? $t('validations.error') }}</span>
    </p>
    <div class="w-full flex space-x-5">
      <button :disabled="loading || v$.$invalid"
              class="p-3 w-auto flex-grow
            bg-button disabled:bg-yellow-600
            dark:bg-buttondark dark:disabled:bg-gray-500
            text-primary
            font-bold
            rounded cursor-pointer disabled:cursor-not-allowed "
              @click.prevent="submit">{{ $t('login.button') }}
      </button>
      <div v-if="loading" class="w-9 place-items-center flex">
        <Spinner/>
      </div>
    </div>
    <p class="mt-10 dark:text-white">
      <NuxtLink :to="{query: {r: redirect}, path: '/register'}">{{ $t('login.no_account') }} <span
          class="duration-300 ease-out hover:text-primary dark:hover:text-primarydark font-bold underline">{{
          $t('login.register_now')
        }}</span>
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>

</style>
