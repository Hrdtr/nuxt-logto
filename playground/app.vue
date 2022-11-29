<template>
  <div>
    <template v-if="isLoading">
      Redirecting...
    </template>
    <template v-else>
      <button v-if="isAuthenticated" @click="signIn('http://localhost:3000/?redirect=true')">
        Sign In
      </button>
      <div>
        isAuthenticated: {{ isAuthenticated }}
      </div>
      <div>
        accessToken: {{ accessToken }}
      </div>
      <div v-if="isAuthenticated">
        user: <pre>{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
      <button v-if="isAuthenticated" @click="signOut('http://localhost:3000/?postsignout=true')">
        Sign Out
      </button>
    </template>
  </div>
</template>

<script setup>
import { onMounted, useHandleSignInCallback, useLogto, useLazyAsyncData, ref, useRoute, watch, navigateTo } from '#imports'

const { signIn, signOut, fetchUserInfo, isAuthenticated, getAccessToken } = useLogto()

const isLoading = ref(false)
if (useRoute().query.redirect === 'true') {
  isLoading.value = true
  const { isLoading: loading } = useHandleSignInCallback()
  watch(loading, (val) => {
    isLoading.value = val
    if (!val) { navigateTo('/') }
  })
}

const accessToken = ref()
onMounted(async () => {
  if (isAuthenticated.value) {
    const token = await getAccessToken()
    accessToken.value = token
  }
})

/* SSR */
const { data } = useLazyAsyncData(async () => {
  if (isAuthenticated.value) {
    const user = await fetchUserInfo()
    return user
  }
})

/* Client */
// const data = ref()
// onMounted(async () => {
//   if (isAuthenticated) {
//     const user = await fetchUserInfo()
//     data.value = user
//   }
// })
</script>
