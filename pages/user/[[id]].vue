<script lang="ts" setup>
import {navigateTo, useRoute} from "#imports";
import {useAuthStore} from "~/store/auth";
import {useFetchWithHeader} from "~/composable/fetch";

const route = useRoute()
const auth = useAuthStore()


if (!route.params.id && !auth.user)
  await navigateTo({query: {r: route.path}, path: '/login'})

const id = route.params.id ? parseInt(typeof route.params.id === 'string' ? route.params.id : route.params.id[0]) : auth.user.id


const {data, error} = await useFetchWithHeader('/api/user/' + id)
</script>

<template>
  <div v-if="!error" class="xl:px-48 flex flex-col xl:flex-row space-y-10 xl:space-y-0 xl:space-x-10">
    <div class="w-64 xl:mr-32 mr-0">
      <div class="p-5 border-2 text-center space-y-2">
        <h2 class="text-lg font-bold">{{ data.user.name }}</h2>
        <h3 class="text-md font-light">{{ $t('profile.createdAt', {date: $d(data.user.createdAt)}) }}</h3>
        <div>
          <DisabilityTag v-for="d in data.user.disabilitys" :icon="d.disability.icon" :name="d.disability.name"
                         :trans_name="d.disability.trans_name" :verified="d.verified" class="ml-1 mr-1"/>
        </div>
      </div>
    </div>
    <div class="w-auto flex-grow space-y-2.5">
      <div v-for="comment in data.user.comments" class="flex space-x-10 py-5 border-2">
        <div class="pl-5 item w-52">
          <h3 class="text-lg font-bold">{{ comment.city.name }}</h3>
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
