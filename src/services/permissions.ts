import { LoginPayloadInterface, LogoutPayloadInterface, RegistrerPayloadInterface, ForgotPasswordPayloadInterface, ResetPasswordPayloadInterface, RefreshTokensPayloadInterface, VerifyAccountPayloadInterface } from '@/type-definitions/auth'
import http from './base'
import { IResponse } from '@/type-definitions/IAxios'

export const permissionGroups = async (): Promise<any> =>
  http.get({
    url: `permissions/groups`,
  })

export const fetchPermissions = async (): Promise<any> =>
  http.get({
    url: `permissions/`,
  })

