'use client'

import './globals.css'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import "react-datetime/css/react-datetime.css"

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { AnimatePresence } from 'framer-motion'

export const dynamic = 'force-dynamic'


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // retry: (failureCount, error) => {
      //     // @ts-ignore
      //     if (error?.status === 401 || error?.status === 403) {
      //         return false
      //     }
      //     return failureCount <= 3 ? true : false;
      // }
    }
  }
})

export default function RootLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <script src="/js/tinymce/tinymce.min.js" />
      </head>
      <body className='h-screen overflow-y-hidden w-screen overflow-x-hidden' suppressHydrationWarning>
        <ChakraProvider>
          <CacheProvider>
            <QueryClientProvider client={queryClient}>
              <AnimatePresence mode="wait" initial={false}>
                {children}
              </AnimatePresence>
            </QueryClientProvider>
          </CacheProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}

