<script setup lang="ts">

import {definePageMeta, defineWebPagePartial, useSchemaOrg} from "#imports";

definePageMeta({
  layout: 'auth',
  description: 'Login with an account',
  title: 'Login',
  image: '/image.jpgggg'
});
useSchemaOrg([
  defineWebPagePartial({
    image: '/image.jpgggg',
  })
])
</script>

<template>
<h1>test</h1>
</template>

<style scoped>

</style>
