<script lang="ts" setup>
import {navigateTo, ref, useRoute} from "#imports";
import {useAuthStore} from "~/store/auth";
import {useFetchWithHeader} from "~/composable/fetch";
import useVuelidate from "@vuelidate/core";
import {maxLength, minLength, required} from "~/utils/i18n-validators";
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";
import CommentList from "~/components/CommentList.vue";

const route = useRoute()
const auth = useAuthStore()


if (!route.params.id && !auth.user)
  await navigateTo({query: {r: route.path}, path: '/login'})

const id = route.params.id ? parseInt(typeof route.params.id === 'string' ? route.params.id : route.params.id[0]) : auth.user.id

const {data, error, refresh} = await useFetchWithHeader('/api/user/' + id)

const isUser = auth.user && auth.user.id === id
const editMode = ref(false)

const editData = ref({
  name: data.value.user.name,
  password: ''
})

const i18n = useI18n()
const v$ = useVuelidate({
  editData: {
    name: {
      required: required(i18n),
      maxLength: maxLength(i18n, 190),
    },
    password: {
      required: required(i18n),
      minLength: minLength(i18n, 8)
    }
  }
}, {editData})

const openEditMode = () => {
  editData.value.name = data.value.user.name
  editData.value.password = ''
  v$.value.$reset()

  editMode.value = true
}
const save = async () => {
  const valid = await v$.value.$validate()
  if (!valid) {
    return
  }

  const {error: postError} = await useFetchWithHeader('/api/user', {
    method: 'POST',
    body: {
      name: editData.value.name,
      password: editData.value.password
    }
  })

  if (postError.value)
    return console.log(postError.value)

  await refresh()
  auth.user.name = data.value.user.name
  editMode.value = false
}
</script>

<template>
  <div v-if="!error" class="xl:px-48 flex flex-col xl:flex-row space-y-10 xl:space-y-0 xl:space-x-10">
    <div class="w-64 xl:mr-32 mr-0 shrink-0">
      <div v-if="!editMode" class="p-5 border-2 text-center space-y-2">
        <h2 class="text-lg font-bold">{{ data.user.name }}</h2>
        <h3 v-if="isUser" class="text-lg">{{ data.user.email }}</h3>
        <h3 class="text-md font-light">{{ $t('profile.createdAt', {date: $d(data.user.createdAt)}) }}</h3>
        <div>
          <DisabilityTag v-for="d in data.user.disabilitys" :icon="d.disability.icon" :name="d.disability.name"
                         :trans_name="d.disability.trans_name" :verified="d.verified" class="m-1"/>
          <button v-if="isUser" class="p-2 px-3 rounded bg-primary hover:bg-primarydark text-light"
                  @click.prevent="openEditMode()">{{ $t('profile.edit') }}
          </button>
        </div>
      </div>
      <div v-else class="p-5 border-2 text-center">
        <InputField v-model:model="editData.name" :name="$t('input.name')" :v="v$.editData.name" type="text"/>
        <InputField v-model:model="editData.password" :name="$t('input.password')" :v="v$.editData.password"
                    type="password"/>
        <div>
          <DisabilityTag v-for="d in data.user.disabilitys" :icon="d.disability.icon" :name="d.disability.name"
                         :trans_name="d.disability.trans_name" :verified="d.verified" class="ml-1 mr-1"/>
          <button :disabled="v$.$invalid"
                  class="p-2 px-3 rounded bg-green-500 hover:bg-green-600 disabled:bg-green-800 cursor-pointer disabled:cursor-not-allowed text-light"
                  @click.prevent="save()">{{ $t('profile.save') }}
          </button>
          <button class="p-2 px-3 ml-3 rounded bg-gray-500 hover:bg-gray-600 text-light"
                  @click.prevent="editMode = false">{{ $t('profile.cancel') }}
          </button>
        </div>
      </div>
    </div>
    <CommentList :comments="data.user.comments" :user="data.user" class="flex-grow space-y-2.5"/>
  </div>
  <div v-else>
    <h1 class="dark:text-white">{{ error.data?.statusMessage ?? error.message }}</h1>
  </div>
</template>

<style scoped>

</style>
