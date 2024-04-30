import http from './base'

export const slackTokenExchange = async (code: string): Promise<any> =>
  http.post({
    url: `slack/token-exchange`,
    body: { code }
  })


export const channelsList = async (): Promise<any> =>
  http.get({
    url: `slack/channels.list`,
  })


export const membersList = async (): Promise<any> =>
  http.get({
    url: `slack/members.list`,
  })

