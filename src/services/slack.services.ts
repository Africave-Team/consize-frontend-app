import http from './base'

export const slackTokenExchange = async (code: string): Promise<any> =>
  http.post({
    url: `slack/token-exchange`,
    body: { code }
  })

