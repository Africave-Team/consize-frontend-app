import React from 'react'
import SettingsNavLink from './SettingsNavItem'

export default function SettingsNav () {
  const items = [
    {
      title: "Profile",
      path: "/dashboard/settings/profile"
    },
    {
      title: "Teams",
      path: "/dashboard/settings/teams"
    },
    {
      title: "Subscriptions",
      path: "/dashboard/settings/subscriptions"
    },
    {
      title: "Security",
      path: "/dashboard/settings/security"
    },
    {
      title: "Certificate builder",
      path: "/dashboard/settings/certificate-builder"
    },
    {
      title: "Surveys",
      path: "/dashboard/settings/surveys"
    }

  ]
  return (
    <div className='p-3 flex md:w-full w-2/3 md:pr-0 !pr-60 overflow-x-auto items-center gap-2'>
      {items.map((item, index) => <SettingsNavLink title={item.title} key={`menu_${index}`} href={item.path} />)}
    </div>
  )
}
