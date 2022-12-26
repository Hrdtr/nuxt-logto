import type { Ref, UnwrapRef } from 'vue'
import { reactive, toRefs } from 'vue'
import type LogtoClient from './client'

interface LogtoContextProperties {
  client: LogtoClient | undefined
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | undefined
}

export interface Context {
  // Wrong type workaround. https://github.com/vuejs/core/issues/2981
  client: Ref<UnwrapRef<LogtoClient | undefined>>
  isAuthenticated: Ref<boolean>
  isLoading: Ref<boolean>
  error: Ref<Error | undefined>
}

export const createContext = (logtoClient: LogtoClient): Context => {
  const context = reactive<LogtoContextProperties>({
    client: logtoClient,
    isAuthenticated: false,
    isLoading: true,
    error: undefined
  })

  const { client, isAuthenticated, isLoading, error } = toRefs(context)

  return {
    client,
    isAuthenticated,
    isLoading,
    error
  }
}
