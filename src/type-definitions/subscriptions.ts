import { Team } from './auth'
import { PeriodTypes } from './secure.courses'

export enum PlanPeriods {
  MONTHLY = "monthly",
  ANNUALLY = "annually"
}

export interface Plan {
  id: string
  disabled: boolean
  name: string
  description: string
  price: number
  period: PlanPeriods
  gracePeriod?: {
    value: number,
    period: PeriodTypes
  }
}


export enum SubscriptionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  GRACE = "grace-period"
}
export interface Subscription {
  owner: string | Team
  plan: string | Plan
  status: SubscriptionStatus
  expires: Date
}