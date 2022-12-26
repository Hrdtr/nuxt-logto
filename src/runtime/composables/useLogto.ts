import { Logto } from '..'
import { useNuxtApp } from '#app'

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
  if (!$logto) { throw new Error('Logto plugin not accessible') }

  return $logto
}
