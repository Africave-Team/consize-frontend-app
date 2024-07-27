import { Team } from './auth'

export enum ListStyle {
  GRID = "grid",
  ROWS = "rows"
}
export interface NavigationStore {
  sidebarOpen: boolean
  preferredListStyle: ListStyle
  pageTitle: string
  team?: Team


  // methods
  toggleSidebar: () => void
  setTeam: (payload: Team) => void
  toggleListStyle: () => void
  setPageTitle: (title: string) => void
}