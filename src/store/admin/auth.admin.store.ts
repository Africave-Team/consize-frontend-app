import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Access, IAuthStore, User } from '@/type-definitions/auth'
export const cookieKey = "AUTH_TOKEN_CONSIZE"

export const useAdminAuthStore = create(
  persist<Omit<IAuthStore, "setTeam" | "team">>(
    (set, get) => ({
      setUser: (obj) => set({ user: obj }),
      setAccess: (obj) => {
        set({ ...obj })
      },
      async logoutAccount () {
        set({ access: undefined, refresh: undefined, user: undefined })
      }
    }),
    {
      name: "admin-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
