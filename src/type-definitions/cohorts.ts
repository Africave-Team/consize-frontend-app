import { Distribution } from './callbacks'
import { StudentRecord } from './secure.courses'

export interface CreateCohortinterface {
  members: string[]
  students: string[]
  courseId: string
  distribution: Distribution
  channels: string[]
  name: string
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
  distribution: Distribution
  schedule: boolean
  members: StudentRecord[]
  courseId: string,
  status: CohortsStatus
  date?: Date,
  time?: string,
}