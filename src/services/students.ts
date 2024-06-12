import http from './base'

export const studentsList = async (page: number): Promise<any> =>
  http.get({
    url: `students/all?page=${page}`,
  })

