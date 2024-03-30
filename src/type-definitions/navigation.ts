export enum ListStyle {
  GRID = "grid",
  ROWS = "rows"
}
export interface NavigationStore {
  sidebarOpen: boolean
  preferredListStyle: ListStyle


  // methods
  toggleSidebar: () => void
  toggleListStyle: () => void
}