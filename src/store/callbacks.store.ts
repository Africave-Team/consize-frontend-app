import { Distribution, ICallbackStore } from '@/type-definitions/callbacks'
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const SLACK_URL = "https://slack.com/oauth/v2/authorize?client_id=1714634672272.7032770960243&scope=channels:read,chat:write,groups:read,im:read,groups:write,mpim:write,im:write,incoming-webhook,users:read"



export const useCallbackStore = create(
  persist<ICallbackStore>(
    (set, get) => ({


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
