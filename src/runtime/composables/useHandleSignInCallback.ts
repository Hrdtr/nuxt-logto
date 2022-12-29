import { readonly, Ref, watchEffect } from 'vue'
import { useNuxtApp, useRequestHeaders, useRequestEvent } from '#app'

/**
 * A composable method that watches browser navigation and automatically handles the sign-in callback
 * Use this in the setup script of your Callback page to make sure the injection works
 */
export const useHandleSignInCallback = (callback?: () => void): {
  isLoading: Readonly<Ref<boolean>>;
  isAuthenticated: Readonly<Ref<boolean>>;
  error: Readonly<Ref<Error | undefined>>;
} => {
  const { $logto } = useNuxtApp()
  const { isAuthenticated, client, isLoading, error, handleSignInCallback } = $logto

  let currentPageUrl: string
  if (process.server) {
    const headers = useRequestHeaders()
    const host = headers.host as string
    const protocol = headers?.referer?.split('/')?.[0] || 'https:'
    currentPageUrl = `${protocol}//${host}${useRequestEvent().node.req.url}`
  } else {
    currentPageUrl = window?.location?.href
  }

  watchEffect(() => {
    if (process.client) {
      if (!isAuthenticated.value && client.value?.isSignInRedirected(currentPageUrl)) {
        handleSignInCallback(currentPageUrl, callback)
      }
    }
  })

  return {
    isLoading: readonly(isLoading),
    isAuthenticated: readonly(isAuthenticated),
    error: readonly(error)
  }
}
