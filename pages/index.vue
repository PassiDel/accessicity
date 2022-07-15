<script setup lang="ts">
import {definePageMeta, ref, watch} from "#imports";
import {useFetchWithHeader} from "~/composable/fetch";
import "leaflet/dist/leaflet.css"
import {LGeoJson, LMap, LMarker, LTileLayer} from '@vue-leaflet/vue-leaflet';

definePageMeta({
  title: 'Index'
})


const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const attribution = ref('Kartendaten &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende')

const ready = ref(false)
const map = ref(null)
const zoom = 6
const center = {"lat": 51.549751017014195, "lng": 9.865722656250002}

const selected = ref(-1)
const {pending, data: result, refresh} = await useFetchWithHeader('/api/top5')
watch(selected, (l, old) => {
  if (l === old)
    return;
  if (pending.value || !ready.value) {
    selected.value = old
    return
  }
  if (l >= 0) {
    const {north, east, south, west} = result.value[l].city
    const bounds = [
      [north, west],
      [south, east]
    ]

    map.value.leafletObject.fitBounds(bounds, {animate: true, duration: 3})
    return
  }
  map.value.leafletObject.flyTo(center, zoom, {animate: true, duration: 1})
})
// TODO: i18n
</script>

<template>
  <div class="text-center xl:mx-32" @click.stop="selected = -1">
    <div class="bg-amber-100 xl:-mx-[9.25rem] -mx-5 -mt-5 mb-5 p-10">
      <h1 class="text-primary font-bold text-4xl">Noch keinen passenden Ort für deine Reise gefunden?</h1>
      <h2 class="text-text font-medium text-xl mt-5">Finde hier dein perfektes Reiseziel!</h2>
      <input class="mt-5 text-center p-2" placeholder="Suche"/>
    </div>
    <h2 class="font-bold text-3xl">Top 5</h2>
    <div
        class="flex flex-col xl:flex-row items-center xl:items-start justify-between space-y-5 xl:space-y-0 xl:space-x-5 mt-5">
      <div v-for="(city, i) in result" :class="{'bg-green-500': selected === i}"
           class="border border-text w-48 flex-inline"
           @click.stop="selected = i"
      >
        <div class="h-32">
          <l-map
              :center="{lat: city.city.loc_lat, lng: city.city.loc_lon}"
              :options="{zoomControl: false, doubleClickZoom: false, scrollWheelZoom: false, dragging: false, trackResize: false, boxZoom: false, keyboard: false}"
              :zoom="8"
          >
            <l-tile-layer :attribution="attribution" :url="url"></l-tile-layer>
            <l-geo-json
                :geojson="{type: 'FeatureCollection', features: [city.city.outline]}"
            />
          </l-map>
        </div>
        <h3 class="font-bold mt-2 h-auto flex-grow h-[3.5rem]">{{ city.city.name }}</h3>
        <p class="place-items-center my-2">
          <DisabilityTag :verified="true" class="ml-1 mr-1"
                         icon="accessibility"
                         name="Accessibility"/>
          <Stars :value="parseInt(city.value)"/>
        </p>
      </div>
    </div>
    <div class="w-full h-[33rem] mt-5">
      <l-map ref="map"
             @ready="ready = true; map.leafletObject.flyTo(center, zoom)"
      >
        <l-tile-layer :attribution="attribution" :url="url"></l-tile-layer>
        <l-marker v-for="city in result" :lat-lng="[city.city.loc_lat, city.city.loc_lon]"></l-marker>
        <l-geo-json
            v-if="selected >= 0"
            :geojson="{type: 'FeatureCollection', features: [result[selected].city.outline]}"
        ></l-geo-json>
      </l-map>
    </div>
    <div v-if="selected > -1">
      <CommentList :city="result[selected].city" :comments="result[selected].city.comments" class="space-y-2.5"/>
    </div>
  </div>
</template>

<style scoped>

</style>
