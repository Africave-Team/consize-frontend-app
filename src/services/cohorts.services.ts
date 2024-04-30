import { CreateCohortinterface } from '@/type-definitions/cohorts'
import http from './base'

export const createCohort = async (payload: CreateCohortinterface): Promise<any> =>
  http.post({
    url: `cohorts/`,
    body: payload
  })
