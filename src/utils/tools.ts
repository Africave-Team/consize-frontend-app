
export function delay (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const COOKIE_AUTH_KEY = "CONSIZE:AUTH:COOKIE"