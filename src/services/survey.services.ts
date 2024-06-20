import http from './base'
interface SurveyQuestion {
  id: string,
  question: string,
  choices: string[]
  responseType: "free-form" | "multi-choice" | string
}

export const createSurveyRequest = async (payload: { questions: SurveyQuestion[], title: string }): Promise<any> =>
  http.post({
    url: `survey/`,
    body: payload
  })

export const updateSurveyRequest = async (payload: { questions: SurveyQuestion[], title: string }, id: string): Promise<any> =>
  http.put({
    url: `survey/${id}`,
    body: payload
  })


export const deleteSurveyRequest = async (id: string): Promise<any> =>
  http.delete({
    url: `survey/${id}`
  })

export const fetchSurveyRequest = async (id: string): Promise<any> =>
  http.get({
    url: `survey/${id}`
  })
export const fetchSurveys = async () =>
  http.get({
    url: "survey/"
  })


export const fetchSurveysResponsesListing = async (courseId: string) =>
  http.get({
    url: `survey/course/${courseId}`
  })

export const fetchSurveysResponsesChart = async (courseId: string) =>
  http.get({
    url: `survey/course/${courseId}/chart`
  })

