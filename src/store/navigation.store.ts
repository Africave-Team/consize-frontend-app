import { ListStyle, NavigationStore } from '@/type-definitions/navigation'
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useNavigationStore = create(
  persist<NavigationStore>(
    (set, get) => ({
      sidebarOpen: false,
      preferredListStyle: ListStyle.GRID,
      pageTitle: "Dashboard - Home",


      // methods
      setPageTitle (title) {
        set({ pageTitle: title })
      },
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      toggleListStyle: () => set({ preferredListStyle: get().preferredListStyle === ListStyle.GRID ? ListStyle.ROWS : ListStyle.GRID })
    }),
    {
      name: "navigation-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
