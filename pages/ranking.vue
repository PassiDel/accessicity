<script lang="ts" setup>

import {computed, ref, useFetch} from "#imports";
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";


const page = ref(1)
const sort = ref([{id: 0, sort: 1}])

const sortBy = computed(() => {
  const s = sort.value.find(v => v.sort !== 0)
  if (s === undefined)
    return {id: 0, sort: 0}

  return s
})


const {
  data,
  pending,
  refresh
} = await useFetch(() => `/api/city/ranking?page=${page.value}&sortBy=${sortBy.value.id}&dir=${sortBy.value.sort < 0 ? 'asc' : 'desc'}`)

// @ts-ignore
data.value.disabilities.forEach(d => sort.value.push({id: d.id, sort: 0}))

const update = i => {

  sort.value = sort.value.map(s => {
    if (s.id !== i)
      s.sort = 0
    return s
  })
}

const i18n = useI18n()
const title = (based: number | undefined) => {
  if (based === undefined)
    return i18n.t('ranking.based.none')

  if (based === 1)
    return i18n.t('ranking.based.one')

  return i18n.t('ranking.based.some', {based})
}
</script>

<template>
  <div class="w-full overflow-x-hidden">
    <h1 class="dark:text-white text-3xl text-center mb-10">{{ $t('header.ranking') }}</h1>
    <div v-if="data" class="overflow-x-auto">
      <table class="mx-auto table-auto bg-gray-50 dark:bg-primarydark rounded-xl">
        <thead>
        <tr>
          <th>{{ $t('ranking.city') }}</th>
          <th>
            <DisabilityTag :name="$t('icon.accessibility')" class="float-left mr-3"
                           icon="accessibility"
                           verified="true"/>
            <Sort v-model:sort="sort.find(s => s.id === 0).sort" @update:sort="update(0)"/>
          </th>
          <th v-for="d in data.disabilities" class="">
            <DisabilityTag :icon="d.icon" :name="d.name"
                           :trans_name="d.trans_name"
                           :verified="true"
                           class="float-left mr-3"
            />
            <Sort v-model:sort="sort.find(s => s.id === d.id).sort" @update:sort="update(d.id)"/>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in data.rankings">
          <td>
            <NuxtLink :to="{path: '/explore/' + r.city.slug}" class="hover:underline">
              {{ r.city.name }}
            </NuxtLink>
          </td>
          <td :title="title(r.basedOn)" class="cursor-default">{{ parseFloat(r.value).toFixed(2) + ' / 5' }}</td>
          <td v-for="d in data.disabilities"
              :title="title(r.city.ranking.find(dd => dd.disability.id === d.id)?.basedOn)" class="cursor-default">
            {{
              r.city.ranking.find(dd => dd.disability.id === d.id)?.value ? parseFloat(r.city.ranking.find(dd => dd.disability.id === d.id).value).toFixed(2) + ' / 5' : '-'
            }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
td, th:first-child {
  @apply dark:text-white
}

tr {
  @apply border-t-2
}

td, th {
  @apply p-5 border-r-2 text-center
}

td:not(:first-child), th:not(:first-child) {
  @apply w-32
}

th:not(:first-child) {
  @apply py-0
}

td:last-child, th:last-child, thead tr:first-child {
  @apply border-none
}
</style>
