import { Distribution, ICallbackStore } from '@/type-definitions/callbacks'
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAuthStore } from './auth.store'

const SLACK_URL = "https://slack.com/oauth/v2/authorize?client_id=1714634672272.7032770960243&scope=channels:read,chat:write,groups:read,im:read,groups:write,mpim:write,im:write,users:read"



export const useCallbackStore = create(
  persist<ICallbackStore>(
    (set, get) => ({

      initiateSlackAsync (teamId) {
        return SLACK_URL + `&redirect_uri=${location.origin}/callbacks/slack&state=${teamId},${useAuthStore.getState().access?.token}`
      },
      initiateSlackSettings (teamId) {
        const url = location.pathname
        set({ redirect: url })
        location.href = SLACK_URL + `&redirect_uri=${location.origin}/callbacks/slack&state=${teamId},${useAuthStore.getState().access?.token}`
      },
      initiateSlack (courseId) {
        const url = location.pathname
        set({ courseId, distribution: Distribution.SLACK, redirect: url })
        location.href = SLACK_URL + `&redirect_uri=${location.origin}/callbacks/slack`
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
