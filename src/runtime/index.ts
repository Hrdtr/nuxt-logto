import type { Ref } from 'vue'
import type { IdTokenClaims, UserInfoResponse } from './client'

export { LogtoError, LogtoClientError, OidcError, Prompt, ReservedScope, UserScope } from './client'
export type { LogtoConfig, IdTokenClaims, UserInfoResponse, LogtoErrorCode, LogtoClientErrorCode } from './client'

export interface Logto {
  isAuthenticated: Readonly<Ref<boolean>>
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<Error | undefined>>
  fetchUserInfo: () => Promise<UserInfoResponse | undefined>
  getAccessToken: (resource?: string) => Promise<string | undefined>
  getIdTokenClaims: () => Promise<IdTokenClaims | undefined>
  signIn: (redirectUri: string) => Promise<void>
  signOut: (postLogoutRedirectUri?: string) => Promise<void>
}
