import { IdTokenClaims, UserInfoResponse, Storage } from '@logto/client'
import type { Context } from './context'

export type CreateMethods = (context: Context, storage: Storage) => {
  signIn: (redirectUri: string) => Promise<void>
  signOut: (postLogoutRedirectUri?: string) => Promise<void>
  fetchUserInfo: () => Promise<UserInfoResponse | undefined>
  getAccessToken: (resource?: string) => Promise<string | undefined>
  getIdTokenClaims: () => Promise<IdTokenClaims | undefined>
  handleSignInCallback: (callbackUri: string, callbackFunction?: () => void) => Promise<void>,
  clearStorage: () => Promise<void>
}

export const createMethods: CreateMethods = (context, storage) => {
  const throwClientUndefinedError = (): never => {
    throw new Error('Logto client undefined')
  }

  const { client, isLoading, isAuthenticated, error } = context

  const setLoadingState = (value: boolean) => {
    isLoading.value = value
  }

  const setAuthenticatedState = (value: boolean) => {
    isAuthenticated.value = value
  }

  const setError = (_error: unknown, fallbackErrorMessage?: string) => {
    if (_error instanceof Error) {
      error.value = _error
    } else if (fallbackErrorMessage) { error.value = new Error(fallbackErrorMessage) }
  }

  const signIn = async (redirectUri: string) => {
    if (!client.value) { return throwClientUndefinedError() }

    try {
      setLoadingState(true)
      await client.value.signIn(redirectUri)
    } catch (err) {
      setError(error, 'Unexpected error occurred while signing in')
    }
  }

  const signOut = async (postLogoutRedirectUri?: string) => {
    if (!client.value) { return throwClientUndefinedError() }

    try {
      setLoadingState(true)
      await client.value.signOut(postLogoutRedirectUri)
      // We deliberately do NOT set isAuthenticated to false here, because the app state may change immediately
      // even before navigating to the oidc end session endpoint, which might cause rendering problems.
      // Moreover, since the location will be redirected, the isAuthenticated state will not matter any more.
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while signing out')
    } finally {
      setLoadingState(false)
    }
  }

  const fetchUserInfo = async () => {
    if (!client.value) { return throwClientUndefinedError() }

    try {
      setLoadingState(true)
      return await client.value.fetchUserInfo()
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while fetching user info')
    } finally {
      setLoadingState(false)
    }
  }

  const getAccessToken = async (resource?: string) => {
    if (!client.value) { return throwClientUndefinedError() }

    try {
      setLoadingState(true)
      return await client.value.getAccessToken(resource)
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while getting access token')
    } finally {
      setLoadingState(false)
    }
  }

  const getIdTokenClaims = async () => {
    if (!client.value) { return throwClientUndefinedError() }

    try {
      return await client.value.getIdTokenClaims()
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while getting id token claims')
    }
  }

  const handleSignInCallback = async (callbackUri: string, callbackFunction?: () => void) => {
    if (!client.value) {
      return throwClientUndefinedError()
    }

    try {
      setLoadingState(true)
      await client.value.handleSignInCallback(callbackUri)
      setAuthenticatedState(true)
      callbackFunction?.()
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while handling sign in callback')
    } finally {
      setLoadingState(false)
    }
  }

  const clearStorage = async () => {
    try {
      await storage.removeItem('idToken')
      await storage.removeItem('accessToken')
      await storage.removeItem('refreshToken')
      await storage.removeItem('signInSession')
    } catch (error: unknown) {
      setError(error, 'Unexpected error occurred while clearing storage')
    }
  }

  return {
    signIn,
    signOut,
    fetchUserInfo,
    getAccessToken,
    getIdTokenClaims,
    handleSignInCallback,
    clearStorage
  }
}
