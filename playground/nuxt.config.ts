import { defineNuxtConfig } from 'nuxt/config'
import logto from '..'

export default defineNuxtConfig({
  // @ts-ignore: https://github.com/nuxt/framework/issues/8931
  modules: [logto],
  logto: {
    config: {
      endpoint: '',
      appId: ''
    }
  }
})
