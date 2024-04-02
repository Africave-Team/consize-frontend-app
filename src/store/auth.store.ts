import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Access, IAuthStore, User } from '@/type-definitions/auth'
export const cookieKey = "AUTH_TOKEN_CONSIZE"

export const useAuthStore = create(
  persist<IAuthStore>(
    (set, get) => ({
      setUser: (obj) => set({ user: obj }),
      setAccess: (obj) => {
        set({ ...obj })
      },
      setTeam: (obj) => set({ team: obj }),
      async logoutAccount () {
        set({ access: undefined, refresh: undefined, user: undefined, team: undefined })
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
