<script lang="ts" setup>
import {Validation} from "@vuelidate/core";

const {model, type, name, placeholder, v} = defineProps<{
  model: string,
  type: string,
  name?: string,
  placeholder?: string,
  v?: Validation
}>()

const emit = defineEmits(['update:model'])
</script>

<template>
  <div :class="{'h-[50px]': type !== 'textarea'}"
       class="my-8">
    <div
        :class="{'border-red-500': v?.$errors.length > 0}"
        class="field w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-primary dark:focus-within:border-primarydark"
    >
      <input
          v-if="type !== 'textarea'"
          :value="model"
          @input="e => {model = e.target.value; emit('update:model', model)}"
          :name="v?.$path ?? name"
          :type="type"
          class="w-full border-none bg-transparent dark:text-white outline-none placeholder:italic focus:outline-none"
          placeholder=" "
          @blur="v?.$touch()"
      />
      <textarea v-else
                :value="model"
                :name="v?.$path ?? name"
                class="w-full border-none bg-transparent dark:text-white outline-none placeholder:italic focus:outline-none max-h-48 min-h-[56px]  resize-y"
                placeholder=" "
                @blur="v?.$touch()"
                @input="e => {model = e.target.value; emit('update:model', model)}"
      >
      </textarea>
      <label :for="v?.$path ?? name"
             class="z-[-1] absolute left-0 font-light origin-top-left dark:text-white transition-transform duration-300">{{
          placeholder ?? name ?? ''
        }}</label>

    </div>

    <div v-for="error of v?.$errors" :key="error.$uid" class="input-errors">
    <span class="flex text-start font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
			{{ error.$message }}
		</span>
    </div>
  </div>
</template>

<style scoped>

/* from https://www.youtube.com/watch?v=yrrw6KdGuxc */
.field:focus-within label,
input:not(:placeholder-shown) + label,
textarea:not(:placeholder-shown) + label {
  @apply -translate-y-6 scale-75
}
</style>
