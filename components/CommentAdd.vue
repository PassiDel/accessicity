<script lang="ts" setup>


import {ref, useFetch} from "#imports";
import useVuelidate from "@vuelidate/core";
import {maxLength, minValue, required} from "~/utils/i18n-validators";
// noinspection TypeScriptCheckImport
import {useI18n} from "vue-i18n";
import {useFetchWithHeader} from "~/composable/fetch";

const {slug} = defineProps<{
  slug: string
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const {data: disabilities} = await useFetch('/api/disability')
const form = ref({
  title: '',
  message: '',
  rating: [1]
})
disabilities.value.forEach(() => form.value.rating.push(0))

const i18n = useI18n()
const v$ = useVuelidate({
  form: {
    title: {
      required: required(i18n),
      maxLength: maxLength(i18n, 254),
    },
    message: {
      required: required(i18n)
    },
    rating: [
      {
        required: required(i18n),
        minValue: minValue(i18n, 1)
      }
    ]
  }
}, {form})
const loading = ref(false)

const submit = async () => {
  loading.value = true
  const valid = await v$.value.$validate()
  if (!valid) {
    return
  }

  const {title, message, rating: ratings} = form.value
  const rating = ratings[0]
  const disability = ratings.slice(1).map((r, i) => ({
    rating: r,
    disabilityId: disabilities.value[i].id
  })).filter(r => r.rating > 0)
  const {data: result, error} = await useFetchWithHeader(`/api/city/${slug}/comment`, {
    method: 'POST',
    body: {
      title,
      message,
      rating,
      disability
    }
  })

  v$.value.$reset()
  if (error.value) {
    setTimeout(() => {
      loading.value = false
    }, 1000)
    return
  }

  emit('success')
  form.value = {
    title: '',
    message: '',
    rating: [1]
  }
  disabilities.value.forEach(() => form.value.rating.push(0))

  loading.value = false
}
</script>

<template>
  <div class="w-full p-5 border-2 my-2 dark:bg-primary">
    <h3 class="text-lg font-bold text-center dark:text-white">{{ $t('explore.add_comment') }}</h3>
    <InputField v-model:model="form.title" :name="$t('input.title')" :v="v$.form.title" type="text"/>
    <InputField v-model:model="form.message" :name="$t('input.message')" :v="v$.form.message" type="textarea"/>

    <div>
      <DisabilityTag :name="$t('icon.accessibility')" class="ml-1 mr-1" icon="accessibility"
                     verified="true"/>
      <Stars v-model:value="form.rating[0]" clickable @update:value="v$.form.rating.$touch()"/>
    </div>
    <div v-for="error of v$.form.rating.$errors" :key="error.$uid" class="input-errors">
    <span class="flex text-start font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
			{{ error.$message }}
		</span>
    </div>
    <div v-for="(d, i) in disabilities" v-if="disabilities" class="mt-2">
      <DisabilityTag :icon="d.icon" :name="d.name" :trans_name="d.trans_name" class="ml-1 mr-1"
                     verified="true"/>
      <Stars v-model:value="form.rating[i + 1]" clickable/>
    </div>
    <div class="w-full flex space-x-5 mt-5">
      <button :disabled="loading || v$.$invalid"
              class="p-3 w-auto flex-grow
            bg-button disabled:bg-yellow-600
            dark:bg-buttondark dark:disabled:bg-gray-500
            text-primary
            font-bold
            rounded cursor-pointer disabled:cursor-not-allowed "
              @click.prevent="submit">{{ $t('explore.send') }}
      </button>
      <div v-if="loading" class="w-9 place-items-center flex">
        <Spinner/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
