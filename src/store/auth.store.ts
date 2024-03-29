import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { setCookie, destroyCookie } from 'nookies'
import { Access, IAuthStore, User } from '@/type-definitions/auth'
import { login } from '@/services/auth.service'
import moment from 'moment'

export const useAuthStore = create(
  persist<IAuthStore>(
    (set, get) => ({
      setUser: (obj) => set({ user: obj }),
      setAccess: (obj) => set({ ...obj }),
      setTeam: (obj) => set({ team: obj }),
      logoutAccount () {
        set({ access: undefined, refresh: undefined, user: undefined, team: undefined })
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
