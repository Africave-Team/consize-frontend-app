export enum ResponseType {
  MULTI_CHOICE = "multi-choice",
  FREE_FORM = "free-form"
}

export interface Question {
  id: string
  question: string
  responseType: ResponseType
  choices: string[]
}
export interface Survey {
  id: string
  team: string
  title: string
  questions: Question[]
}


export interface SurveyResponse {
  response: string
  responseType: ResponseType
  surveyQuestion: string
  student: string
  team: string
  survey: string
  course: string
}

export interface SurveyResponsepayload {
  responses: {
    question: Question
    answer: string
  }[]
  student: {
    name: string
    email: string
    phoneNumber: string
  }
}