import { useNavigationStore } from '@/store/navigation.store'
import React from 'react'
import { Tooltip } from '@chakra-ui/react'
import { FiBookOpen, FiChevronLeft, FiChevronRight, FiLogOut, FiSettings, FiUsers } from 'react-icons/fi'
import { RiTeamLine } from "react-icons/ri"
import { RxDashboard } from "react-icons/rx"
import SidebarLink from './SidebarLink'
import { BiSupport } from "react-icons/bi"

export default function AdminSidebar () {
  const { toggleSidebar, sidebarOpen } = useNavigationStore()

  return (
    <div className={`${sidebarOpen ? 'sidebar-large' : 'sidebar-mini'} h-full transition-all duration-500 min-w-16 flex flex-col border-r`}>
      <button onClick={toggleSidebar} className={`flex hover:bg-gray-100 items-center ${sidebarOpen ? 'justify-start px-8' : 'justify-center'} w-full border-b h-16`}>
        {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
      <SidebarLink href='/console/dashboard/home'>
        {sidebarOpen ? <div className='flex gap-8 items-center'><RxDashboard /> Dashboard</div> : <Tooltip label='Dashboard' placement='right'>
          <div className='h-full w-full flex justify-center items-center'><RxDashboard /></div>
        </Tooltip>}
      </SidebarLink>
      <SidebarLink href='/console/dashboard/companies'>
        {sidebarOpen ? <div className='flex gap-8 items-center'><RiTeamLine /> Companies</div> : <Tooltip label='Companies' placement='right'>
          <div className='h-full w-full flex justify-center items-center'><RiTeamLine /></div>
        </Tooltip>}
      </SidebarLink>
      {/* <SidebarLink href='/console/dashboard/courses'>
        {sidebarOpen ? <div className='flex gap-8 items-center'><FiBookOpen /> Courses</div> : <Tooltip label='Courses' placement='right'>
          <div className='h-full w-full flex justify-center items-center'><FiBookOpen /></div>
        </Tooltip>}
      </SidebarLink>
      <SidebarLink href='/console/dashboard/tickets'>
        {sidebarOpen ? <div className='flex gap-8 items-center'><BiSupport /> Support</div> : <Tooltip label='Students' placement='right'>
          <div className='h-full w-full flex justify-center items-center'><BiSupport /></div>
        </Tooltip>}
      </SidebarLink>
      <SidebarLink href='/console/dashboard/settings'>
        {sidebarOpen ? <div className='flex gap-8 items-center'><FiSettings /> Settings</div> : <Tooltip label='Settings' placement='right'>
          <div className='h-full w-full flex justify-center items-center'><FiSettings /></div>
        </Tooltip>}
      </SidebarLink> */}
      <SidebarLink href={'/console/auth/logout'} >
        <div className={`flex hover:bg-gray-100 items-center ${sidebarOpen ? 'justify-start px-8' : 'justify-center'} w-full border-b h-16`}>
          {sidebarOpen ? <FiLogOut /> : <FiLogOut />}
        </div>
      </SidebarLink>
    </div>
  )
}
