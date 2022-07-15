<script lang="ts" setup>

const {comments, user, city} = defineProps<{
  comments: {
    id: number,
    createdAt: Date,
    title: string,
    message: string,
    rating: number,
    city?: {
      slug: string,
      id: number,
      name: string
    },
    disability: {
      rating: number,
      disability: {
        id: number,
        name: string,
        trans_name?: string,
        slug: string,
        icon?: string
      }
    }[],
    author?: {
      id: number,
      name: string,
      disabilitys: {
        verified: boolean,
        createdAt: Date,
        disability: {
          id: number,
          slug: string,
          icon: string,
          trans_name: string,
          name: string
        }
      }[]
    }
  }[],
  user?: {
    id: number,
    name: string
  },
  city?: {
    slug: string,
    id: number,
    name: string
  },
}>()
</script>

<template>
  <div class="w-auto text-start dark:text-white">
    <div v-for="comment in comments"
         class="flex space-x-0 md:space-x-10 space-y-5 md:space-y-0 md:flex-row flex-col p-5 border-2 bg-gray-100 dark:bg-primarydark">
      <div class="w-52 shrink-0">
        <NuxtLink :to="{path: '/explore/' + comment.city?.slug ?? city.slug}">
          <h3 class="text-lg font-bold">{{ comment.city?.name ?? city.name }}</h3>
        </NuxtLink>
        <NuxtLink :to="{path: '/user/' + (comment.author ? comment.author.id : user.id)}">
          <h4 class="text-md italic">{{ (comment.author ? comment.author.name : user.name) }}</h4>
        </NuxtLink>
        <p class="my-2">
          <DisabilityTag v-for="r in (comment.author ?? user).disabilitys"
                         :icon="r.disability.icon" :name="r.disability.name"
                         :trans_name="r.disability.trans_name"
                         :verified="r.verified"
                         class="m-1"
                         style="font-size: .875rem"/>
        </p>
        <p>{{ $d(comment.createdAt) }}</p>
      </div>
      <div class="w-auto flex-grow">
        <h4 class="text-md font-bold">{{ comment.title }}</h4>
        {{ comment.message }}
      </div>
      <div class="w-48 shrink-0 self-center md:self-start">
        <p class="">
          <DisabilityTag class="ml-1 mr-1" icon="accessibility" name="human" trans_name="disability.wheelchair"
                         verified="true"/>
          <Stars :value="comment.rating"/>
        </p>
        <p v-for="r in comment.disability" class="place-items-center my-2">
          <DisabilityTag :icon="r.disability.icon" :name="r.disability.name"
                         :trans_name="r.disability.trans_name"
                         :verified="(comment.author ?? user).disabilitys.findIndex(d => d.disability.id === r.disability.id) !== -1"
                         class="ml-1 mr-1"/>
          <Stars :value="r.rating"/>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
