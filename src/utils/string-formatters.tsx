export function getAvatarFallback (name: string): string {
  // If name is falsy, return empty string
  if (!name) return ''

  // Split the name by space and filter out empty strings
  const parts: string[] = name.trim().split(' ').filter(part => part)

  // If there are no parts, return empty string
  if (parts.length === 0) return ''

  // Extract the first character of the first part
  let firstInitial: string = parts[0][0].toUpperCase()

  // If there's only one part, return the first initial
  if (parts.length === 1) return firstInitial

  // Extract the first character of the last part
  let lastInitial: string = parts[parts.length - 1][0].toUpperCase()

  // Return the concatenated initials
  return firstInitial + lastInitial
}

export function convertToWhatsAppString (htmlString: string): string {
  if (!htmlString) return ''
  const entities: any = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&rsquo;': "'",
    '&#039;': "'",
    '&nbsp;': ' '
    // Add more entities as needed
  }
  const convertedString = htmlString
    .trim()
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<em>/g, '_')
    .replace(/<\/em>/g, '_')
    .replace(/<strong>/g, '*')
    .replace(/<\/strong>/g, '*')
    .replaceAll(/<li[^>]*>/g, '\n•')
    .replace(/<\/?ul>/g, '')
    .replace(/<[^>]+>/g, '')
    .replaceAll(/&[^;]+;/g, match => {
      return entities[match] || ''
    })
    .trim()

  return convertedString
}

export function reverseWhatsAppString (whatsAppString: string): string {
  if (!whatsAppString) return ''
  const reversedString = whatsAppString
    .trim()
    .replaceAll(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replaceAll(/\n/g, '<br>')
    .replaceAll(/_(.*?)_/g, '<em>$1</em>')
    .trim()

  return `${reversedString}`
}
export function stripHtmlTags (inputString: string) {
  return inputString.replace(/<[^>]*>/g, '')
}

export function snakeToCamel (snakeCaseString: string) {
  return snakeCaseString.replace(/_([a-z])/g, function (match, char) {
    return char.toUpperCase()
  })
}

export function camelToSnake (camelCaseString: string) {
  return camelCaseString.replace(/[A-Z]/g, function (match) {
    return '_' + match.toLowerCase()
  })
}

export const toCamelCase = (str: string) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

export function isBase64 (s: string): boolean {
  const pattern: RegExp = /^[A-Za-z0-9+/]+(?:={0,2})?$/
  return pattern.test(s)
}

export function isValidHexColor (hex: string) {
  const hexColorRegex = /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8}|[0-9A-F]{4})$/i
  return hexColorRegex.test(hex)
}