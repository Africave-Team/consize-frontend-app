'use client'

import './globals.css'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import "react-datetime/css/react-datetime.css"
import NextTopLoader from 'nextjs-toploader'

import {
  QueryClientProvider,
} from '@tanstack/react-query'
import "react-datetime/css/react-datetime.css"

import { AnimatePresence } from 'framer-motion'
import { queryClient } from '@/utils/react-query'

export const dynamic = 'force-dynamic'
import { extendTheme } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'

const customTheme = extendTheme({
  colors: {
    app: "#1FFF69",
    dark: "#0D1F23"
  },
  components: {
    Switch: {
      baseStyle: {
        track: {
          _checked: {
            bg: 'dark', // Use the custom color here
          },
        },
      },
    },
  },
})

export default function RootLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  const path = usePathname()

  return (
    <html lang="en">
      <head>
        <script src="/js/tinymce/tinymce.min.js" />
      </head>
      {path === "/embed" ? <body suppressHydrationWarning className='h-screen w-screen'>{children}</body> : <body className='h-screen overflow-y-hidden w-screen overflow-x-hidden' suppressHydrationWarning>
        <NextTopLoader color='#0D1F23' />
        <ChakraProvider theme={customTheme}>
          <CacheProvider>
            <QueryClientProvider client={queryClient}>
              <AnimatePresence mode="wait" initial={false}>
                {children}
              </AnimatePresence>
            </QueryClientProvider>
          </CacheProvider>
        </ChakraProvider>
      </body>}
    </html>
  )
}

