/* eslint-disable require-await */
import { defineNuxtPlugin, useCookie } from '#app'
import { readonly } from 'vue'
import { Storage } from '@logto/client'
import { Context, createContext } from './context'
import { createPluginMethods } from './methods'
import LogtoClient from './client'
import { Logto } from '.'

export default defineNuxtPlugin((nuxtApp) => {
  const logtoConfig = nuxtApp.$config.public.logto.config

  interface AuthStorage {
    idToken: string | null
    refreshToken: string | null
    accessToken: string | null
    signInSession: string | null
  }

  const idToken = useCookie<string | null>('logto:idToken', { default: () => null })
  const refreshToken = useCookie<string | null>('logto:refreshToken', { default: () => null })
  const accessToken = useCookie<string | null>('logto:accessToken', { default: () => null })
  const signInSession = useCookie<string | null>('logto:signInSession', { default: () => null })

  const cookieStorage = {
    idToken,
    refreshToken,
    accessToken,
    signInSession
  }

  const localStorageAvailable = process.client && !!localStorage
  const storage = {
    set: (key: keyof AuthStorage, value: string) => {
      cookieStorage[key].value = value
      if (localStorageAvailable) {
        localStorage.setItem(`logto:${key}`, value)
      }
    },
    get: (key: keyof AuthStorage) => {
      if (cookieStorage[key].value) {
        return JSON.stringify(cookieStorage[key].value)
      }
      if (localStorageAvailable) {
        return localStorage.getItem(`logto:${key}`)
      } else {
        return null
      }
    },
    delete: (key: keyof AuthStorage) => {
      cookieStorage[key].value = null
      if (localStorageAvailable) {
        localStorage.getItem(`logto:${key}`)
      }
    }
  }

  class LogtoStorage implements Storage {
    async getItem (key: keyof AuthStorage): Promise<string | null> {
      return storage.get(key)
    }

    async setItem (key: keyof AuthStorage, value: string): Promise<void> {
      storage.set(key, value)
    }

    async removeItem (key: keyof AuthStorage): Promise<void> {
      storage.delete(key)
    }
  }

  const client = new LogtoClient(logtoConfig, new LogtoStorage())
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
})

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
