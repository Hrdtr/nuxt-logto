import LogtoClient from '@logto/client'
import type { Ref, UnwrapRef } from 'vue'
import { CreatePluginMethods } from './methods'

export { LogtoError, LogtoClientError, OidcError, Prompt, ReservedScope, UserScope } from './client'
export type { LogtoConfig, IdTokenClaims, UserInfoResponse, LogtoErrorCode, LogtoClientErrorCode } from './client'

export type Logto = {
  client: Ref<UnwrapRef<LogtoClient | undefined>>
  isAuthenticated: Readonly<Ref<boolean>>
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<Error | undefined>>
} & ReturnType<CreatePluginMethods>
