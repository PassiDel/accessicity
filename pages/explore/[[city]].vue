<script lang="ts" setup>
import {definePageMeta, ref, useLazyFetch, useRoute, useRouter, watch} from "#imports";
import "leaflet/dist/leaflet.css"
import {LControlZoom, LGeoJson, LMap, LTileLayer} from '@vue-leaflet/vue-leaflet';
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";


definePageMeta({
  layout: 'full',
})

const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const i18n = useI18n();
const attribution = i18n.t('map.attribution')

const ready = ref(false)
const map = ref(null)
const zoom = 6
const center = {"lat": 51.549751017014195, "lng": 9.865722656250002}


const route = useRoute()
const routeName = route.name
const router = useRouter()
const citySlug = route.params.city ? (typeof route.params.city === 'string' ? route.params.city : route.params.city[0]) : ''

const search = ref(citySlug)
const _search = ref(citySlug)
const selected = ref(false)

// from https://gist.github.com/MexsonFernandes/d99d68160c3f256298b6d20228595f78
let debounceTimeout = null
const debounceSearch = (callback: Function, timeout: number = 500) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(callback, timeout);
}

const {data: result, pending, refresh} = await useLazyFetch(() => `/api/city/search?q=${_search.value}`)

const update = () => {
  if (search.value === '')
    return
  _search.value = search.value
  console.log(_search.value, result)
}
const city = ref(citySlug ? {slug: citySlug, id: 0, name: citySlug} : null)

const {data} = await useLazyFetch(() => `/api/city/${city.value?.slug}/comments`)
const {data: outlineData} = await useLazyFetch(() => `/api/city/${city.value?.slug}`)

const selectCity = async c => {
  city.value = c
  search.value = c.name
  selected.value = false
  history.pushState({}, null, '/explore/' + c.slug)
}

watch(router.currentRoute, n => {
  if (n.name !== routeName)
    return

  const {city: cityId} = n.params
  console.log(cityId)

  if (!cityId) {
    city.value = null
    _search.value = null
    search.value = null
    selected.value = false
    data.value = null
    outlineData.value = null
    result.value = null
    return
  }

  const id = typeof cityId === 'string' ? cityId : cityId[0]

  city.value = {slug: id, id: 0, name: id}
})

const fitToBounds = () => {
  const o = outlineData.value;
  // @ts-ignore
  if (!o || !o.north)
    return
  // @ts-ignore
  const {north, east, south, west, name} = o
  const bounds = [
    [north, west],
    [south, east]
  ]

  map.value.leafletObject.fitBounds(bounds, {animate: true, duration: 3})
}

watch(outlineData, fitToBounds)
</script>

<template>
  <div class="w-full h-full relative">
    <ClientOnly>
      <l-map ref="map" :options="{zoomControl: false}"
             @ready="ready = true; map.leafletObject.flyTo(center, zoom); outlineData && fitToBounds()"
      >
        <l-tile-layer :attribution="attribution" :url="url"></l-tile-layer>
        <l-control-zoom position="topright"></l-control-zoom>
        <l-geo-json v-if="outlineData"
                    :geojson="{type: 'FeatureCollection', features: [outlineData.outline]}"
        />
      </l-map>
    </ClientOnly>
    <div :class="{'hfull overflow-y-auto': search || selected}"
         class="absolute top-0 left-0 w-96 z-[500] h-20 bg-gray-50 dark:bg-primarydark rounded-br-lg p-5 transition-[height] duration-300">
      <input v-model="search" :placeholder="$t('search')"
             class="relative w-full text-center p-2 border-2 border-primary rounded-tl rounded-tr dark:bg-gray-800 dark:text-white"
             type="search" @blur="selected = !!search" @focus="selected = true; search = _search"
             @input="debounceSearch(update, 1000)"/>
      <div v-if="selected && result && result.length > 0"
           class="flex flex-col space-y-1 p-2 w-full bg-white border-2 border-t-0 border-primary rounded-br rounded-bl dark:bg-gray-800 dark:text-white">
        <button v-for="c in result"
                :class="{'bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:hover:bg-gray-400': city && city.slug === c.slug}"
                class="p-2 bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded ease-out border-primary cursor-pointer text-start"
                tabindex="0"
                @click="selectCity(c)">
          {{ c.name }}
        </button>
      </div>
      <CommentList v-else-if="search" :city="city" :comments="data" :forceSmall="true" class="space-y-2.5"/>
      <!-- TODO: add disability filtering-->
    </div>
  </div>
</template>

<style scoped>
.hfull {
  @apply h-full;
}
</style>
