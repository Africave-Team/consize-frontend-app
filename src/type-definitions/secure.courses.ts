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


export enum Sources {
  MANUAL = "manual",
  AI = "ai"
}


export interface Course {
  id: string
  title: string
  description: string
  owner: string
  lessons: string[]
  courses: string[]
  headerMedia: Media
  status: CourseStatus
  free: boolean
  settings: string
  bundle: boolean
  private: boolean
  source: Sources
  price?: number
  currentCohort?: string
  audiences?: string
}