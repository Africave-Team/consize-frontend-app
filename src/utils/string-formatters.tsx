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