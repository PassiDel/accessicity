<script lang="ts" setup>
import {useRoute} from "#imports";

const route = useRoute()
</script>
<template>
  <main class="flex-1 overflow-y-auto p-5">
    <div class="w-full overflow-x-hidden">
      <h1 class="dark:text-white text-3xl text-center mb-10">
        {{ route.meta.title.startsWith('t:') ? $t(route.meta.title.slice(2)) : route.meta.title }}</h1>
      <div class="lg:w-1/2 mx-auto">
        <slot/>
      </div>
    </div>
  </main>
</template>
