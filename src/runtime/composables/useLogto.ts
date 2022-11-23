import { useNuxtApp } from '#app'
import { Logto } from '..'

/**
 * A composable method that provides the Logto reactive refs and auth methods.
 *
 * ```ts
 * export default {
 *  setup() {
 *    const { isAuthenticated, signIn } = useLogto();
 *
 *    return {
 *      isAuthenticated,
 *      onClickSignIn: () => {
 *        signIn('<your-redirect-uri>');
 *      },
 *    }
 *  }
 * }
 * ```
 *
 * Use this composable in the setup script of your Vue component to make sure the injection works
 */
export const useLogto = (): Logto => {
  const { $logto } = useNuxtApp()
  const { plugin } = $logto

  if (!plugin) {
    throw new Error('Logto plugin not accessible.')
  }

  return plugin
}
