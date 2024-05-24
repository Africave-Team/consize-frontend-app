import React from 'react'
import KippaLogo from './Logo'
import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'

export default function SiteNavBar () {
  const router = useRouter()
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
      className="relative min-h-16 flex w-full flex-wrap items-center justify-between bg-[#FBFBFB] py-3 md:px-10"
      data-te-navbar-ref>
      <div className="flex w-full flex-wrap items-center justify-between px-3">
        <div>
          <a
            className="mx-2 my-1 flex items-center lg:mb-0 lg:mt-0"
            href="/">
            <KippaLogo />
          </a>
        </div>

        <button
          className="block border rounded-md bg-transparent px-2 py-1 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
          type="button"
          data-te-collapse-init
          data-te-target="#navbarSupportedContent4"
          aria-controls="navbarSupportedContent4"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={hamburgerClicked}>
          <span className="[&>svg]:w-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#334155"
              className="h-7 w-7">
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd" />
            </svg>
          </span>
        </button>

        <div
          className="!visible mt-2 hidden flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
          id="navbarSupportedContent4"
          data-te-collapse-item>
          <ul
            className="list-style-none mr-auto text-sm flex flex-col pl-0 lg:mt-1 lg:flex-row lg:justify-center flex-1"
            data-te-navbar-nav-ref>
            <li
              className="pl-2 lg:my-0 lg:pl-2 lg:pr-1"
              data-te-nav-item-ref>
              <Link
                className="text-[#334155] hover:text-[#334155] focus:text-[#334155] disabled:text-black/30 lg:px-2 [&.active]:text-black/90"
                aria-current="page"
                href="https://calendly.com/ketan-vuov/meet-consize"
                target='__blank'
                data-te-nav-link-ref>Contact us</Link>
            </li>
          </ul>

          <div className="flex items-center gap-3 md:mt-0 mt-3">
            <Link href={"/auth/login"} className='bg-primary-app text-black hover:bg-primary-app/80 rounded-3xl font-medium w-24 py-2 text-sm flex justify-center items-center h-11'>Sign in</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
