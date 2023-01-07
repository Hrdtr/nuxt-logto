import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addImportsDir, addPluginTemplate } from '@nuxt/kit'
import { LogtoConfig } from '@logto/client'

export interface ModuleOptions {
  config: LogtoConfig
  useLocalStorageAsFallback?: boolean
  navigator?: (url: string) => void | Promise<void>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-logto',
    configKey: 'logto'
  },

  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    if (!options.config.endpoint) {
      throw new Error('`logto.endpoint` is required')
    }
    if (!options.config.appId) {
      throw new Error('`logto.appId` is required')
    }

    nuxt.options.runtimeConfig.public.logto = options
    nuxt.options.build.transpile.push(runtimeDir, /@logto/, /@silverhand/, 'nanoid', 'zod')
    if (nuxt.options.vite.optimizeDeps?.include) {
      nuxt.options.vite.optimizeDeps.include.push('@logto/client')
    } else {
      nuxt.options.vite.optimizeDeps = { ...(nuxt.options.vite.optimizeDeps || {}), include: ['@logto/client'] }
    }

    /* [ERROR] Failed to resolve import "unctx" from "src/runtime/0.ts". Does the file exist? */
    // addPlugin(resolve(runtimeDir, '0'))

    /* WORKAROUND */
    addPluginTemplate({
      filename: '00.ts',
      getContents: () => `import LogtoClient from '${resolve(runtimeDir, 'client')}'
      import { Context, createContext } from '${resolve(runtimeDir, 'context')}'
      import { createPlugin } from '${resolve(runtimeDir, 'plugin')}'
      import { createStorage } from '${resolve(runtimeDir, 'storage')}'
      import { Logto } from '${resolve(runtimeDir)}'
      import { defineNuxtPlugin } from '#app'
      
      export default defineNuxtPlugin(async (nuxtApp) => {
        const { config, navigator } = nuxtApp.$config.public.logto
        const storage = createStorage()
        const client = new LogtoClient(config, storage, navigator)
        const context = createContext(client)
        const logto = createPlugin(context)

        // Get initial state
        const res = await client.isAuthenticated()
        context.isAuthenticated.value = res
        context.isLoading.value = false
      
        return { provide: { logto, logtoCtx: context } }
      })
      
      declare module '#app' {
        interface NuxtApp { $logto: Logto, $logtoCtx: Context }
      }
      declare module '@vue/runtime-core' {
        interface ComponentCustomProperties { $logto: Logto, $logtoCtx: Context }
      }
      `
    })

    addImportsDir(resolve(runtimeDir, 'composables'))
  }
})
