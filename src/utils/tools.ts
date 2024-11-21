
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

function getAdjustmentPixels1 (dpr: number) {
  const baseAdjustment = 15 // Adjustment at DPR = 1.1
  const referenceDPR = 1.1
  return baseAdjustment * (dpr / referenceDPR)
}
function getAdjustmentPixels0 (dpr: number) {
  const baseAdjustment = -1 // Adjustment at DPR = 1.1
  const referenceDPR = 0.8
  return baseAdjustment * (dpr / referenceDPR)
}
function getAdjustmentPixels3 (dpr: number) {
  const baseAdjustment = 15 // Adjustment at DPR = 1.1
  const referenceDPR = 1.1
  return baseAdjustment * (dpr / referenceDPR)
}
export const generateRepositionFactor = function (dpi: number) {
  let factor = 0
  switch (dpi) {
    case 2.0:
      factor = 0
      break

    case 1.0:
      factor = -0
      break
    case 1.5:
      factor = 0
      break
    default:
      if (dpi < 1) {
        factor = getAdjustmentPixels0(dpi)
      } else if (dpi < 2) {
        factor = getAdjustmentPixels1(dpi)
      }
      break
  }

  return factor
}