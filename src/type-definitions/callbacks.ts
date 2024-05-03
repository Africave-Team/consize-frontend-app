export enum Distribution {
  SLACK = 'slack',
  WHATSAPP = 'whatsapp',
}

export interface callbackStore {
  redirect?: string
  courseId?: string
  distribution?: Distribution
}


export interface ICallbackStore extends callbackStore {
  initiateSlack: (courseId?: string) => void
  initiateSlackAsync: (teamId?: string) => string
  initiateSlackSettings: (teamId?: string) => void
  initiateWhatsapp: (courseId?: string) => void
}