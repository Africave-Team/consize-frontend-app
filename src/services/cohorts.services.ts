import { CreateCohortinterface, EnrollCohortinterface } from '@/type-definitions/cohorts'
import http from './base'
import { Distribution } from '@/type-definitions/callbacks'

export const createCohort = async (payload: CreateCohortinterface): Promise<any> =>
  http.post({
    url: `cohorts/`,
    body: payload
  })


export const enrollCohort = async (payload: EnrollCohortinterface): Promise<any> =>
  http.post({
    url: `cohorts/enroll`,
    body: payload
  })


export const getCourseCohorts = async (courseId: string, distribution: Distribution): Promise<any> =>
  http.get({
    url: `cohorts/${courseId}/${distribution}`,
  })



export const getGeneralCourseCohorts = async (courseId: string): Promise<any> =>
  http.get({
    url: `cohorts/general/${courseId}`,
  })


export const deleteCourseCohort = async (cohortId: string): Promise<any> =>
  http.delete({
    url: `cohorts/${cohortId}`,
  })
