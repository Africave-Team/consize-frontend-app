
export interface IDelete {
  url: string
  body?: any
  headers?: any
}

export interface IPost extends IDelete {
  body?: object
}

export interface IPostMultipart extends IDelete {
  data: FormData
}

export type IPatch = IPost

export type IPut = IPost

export interface IGet extends IDelete {
  query?: Record<string, any>
  body?: any
}

export interface IResponse<D> {
  data?: D
  code?: number
  message?: string
}