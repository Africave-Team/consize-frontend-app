
export function delay (ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export const COOKIE_AUTH_KEY = "CONSIZE:AUTH:COOKIE"
export function debounce<T extends (...args: any[]) => void> (func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}