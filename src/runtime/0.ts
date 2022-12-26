import { readonly } from 'vue'
import { createContext } from './context'
import LogtoClient from './client'
import { createStorage } from './storage'
import { createPluginMethods } from './methods'
import { Logto } from '.'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const { config, navigator } = nuxtApp.$config.public.logto
  const storage = createStorage()
  const client = new LogtoClient(config, storage, navigator)
  const context = createContext(client)
  const pluginMethods = createPluginMethods(context)

  nuxtApp.hook('app:created', async () => {
    const authenticated = await client.isAuthenticated()
    context.isAuthenticated.value = authenticated
    context.isLoading.value = false
  })

  const logto: Logto = {
    client: context.client,
    isAuthenticated: readonly(context.isAuthenticated),
    isLoading: readonly(context.isLoading),
    error: readonly(context.error),
    ...pluginMethods
  }

  return { provide: { logto } }
})

declare module '#app' {
  interface NuxtApp { $logto: Logto }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties { $logto: Logto }
}
