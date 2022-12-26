import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import { LogtoConfig } from '@logto/client'
import { useNuxtApp } from '#app'

export interface ModuleOptions {
  config: LogtoConfig
  storage?: Storage
  navigatior?: (url: string) => void | Promise<void>
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
    nuxt.options.build.transpile.push(runtimeDir, /@logto/, /@silverhand/)
    if (nuxt.options.vite.optimizeDeps?.include) {
      nuxt.options.vite.optimizeDeps.include.push('@logto/client')
    } else {
      nuxt.options.vite.optimizeDeps = { ...(nuxt.options.vite.optimizeDeps || {}), include: ['@logto/client'] }
    }

    addPlugin(resolve(runtimeDir, '0'))
    addImportsDir(resolve(runtimeDir, 'composables'))
  }
})
