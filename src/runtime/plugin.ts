import { readonly } from 'vue'
import { Context } from './context'
import { createPluginMethods } from './methods'
import { Logto } from '.'

export const createPlugin = (context: Context) => {
  const pluginMethods = createPluginMethods(context)
  const logto: Logto = {
    client: context.client,
    isAuthenticated: readonly(context.isAuthenticated),
    isLoading: readonly(context.isLoading),
    error: readonly(context.error),
    ...pluginMethods
  }

  return logto
}
