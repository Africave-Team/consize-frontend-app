import React from 'react'
import he from "he"

export default function CustomHeaderImage ({ bgColor, imageText, bgPattern, teamName, description }: { bgColor: string, imageText: string, bgPattern: string, description?: string, teamName?: string }) {
  function getContrastColor (hexColor: string) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Choose white or black based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }
  return (
    <div id="customHeaderImage" style={{ backgroundColor: bgColor }} className={`h-full w-full overflow-visible box-border flex items-center p-4 border rounded-none ${bgPattern} bg-cover`}>
      <div style={{ color: getContrastColor(bgColor) }} className='text-start w-4/5 px-5 py-10'>
        {teamName && <div>{teamName}</div>}
        <h3 className='font-bold text-3xl'>{imageText}</h3>
        {description && <p className='text-xs my-4 line-clamp-4' dangerouslySetInnerHTML={{ __html: he.decode(description) }} />}
      </div>

    </div>
  )
}
