<template>
  <h1>profile</h1>
</template>
<script lang="ts" setup>

const router = useRouter()
definePageMeta({
  middleware: "auth"
})
</script>
