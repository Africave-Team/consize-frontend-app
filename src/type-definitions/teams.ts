import { Team, User } from './auth'

export interface CreateTeam {
  name: string
  email: string
  permissionGroup: string
}



// admin interfaces below
export interface TeamWithOwner extends Omit<Team, "owner"> {
  owner: User
}