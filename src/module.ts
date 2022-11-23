import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import { LogtoConfig } from '@logto/client'

export interface ModuleOptions {
  config: LogtoConfig
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-logto',
    configKey: 'logto'
  },

  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    if (!options.config.appId) {
      throw new Error('logto.appId is required')
    }
    if (!options.config.endpoint) {
      throw new Error('logto.endpoint is required')
    }

    nuxt.options.runtimeConfig.public.logto = options

    nuxt.options.build.transpile.push(runtimeDir, /@logto/, /@silverhand/)
    addImportsDir(resolve(runtimeDir, 'composables'))
    addPlugin(resolve(runtimeDir, 'plugin'))
  }
})
