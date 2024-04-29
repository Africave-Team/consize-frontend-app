import { Distribution } from './callbacks'

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