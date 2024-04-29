import { Distribution, ICallbackStore } from '@/type-definitions/callbacks'
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAuthStore } from './auth.store'

const SLACK_URL = "https://slack.com/oauth/v2/authorize?client_id=1714634672272.7032770960243&scope=incoming-webhook&user_scope=users:read,chat:write"

export const useCallbackStore = create(
  persist<ICallbackStore>(
    (set, get) => ({


      initiateSlack (courseId) {
        const url = location.pathname
        set({ courseId, distribution: Distribution.SLACK, redirect: url })
        location.href = SLACK_URL + `&state=${courseId}-${useAuthStore.getState().team?.id}-${Distribution.SLACK}&redirect_uri=${location.origin}/callbacks/slack`
      },
      initiateWhatsapp (courseId) {

      },
    }),
    {
      name: "callbacks-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
