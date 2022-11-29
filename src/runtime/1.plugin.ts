/* eslint-disable require-await */
import { defineNuxtPlugin, Plugin, useCookie } from '#app'
import { readonly } from 'vue'
import { Context, createContext } from './context'
import { createPluginMethods } from './methods'
import LogtoClient from './client'
import { Logto } from '.'

export default defineNuxtPlugin(((nuxtApp) => {
  const logtoConfig = nuxtApp.$config.public.logto.config

  const idToken = useCookie('logto:idToken')
  const refreshToken = useCookie('logto:refreshToken')
  const accessToken = useCookie('logto:accessToken')
  const signInSession = useCookie('logto:signInSession')

  const localStorageAvailable = process.client && !!localStorage
  const storage = {
    setItem: async (key: 'idToken' | 'refreshToken' | 'accessToken' | 'signInSession', value: string) => {
      if (key === 'idToken') { idToken.value = value }
      if (key === 'refreshToken') { refreshToken.value = value }
      if (key === 'accessToken') { accessToken.value = value }
      if (key === 'signInSession') { signInSession.value = value }
      if (localStorageAvailable) {
        localStorage.setItem(`logto:${key}`, value)
      }
    },
    getItem: async (key: 'idToken' | 'refreshToken' | 'accessToken' | 'signInSession') => {
      if (key === 'idToken') {
        if (idToken.value) {
          return idToken.value
        } else if (localStorageAvailable) {
          return localStorage.getItem(`logto:${key}`)
        } else {
          return null
        }
      }
      if (key === 'refreshToken') {
        if (refreshToken.value) {
          return refreshToken.value
        } else if (localStorageAvailable) {
          return localStorage.getItem(`logto:${key}`)
        } else {
          return null
        }
      }
      if (key === 'accessToken') {
        if (accessToken.value) {
          return JSON.stringify(accessToken.value)
        } else if (localStorageAvailable) {
          return localStorage.getItem(`logto:${key}`)
        } else {
          return null
        }
      }
      if (key === 'signInSession') {
        if (signInSession.value) {
          return JSON.stringify(signInSession.value)
        } else if (localStorageAvailable) {
          return localStorage.getItem(`logto:${key}`)
        } else {
          return null
        }
      } else {
        return null
      }
    },
    removeItem: async (key: 'idToken' | 'refreshToken' | 'accessToken' | 'signInSession') => {
      if (key === 'idToken') { idToken.value = null }
      if (key === 'refreshToken') { refreshToken.value = null }
      if (key === 'accessToken') { accessToken.value = null }
      if (key === 'signInSession') { signInSession.value = null }
      if (localStorageAvailable) {
        localStorage.removeItem(`logto:${key}`)
      }
    }
  }

  const client = new LogtoClient(logtoConfig, storage)
  const context = createContext(client)
  const { isAuthenticated, isLoading, error } = context
  client.isAuthenticated().then((res) => {
    isAuthenticated.value = res
  })
  const pluginMethods = createPluginMethods(context)

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
