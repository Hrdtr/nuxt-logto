import { readonly } from 'vue'
import { useNuxtApp, useRequestHeaders, useRequestEvent } from '#app'

/**
 * A composable method that watches browser navigation and automatically handles the sign-in callback
 * Use this in the setup script of your Callback page to make sure the injection works
 */
export const useHandleSignInCallback = (callback?: () => void) => {
  const { $logto } = useNuxtApp()
  const { context, createPluginMethods } = $logto

  if (!context) {
    throw new Error('Logto context not accessible.')
  }

  const { isAuthenticated, isLoading, logtoClient, error } = context
  const { handleSignInCallback } = createPluginMethods(context)

  let currentPageUrl: string
  if (process.server) {
    const headers = useRequestHeaders()
    const host = headers.host as string
    const protocol = headers?.referer?.split('/')?.[0]
    currentPageUrl = protocol ? `${protocol}//${host}${useRequestEvent().node.req.url}` : `https://${host}${useRequestEvent().node.req.url}`
  } else {
    currentPageUrl = window?.location?.href
  }

  if (!isAuthenticated.value && logtoClient.value?.isSignInRedirected(currentPageUrl)) {
    handleSignInCallback(currentPageUrl, callback)
  }

  return {
    isLoading: readonly(isLoading),
    isAuthenticated: readonly(isAuthenticated),
    error: readonly(error)
  }
}
