import { CourseMgtStoreInterface } from '@/type-definitions/course.mgt'
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useCourseMgtStore = create(
  persist<CourseMgtStoreInterface>(
    (set, get) => ({
      setCurrentLesson (lessonId) {
        set({ currentLesson: lessonId })
      },

      setReloadLesson (val) {
        set({ reloadLesson: val })
      },

      initiateCreateContent (lessonId, courseId, contentType, blockId, content, assessment) {
        set({
          createContent: {
            open: true,
            lessonId, contentType, courseId, blockId, content, assessment
          },
          currentLesson: lessonId
        })
      },
      closeCreateContent () {
        set({ createContent: undefined })
      },
    }),
    {
      name: "course-mgt-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
