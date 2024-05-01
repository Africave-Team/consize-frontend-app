'use client'
import React, { useState } from 'react'
import copy from 'clipboard-copy'
import { MdContentCopy } from "react-icons/md"
import { Icon, IconButton, useToast } from '@chakra-ui/react'

interface CopyToClipboardButtonProps {
  targetSelector: string
  link?: string
  useLink?: boolean
  buttonText?: string
  message?: string
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ targetSelector, buttonText, useLink, link, message }) => {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  const copyToClipboard = async () => {
    try {
      if (useLink && link) {
        await copy(link)
        setCopied(true)
        toast({
          title: 'Done.',
          description: message || "Invitation link copied",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } else {
        const targetElement = document.querySelector(targetSelector)

        if (targetElement) {
          let contentToCopy: string
          console.log(targetElement.tagName.toLowerCase())
          if (targetElement.tagName.toLowerCase() === 'input') {
            contentToCopy = (targetElement as HTMLInputElement).value
          } else {
            contentToCopy = targetElement.textContent || ''
          }

          await copy(contentToCopy)
          setCopied(true)
          toast({
            title: 'Done.',
            description: message || "Invitation link copied",
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
          setTimeout(() => {
            setCopied(false)
          }, 2000)
        } else {
          alert('Target element not found.')
        }
      }

    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  return (
    <IconButton className='border' disabled={copied}
      onClick={copyToClipboard} icon={<Icon as={MdContentCopy} />} aria-label={''} />
  )
}

export default CopyToClipboardButton
