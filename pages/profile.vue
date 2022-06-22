<template>
  <h1>profile</h1>
</template>
<script setup lang="ts">

const router = useRouter()
definePageMeta({
  middleware: "auth"
})
</script>
