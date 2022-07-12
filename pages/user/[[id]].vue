<script lang="ts" setup>
import {navigateTo, ref, useRoute} from "#imports";
import {useAuthStore} from "~/store/auth";
import {useFetchWithHeader} from "~/composable/fetch";
import useVuelidate from "@vuelidate/core";
import {minLength, required} from "~/utils/i18n-validators";
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";

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
      required: required(i18n)
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
    <div class="w-64 xl:mr-32 mr-0">
      <div v-if="!editMode" class="p-5 border-2 text-center space-y-2">
        <h2 class="text-lg font-bold">{{ data.user.name }}</h2>
        <h3 v-if="isUser" class="text-lg">{{ data.user.email }}</h3>
        <h3 class="text-md font-light">{{ $t('profile.createdAt', {date: $d(data.user.createdAt)}) }}</h3>
        <div>
          <DisabilityTag v-for="d in data.user.disabilitys" :icon="d.disability.icon" :name="d.disability.name"
                         :trans_name="d.disability.trans_name" :verified="d.verified" class="ml-1 mr-1"/>
          <button v-if="isUser" class="p-2 px-3 rounded bg-primary hover:bg-primarydark text-light"
                  @click.prevent="openEditMode()">Edit
          </button>
        </div>
      </div>
      <div v-else class="p-5 border-2 text-center space-y-2">
        <InputField v-model:model="editData.name" :name="$t('input.name')" :v="v$.editData.name" icon="badge"
                    type="text"/>
        <InputField v-model:model="editData.password" :name="$t('input.password')" :v="v$.editData.password" icon="key"
                    type="password"/>
        <div>
          <DisabilityTag v-for="d in data.user.disabilitys" :icon="d.disability.icon" :name="d.disability.name"
                         :trans_name="d.disability.trans_name" :verified="d.verified" class="ml-1 mr-1"/>
          <button :disabled="v$.$invalid"
                  class="p-2 px-3 rounded bg-green-500 hover:bg-green-600 disabled:bg-green-800 cursor-pointer disabled:cursor-not-allowed text-light"
                  @click.prevent="save()">Save
          </button>
          <button class="p-2 px-3 ml-3 rounded bg-gray-500 hover:bg-gray-600 text-light"
                  @click.prevent="editMode = false">Cancel
          </button>
        </div>
      </div>
    </div>
    <div class="w-auto flex-grow space-y-2.5">
      <div v-for="comment in data.user.comments" class="flex space-x-10 py-5 border-2">
        <div class="pl-5 item w-52">
          <NuxtLink :to="{path: '/explore/' + comment.city.slug}">
            <h3 class="text-lg font-bold">{{ comment.city.name }}</h3>
          </NuxtLink>
          <p>{{ $d(comment.createdAt) }}</p>
        </div>
        <div class="item w-auto flex-grow">
          <h4 class="text-md font-bold">{{ comment.title }}</h4>
          {{ comment.message }}
        </div>
        <div class="item w-52">
          <p class="">
            <DisabilityTag class="ml-1 mr-1" icon="accessibility" name="human" trans_name="disability.wheelchair"
                           verified="true"/>
            <Stars :value="comment.rating"/>
          </p>
          <p v-for="r in comment.disability" class="place-items-center my-2">
            <DisabilityTag :icon="r.disability.icon" :name="r.disability.name"
                           :trans_name="r.disability.trans_name"
                           :verified="data.user.disabilitys.findIndex(d => d.disability.id === r.disability.id) !== -1"
                           class="ml-1 mr-1"/>
            <Stars :value="r.rating"/>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h1 class="dark:text-white">{{ error.data?.statusMessage ?? error.message }}</h1>
  </div>
</template>

<style scoped>

</style>
