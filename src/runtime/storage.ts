/* eslint-disable require-await */
import { useCookie } from '#app'

export const createStorage = () => {
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

  return storage
}
