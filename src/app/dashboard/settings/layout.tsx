'use client'

import SettingsNav from '@/components/navigations/SettingsNav'
import Sidebar from '@/components/navigations/Sidebar'
import Script from 'next/script'

export default function SettingsLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        async defer crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => {
          // window.fbAsyncInit = function() {
          //   FB.init({
          //     appId: '1057351731954710',
          //     autoLogAppEvents: true,
          //     xfbml: true,
          //     version: 'v18.0'
          //   })
          // }
          console.log("Facebook sdk loaded. Window.FB has been populated")
        }}
      />
      <div className='flex h-full overflow-hidden flex-col w-full '>
        <div className='min-h-14 border-b w-full overflow-x-hidden'>
          <SettingsNav />
        </div>
        <div className='flex-1 overflow-y-hidden'>
          {children}
        </div>
      </div>
    </>
  )
}
