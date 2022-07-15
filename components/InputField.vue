<script lang="ts" setup>
import {ref, watch} from "#imports";
import {Validation} from "@vuelidate/core";

const {model, type, name, placeholder, v, icon} = defineProps<{
  model: String,
  type: String,
  name?: String,
  placeholder?: String,
  icon?: String,
  v?: Validation
}>()

const emit = defineEmits(['update:model'])

const _model = ref(model)
watch(_model, mo => {
  emit('update:model', mo)
})
// TODO: add icons, based on prop
</script>

<template>
  <div class="flex flex-col mb-4">
    <label class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
           for="name">
      {{ name ?? placeholder ?? '' }}
    </label>

    <div class="relative">

      <div class="absolute flex border border-transparent left-0 top-0 h-full w-10">
        <div
            class="flex items-center justify-center rounded-tl rounded-bl z-10 bg-gray-100 text-gray-600 text-lg h-full w-full">
          <span class="material-icons">{{ icon || 'edit' }}</span>
        </div>
      </div>

      <input v-model="_model"
             :class="{ 'border-red-500': v?.$error }"
             :name="v?.$path ?? name"
             :placeholder="placeholder ?? name ?? ''"
             :type="type"
             class="text-sm sm:text-base relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12"
             @blur="v?.$touch()">

    </div>
    <div v-for="error of v?.$errors" :key="error.$uid" class="input-errors">
    <span class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
			{{ error.$message }}
		</span>
    </div>

  </div>
</template>
