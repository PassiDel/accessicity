<script lang="ts" setup>
import {useRoute} from "#imports";
import {useFetchWithHeader} from "~/composable/fetch";

const route = useRoute()
const citySlug = typeof route.params.city === 'string' ? route.params.city : route.params.city[0]

const {data: city} = await useFetchWithHeader('/api/city/' + citySlug)
</script>

<template>
  <h1>{{ city.name }}</h1>
</template>

<style scoped>

</style>
