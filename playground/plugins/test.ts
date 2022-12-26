import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ $logto }) => {
  const { isAuthenticated } = $logto
  console.log('isAuthenticated:', isAuthenticated.value)
})
