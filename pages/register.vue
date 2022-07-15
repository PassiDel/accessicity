<script lang="ts" setup>
import {definePageMeta, defineWebPagePartial, navigateTo, ref, useFetch, useRoute, useSchemaOrg} from "#imports";
import {useAuthStore} from "~/store/auth";
import useVuelidate from "@vuelidate/core";
import {checked, email as _email, maxLength, minLength, required} from "~/utils/i18n-validators";
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";

definePageMeta({
  layout: 'auth',
  description: 'Register an account',
  title: 'Register',
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
const name = ref('')
const email = ref('')
const password = ref('')
const accept = ref(false)
const i18n = useI18n()
const v$ = useVuelidate({
  name: {
    required: required(i18n),
    maxLength: maxLength(i18n, 190),
  },
  email: {
    required: required(i18n),
    maxLength: maxLength(i18n, 190),
    email: _email(i18n)
  },
  password: {
    required: required(i18n),
    minLength: minLength(i18n, 8)
  },
  accept: {
    required: required(i18n),
    checked: checked(i18n)
  }
}, {name, email, password, accept})

const loading = ref(false)
const authError = ref<true | Error>(null)

const submit = async () => {
  authError.value = null
  loading.value = true
  const valid = await v$.value.$validate()
  if (!valid) {
    return
  }

  const {data: result, error} = await useFetch('/api/register', {
    method: 'POST',
    body: {
      name: name.value,
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

  navigateTo(redirect === '/register' ? '' : redirect)

}
</script>

<template>
  <div class="mx-auto w-full sm:w-96 text-center">
    <h1 class="text-5xl font-light my-10 text-primary">{{ $t('register.title') }}</h1>
    <InputField v-model:model="name" :name="$t('input.name')" :v="v$.name" type="text"/>
    <InputField v-model:model="email" :name="$t('input.email')" :v="v$.email" type="email"/>
    <InputField v-model:model="password" :name="$t('input.password')" :v="v$.password" type="password"/>
    <div class="h-[50px] mb-4 -mt-4">
      <div
          class="w-full bg-transparent text-lg text-start"
      >
        <input id="accept" v-model="accept" type="checkbox" @blur="v$.accept.$touch()">
        <label class="font-light text-md text-gray-900 ml-5" for="accept">{{ $t('register.accept_terms') }}</label>
      </div>
      <div v-for="error of v$.accept.$errors" :key="error.$uid" class="input-errors">
      <span class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
        {{ error.$message }}
      </span>
      </div>
    </div>
    <p class="flex h-6 items-center font-medium tracking-wide text-red-500 text-m mt-1 ml-1">
      <span v-if="authError">{{ authError.data?.statusMessage ?? i18n.t('validations.error') }}</span>
    </p>
    <div class="w-full flex space-x-5">
      <button :disabled="loading || v$.$invalid"
              class="p-3 w-auto flex-grow
            bg-yellow-400 disabled:bg-yellow-600
            dark:bg-white dark:disabled:bg-gray-500
            text-primary
            font-bold
            rounded cursor-pointer disabled:cursor-not-allowed "
              @click.prevent="submit">{{ $t('register.button') }}
      </button>
      <div v-if="loading" class="w-9 place-items-center flex">
        <Spinner/>
      </div>
    </div>
    <p class="mt-10">
      <NuxtLink :to="{query: {r: redirect}, path: '/login'}">{{ $t('register.account') }}<span
          class="duration-300 ease-out hover:text-primary font-bold underline">{{ $t('register.login') }}</span>
      </NuxtLink>
    </p>
  </div>
</template>
