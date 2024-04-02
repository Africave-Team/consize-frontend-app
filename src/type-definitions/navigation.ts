export enum ListStyle {
  GRID = "grid",
  ROWS = "rows"
}
export interface NavigationStore {
  sidebarOpen: boolean
  preferredListStyle: ListStyle
  pageTitle: string


  // methods
  toggleSidebar: () => void
  toggleListStyle: () => void
  setPageTitle: (title: string) => void
}