import { Icon, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger } from '@chakra-ui/react'
import React from 'react'
import { IoIosInformationCircleOutline } from 'react-icons/io'

export default function InfoPopover ({ message, className }: { message: string, className?: string }) {
  return (
    <div className="relative group">
      <Icon as={IoIosInformationCircleOutline} />

      <div className={`absolute hidden right-1 top-14 transform -translate-y-1/2 w-52 whitespace-normal bg-gray-800 text-white p-2 rounded-md text-xs z-50 group-hover:block ${className}`}>
        {message}
      </div>
    </div>
  )
}
