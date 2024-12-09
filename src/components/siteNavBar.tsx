import React from 'react'
import KippaLogo from './Logo'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LuEqual } from 'react-icons/lu'
import { useNavigationStore } from '@/store/navigation.store'

export default function SiteNavBar ({ team = false, disabled }: { team?: boolean, disabled?: boolean }) {
  const router = useRouter()
  const { team: teamStore } = useNavigationStore()
  const hamburgerClicked = function () {
    const navContent = document.getElementById('navbarSupportedContent4')
    if (navContent) {
      const currentClasses = navContent.classList.value
      if (currentClasses.includes('hidden')) {
        navContent.classList.remove('hidden')
      } else {
        navContent.classList.add('hidden')
      }
    }
  }
  return (
    <nav
      className="relative min-h-20 flex w-full flex-wrap items-center justify-between bg-[#FBFBFB] py-3 md:px-16"
      data-te-navbar-ref>
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        <div>
          {!team ? <Link
            className="mx-2 my-1 flex items-center lg:mb-0 lg:mt-0"
            href="/home">
            <KippaLogo />
          </Link> : <>{teamStore && teamStore.logo && <Link href={`/teams/${teamStore.id}`}><img className='h-12' src={teamStore.logo} /></Link>}</>}
        </div>

        <button
          className="block rounded-md bg-transparent px-2 py-1 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 lg:hidden"
          type="button"
          data-te-collapse-init
          data-te-target="#navbarSupportedContent4"
          aria-controls="navbarSupportedContent4"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={hamburgerClicked}>
          <LuEqual className='text-3xl font-bold text-black' />
        </button>

        {!teamStore && <div
          className="!visible mt-2 hidden flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
          id="navbarSupportedContent4"
          data-te-collapse-item>
          {!disabled && <ul
            className="list-style-none mr-auto text-sm flex flex-col pl-0 lg:mt-1 lg:flex-row lg:px-3 lg:justify-end flex-1"
            data-te-navbar-nav-ref>
            <li
              className="pl-2 lg:my-0 lg:pl-2 lg:pr-1"
              data-te-nav-item-ref>
              <Link
                className="text-[#334155] hover:text-[#334155] focus:text-[#334155] hover:underline text-sm disabled:text-black/30 lg:px-2 [&.active]:text-black/90"
                aria-current="page"
                href="https://calendly.com/consize-demo/60min?month=2024-11"
                target='__blank'
                data-te-nav-link-ref>Contact Us</Link>
            </li>
          </ul>}

          {!disabled && <div className="flex items-center gap-3 md:mt-0 mt-3">
            <Link href={"/auth/login"} className='bg-primary-app text-black hover:bg-primary-app/80 rounded-3xl font-medium w-20 py-2 text-sm flex justify-center items-center h-10'>Sign in</Link>
          </div>}
        </div>}
      </div>
    </nav>
  )
}
