import { NavigationStore } from '@/type-definitions/navigation'
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useNavigationStore = create(
  persist<NavigationStore>(
    (set, get) => ({
      sidebarOpen: false,


      // methods
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen })
    }),
    {
      name: "navigation-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
