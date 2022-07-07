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
  <div v-if="!error">
    <p class="dark:text-white">{{ data.user }}</p>
    <DisabilityTag v-for="d in data.user.disabilitys" :icon="d.disability.icon" :name="d.disability.name"
                   :trans_name="d.disability.trans_name" :verified="d.verified" class="ml-1 mr-1"/>
  </div>
  <div v-else>
    <h1 class="dark:text-white">{{ error.data?.statusMessage ?? error.message }}</h1>
  </div>
</template>

<style scoped>

</style>
