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
    Modal: {
      sizes: {
        "2xl": {
          dialog: {
            maxWidth: "800px", // Set your custom width here
            height: "auto", // Adjust height if needed
          },
        },
        "3xl": {
          dialog: {
            maxWidth: "1000px", // Set your custom width here
            height: "auto", // Adjust height if needed
          },
        },
        "4xl": {
          dialog: {
            maxWidth: "1200px", // Set your custom width here
            height: "auto", // Adjust height if needed
          },
        },
      },
    },
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
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width" />
        <meta name="description" content="Deliver impactful training - that your learners will actually take &#x2013; through everyday messaging tools, all in 10 minutes a day." />
        <link rel="icon" type='image/x-icon' href="https://framerusercontent.com/images/x8KIepxiGzVmPd17alnttXas5Q.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Consize" />
        <meta property="og:description" content="Deliver impactful training - that your learners will actually take &#x2013; through everyday messaging tools, all in 10 minutes a day." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Consize" />
        <meta name="twitter:description" content="Deliver impactful training - that your learners will actually take &#x2013; through everyday messaging tools, all in 10 minutes a day." />
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

