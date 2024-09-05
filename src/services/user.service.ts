import { } from '@/type-definitions/auth'
import http from './base'
import { IResponse } from '@/type-definitions/IAxios'
import { CreateTeam } from '@/type-definitions/teams'



export const updateProfile = async (payload: { avatar?: string, name: string, isEmailVerified?: boolean }): Promise<any> =>
  http.put({
    url: `users/`,
    body: { ...payload }
  })

export const updatePassword = async (payload: { oldPassword: string, newPassword: string }): Promise<any> =>
  http.post({
    url: `users/password`,
    body: { ...payload }
  })

export const getProfile = async (): Promise<any> =>
  http.get({
    url: `users/`
  })

