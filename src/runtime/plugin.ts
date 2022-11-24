/* eslint-disable require-await */
import { defineNuxtPlugin, Plugin, useCookie } from '#app'
import { readonly } from 'vue'
import { Context, createContext } from './context'
import { createPluginMethods } from './methods'
import LogtoClient from './client'
import { Logto } from '.'

export default defineNuxtPlugin(((nuxtApp) => {
  const logtoConfig = nuxtApp.$config.public.logto.config

  const cookieStorage = {
    idToken: useCookie('logto:idToken'),
    refreshToken: useCookie('logto:refreshToken'),
    accessToken: useCookie('logto:accessToken'),
    signInSession: useCookie('logto:signInSession')
  }

  const localStorageAvailable = process.client && !!localStorage
  const storage = {
    setItem: async (key: keyof typeof cookieStorage, value: string) => {
      const cookie = cookieStorage[key]
      cookie.value = value
      if (localStorageAvailable) {
        localStorage.setItem(`logto:${key}`, value)
      }
    },
    getItem: async (key: keyof typeof cookieStorage) => {
      const cookie = cookieStorage[key]
      if (cookie.value) {
        if (key === 'refreshToken' || key === 'idToken') { return cookie.value }
        return JSON.stringify(cookie.value)
      } else if (localStorageAvailable) {
        return localStorage.getItem(`logto:${key}`)
      } else {
        return null
      }
    },
    removeItem: async (key: keyof typeof cookieStorage) => {
      const cookie = cookieStorage[key]
      cookie.value = null
      if (localStorageAvailable) {
        localStorage.removeItem(`logto:${key}`)
      }
    }
  }

  const client = new LogtoClient(logtoConfig, storage)
  const context = createContext(client)
  const pluginMethods = createPluginMethods(context)
  const { isAuthenticated, isLoading, error } = context

  const plugin: Logto = {
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    ...pluginMethods
  }

  return {
    provide: {
      logto: {
        context,
        plugin,
        createPluginMethods
      }
    }
  }
}) as Plugin<{
  logto: {
    context: Context;
    plugin: Logto,
    createPluginMethods: typeof createPluginMethods
  }
}>)

declare module '#app' {
  interface NuxtApp {
      $logto: {
        context: Context;
        plugin: Logto,
        createPluginMethods: typeof createPluginMethods
      }
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $logto: {
      context: Context;
      plugin: Logto,
      createPluginMethods: typeof createPluginMethods
    }
  }
}
