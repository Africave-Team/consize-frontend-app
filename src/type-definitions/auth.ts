import { Distribution } from './callbacks'
import { Subscription } from './subscriptions'

export interface LoginPayloadInterface {
  email: string
  password: string
  shortCode?: string
}

export interface RegistrerPayloadInterface {
  email: string
  password: string
  name: string
  companyName: string
}

export interface RefreshTokensPayloadInterface {
  refreshToken: string
}

export interface ForgotPasswordPayloadInterface {
  email: string
}

export interface ResetPasswordPayloadInterface {
  password: string
  token: string
}

export interface VerifyAccountPayloadInterface {
  password: string
  logo: string
  token: string
}

export interface LogoutPayloadInterface {
  refreshToken: string
}

export interface DistributionChannel {
  channel: Distribution,
  enabled: boolean
  token?: string
}

export interface FacebookIntegrationData {
  businessId: string
  phoneNumberId: string
  token: string | null
  status: "PENDING" | "CONFIRMED"
}

export interface Team {
  name: string
  id: string
  verified: boolean
  shortCode: string
  channels: DistributionChannel[]
  slackToken?: string
  facebookToken?: string | null
  facebookBusinessId?: string | null
  facebookPhoneNumberId?: string | null
  whatsappToken?: string
  facebookData: FacebookIntegrationData | null
  subscription: Subscription
  owner: string
  logo?: string
  color?: {
    primary: string
    secondary: string
  }
}



export interface IPG {
  id: string
  name: string
  value: string
  permissions: Permissions
  extra?: Permissions
}


export interface Permissions {
  teams?: {
    view: boolean
    add: boolean
    delete: boolean
  }
  subscription?: {
    view: boolean
    add: boolean
    delete: boolean
  }
  certificates?: {
    view: boolean
    add: boolean
    delete: boolean
  }
  signatories?: {
    view: boolean
    add: boolean
    delete: boolean
  }
  surveys?: {
    view: boolean
    add: boolean
    delete: boolean
  }
  students?: {
    view: boolean
    add: boolean
    delete: boolean
  }
  courses?: {
    view: boolean
    modify: boolean
    add: boolean
    delete: boolean
  }
  dashboard?: {
    view: boolean
  }
}

export interface User {
  id: string
  email: string
  isEmailVerified: string
  name: string
  avatar?: string
  permissionGroup: IPG
}

export interface QueryResult {
  page: number
  limit: number
  totalPages: number
  totalResults: number
}
export interface TokenPayload {
  token: string
  expires: Date
}

export interface Access {
  access: TokenPayload
  refresh: TokenPayload
}



export interface authStore {
  access?: TokenPayload
  refresh?: TokenPayload
  user?: User
  team?: Team
  subscription?: Subscription
}


export interface IAuthStore extends authStore {
  setUser: (payload: User) => void
  setAccess: (payload: Access) => void
  setTeam: (payload: Team) => void
  logoutAccount: () => Promise<void>
}