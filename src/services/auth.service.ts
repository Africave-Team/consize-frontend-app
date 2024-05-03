import { LoginPayloadInterface, LogoutPayloadInterface, RegistrerPayloadInterface, ForgotPasswordPayloadInterface, ResetPasswordPayloadInterface, RefreshTokensPayloadInterface, VerifyAccountPayloadInterface } from '@/type-definitions/auth'
import http from './base'
import { IResponse } from '@/type-definitions/IAxios'

export const login = async (payload: LoginPayloadInterface): Promise<any> =>
  http.post({
    url: `auth/login`,
    body: { ...payload },
  })


export const register = async (payload: RegistrerPayloadInterface): Promise<any> =>
  http.post({
    url: `auth/register`,
    body: { ...payload },
  })

export const forgotPassword = async (payload: ForgotPasswordPayloadInterface): Promise<any> =>
  http.post({
    url: `auth/forgot-password`,
    body: { ...payload },
  })

export const resetPassword = async (payload: ResetPasswordPayloadInterface): Promise<any> =>
  http.post({
    url: `auth/reset-password?token=${payload.token}`,
    body: { password: payload.password },
  })

export const verifyAccount = async (payload: VerifyAccountPayloadInterface): Promise<any> =>
  http.post({
    url: `auth/verify-email`,
    body: payload
  })

export const sendVerificationEmail = async (): Promise<any> =>
  http.post({
    url: `auth/send-verification-email`
  })

export const refreshTokens = async (payload: RefreshTokensPayloadInterface): Promise<any> =>
  http.post({
    url: `auth/refresh-tokens`,
    body: { ...payload },
  })

export const logout = async (payload: LogoutPayloadInterface): Promise<any> =>
  http.post({
    url: `auth/logout`,
    body: { ...payload },
  });

