import { Distribution } from './callbacks'
import { StudentRecord } from './secure.courses'

export interface CreateCohortinterface {
  courseId: string
  distribution: Distribution
  name: string
}


export interface EnrollCohortinterface {
  members: string[]
  students: string[]
  courseId: string
  channels: string[]
  cohortId: string
  date: string
  time: string
  schedule: boolean
}

export enum CohortsStatus {
  PENDING = "pending",
  ACTIVE = "active",
  DISABLED = "disabled"
}

export interface CohortsInterface {
  id: string,
  name: string,
  shortCode: string
  distribution: Distribution
  schedule: boolean
  default: boolean
  members: StudentRecord[]
  courseId: string,
  status: CohortsStatus
  date?: Date,
  time?: string,
}