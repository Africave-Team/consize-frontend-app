export enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video',
  IMAGE = 'image'
}
export interface Media {
  mediaType: MediaType
  url: string
}
export interface CreateCoursePayload {
  free: boolean
  bundle: boolean
  private: boolean
  headerMedia: Media
  title: string
  description: string
  price?: number
  audiences?: string
}

export interface CourseStatistics {
  enrolled: number
  active: number
  averageCompletionPercentage: number
  dropouts: number
  completed: number
  averageTestScore: number
  averageCompletionDays: number
  averageCompletionMinutes: number
  averageCourseDurationSeconds: number
  dropoutRate: number
  averageCourseProgress: number
  averageMcqRetakeRate: number
  averageLessonDurationMinutes: number
  averageBlockDurationMinutes: number
  averageBlockDurationSeconds: number
}

export interface PaginationPayload {
  page: number
  pageSize: number
  filter: string
}


export enum CourseStatus {
  DRAFT = "draft",
  COMPLETED = "completed",
  PUBLISHED = "published",
  DELETED = "deleted"
}

export interface Lesson {
  id: string
  title: string
  blocks: string[]
  quizzes: string[]
  course: string
  description?: string
}


export interface LessonData {
  id: string
  title: string
  blocks: Block[]
  quizzes: Quiz[]
  course: Course
  description?: string
}

export enum Sources {
  MANUAL = "manual",
  AI = "ai"
}

export interface Createlesson {
  courseId: string
  lesson: {
    title: string
    description?: string
  }
}

export interface UpdateLesson {
  lessonId: string
  courseId: string
  lesson: {
    title: string
    description?: string
  }
}




export interface Course {
  id: string
  title: string
  description: string
  owner: string
  lessons: Lesson[]
  courses: Course[]
  headerMedia: Media
  status: CourseStatus
  free: boolean
  settings: CourseSettings
  bundle: boolean
  private: boolean
  source: Sources
  price?: number
  currentCohort?: string
  audiences?: string
}


// Blocks

export interface Block {
  quiz?: Quiz
  id: string
  course: string
  title: string
  content: string
  bodyMedia: Media
}
export interface AddBlock {
  courseId: string
  lessonId: string
  block: Omit<Block, "id" | "course">
}


// quiz

export interface Quiz {
  id: string
  question: string
  correctAnswerContext: string
  wrongAnswerContext: string
  choices: string[]
  correctAnswerIndex: number
  revisitChunk?: string
  hint?: string
}
export interface AddBlockQuiz {
  courseId: string
  lessonId: string
  blockId: string
  quiz: Omit<Quiz, "id">
}

export interface AddLessonQuiz {
  courseId: string
  lessonId: string
  quiz: Omit<Quiz, "id">
}


// settings

export interface EnrollmentField {
  fieldName: string
  variableName: string
  required: boolean
  defaultField: boolean
  id: string
  position: number
}

export interface CourseMetadata {
  idealLessonTime: Period
  courseCompletionDays: number
  maxLessonsPerDay: number
  minLessonsPerDay: number
  maxEnrollments: number
}

export interface Student {
  firstName: string
  otherNames: string
  phoneNumber: string
  email: string
}

export interface LearnerGroup {
  name: string
  id: string
  members: Student[]
  launchTimes: LearnerGroupLaunchTime | null
}

export interface LearnerGroupLaunchTime {
  launchTime: Date
  utcOffset: number
}

export interface CourseMaterial {
  id: string
  fileName: string
  fileUrl: string
  fileSize: string
  fileType: string
}

export enum DropoutEvents {
  LESSON_COMPLETION = "lesson completion date",
  INACTIVITY = "inactivity"
}

export enum PeriodTypes {
  DAYS = "days",
  HOURS = "hours",
  MINUTES = "minutes"
}
export interface Period {
  value: number
  type: PeriodTypes
}


export interface CourseSettings {
  id: string
  enrollmentFormFields: EnrollmentField[]
  metadata: CourseMetadata
  learnerGroups: LearnerGroup[]
  courseMaterials: CourseMaterial[]
  // times within the day to send out reminders
  reminderSchedule: string[]
  // how much inactivity time to wait for before sending dropout message
  dropoutWaitPeriod: Period
  // How long should the reminder (dropout message) continue for if the learner doesn’t respond?
  reminderDuration: Period
  // How many hours of learner inactivity before the next reminder (to continue) gets sent out?
  inactivityPeriod: Period
  dropoutEvent: DropoutEvents
}