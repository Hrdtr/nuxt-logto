<template>
  <div>
    <button @click="signIn('http://localhost:3000/')">
      Login
    </button>
  </div>
</template>

<script setup>
import { onMounted, useHandleSignInCallback, useLogto } from '#imports'

const { signIn } = useLogto()

/* SSR */
const { isAuthenticated } = useHandleSignInCallback()
onMounted(() => console.log('isAuthenticated', isAuthenticated.value))

/* Client */
// onMounted(() => {
//   const { isAuthenticated } = useHandleSignInCallback()
//   console.log('isAuthenticated', isAuthenticated.value)
// })
</script>
