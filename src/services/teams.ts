import { ResetPasswordPayloadInterface } from '@/type-definitions/auth'
import http from './base'
import { IResponse } from '@/type-definitions/IAxios'
import { CreateTeam } from '@/type-definitions/teams'

export const myTeamMembers = async (page: number): Promise<any> =>
  http.get({
    url: `teams/?page=${page}`,
  })


export const createTeamMember = async (payload: CreateTeam): Promise<any> =>
  http.post({
    url: `teams/invite`,
    body: { ...payload }
  })

export const deleteTeamMember = async (userId: string): Promise<any> =>
  http.delete({
    url: `teams/invite/${userId}`
  })

export const resendInvite = async (userId: string): Promise<any> =>
  http.post({
    url: `teams/resend-invite`,
    body: { userId }
  })

export const acceptTeamInvite = async (payload: ResetPasswordPayloadInterface): Promise<any> =>
  http.patch({
    url: `teams/invite`,
    body: payload
  })



