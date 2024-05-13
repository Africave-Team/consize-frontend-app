import { CreateCohortinterface } from '@/type-definitions/cohorts'
import http from './base'

export const createCohort = async (payload: CreateCohortinterface): Promise<any> =>
  http.post({
    url: `cohorts/`,
    body: payload
  })


export const getCourseCohorts = async (courseId: string): Promise<any> =>
  http.get({
    url: `cohorts/${courseId}`,
  })


export const deleteCourseCohort = async (cohortId: string): Promise<any> =>
  http.delete({
    url: `cohorts/${cohortId}`,
  })
