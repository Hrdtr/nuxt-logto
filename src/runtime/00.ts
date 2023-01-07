// import { defineNuxtPlugin } from '#app'
// import { readonly } from 'vue'
// import LogtoClient from './client'
// import { Context, createContext } from './context'
// import { createStorage } from './storage'
// import { createMethods } from './methods'
// import { Logto } from '.'

// // import LogtoClient from '${resolve(runtimeDir, 'client')}'
// // import { readonly } from 'vue'
// // import { Context, createContext } from '${resolve(runtimeDir, 'context')}'
// // import { createMethods } from '${resolve(runtimeDir, 'methods')}'
// // import { createStorage } from '${resolve(runtimeDir, 'storage')}'
// // import { Logto } from '${resolve(runtimeDir)}'
// // import { defineNuxtPlugin } from '#app'

// export default defineNuxtPlugin(async (nuxtApp) => {
//   const { config, navigator } = nuxtApp.$config.public.logto
//   const storage = createStorage()
//   const client = new LogtoClient(config, storage, navigator)
//   const context = createContext(client)
//   const methods = createMethods(context, storage)

//   const logto: Logto = {
//     client: context.client,
//     isAuthenticated: readonly(context.isAuthenticated),
//     isLoading: readonly(context.isLoading),
//     error: readonly(context.error),
//     ...methods
//   }

//   // Get initial state
//   const res = await client.isAuthenticated()
//   context.isAuthenticated.value = res
//   context.isLoading.value = false

//   return { provide: { logto, logtoCtx: context } }
// })

// declare module '#app' {
//   interface NuxtApp { $logto: Logto, $logtoCtx: Context }
// }
// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties { $logto: Logto, $logtoCtx: Context }
// }
