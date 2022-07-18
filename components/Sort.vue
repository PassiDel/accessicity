<script lang="ts" setup>

const {sort} = defineProps({
  sort: {
    default: 0,
    type: Number
  }
})
const emit = defineEmits(['update:sort'])

</script>

<template>
  <div class="flex flex-col rounded-xl border-2 bg-gray-100">
    <button :class="{'selected': sort < 0}"
            class="sortBtn"
            @click="sort = -1; emit('update:sort', sort)">
      <span class="material-icons" style="font-size: .875rem">expand_less</span>
    </button>
    <button :class="{'selected': sort > 0}"
            class="sortBtn"
            @click="sort = 1; emit('update:sort', sort)">
      <span class="material-icons" style="font-size: .875rem">expand_more</span>
    </button>
  </div>
</template>

<style scoped>
.sortBtn {
  @apply h-[18px] w-[36px] hover:bg-gray-200 rounded-b-xl
}

.sortBtn:first-child {
  @apply rounded-b-none rounded-t-xl
}

.sortBtn.selected {
  @apply font-bold text-white bg-button hover:bg-buttondark
}
</style>
