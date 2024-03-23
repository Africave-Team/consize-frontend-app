import React from 'react'
import KippaLogo from './Logo'
import { IconButton } from '@chakra-ui/react'
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa"
import Image from 'next/image'

export default function Footer () {
  return (
    <div>
      <div className='h-16 flex items-center justify-between border-t'>
        <div className='flex items-center'>
          <div>
            <a
              className="mx-2 my-1 flex items-center lg:mb-0 lg:mt-0"
              href="/">
              <KippaLogo />
            </a>
          </div>
        </div>

        <div className='flex gap-3 px-4'>
          <IconButton icon={<FaFacebook />} color={'#64748B'} aria-label={''} />
          <IconButton icon={<FaLinkedin />} color={'#64748B'} aria-label={''} />
          <IconButton icon={<FaYoutube />} color={'#64748B'} aria-label={''} />
          <IconButton icon={<FaInstagram />} color={'#64748B'} aria-label={''} />
          <IconButton icon={<FaTiktok />} color={'#64748B'} aria-label={''} />
        </div>
      </div>
    </div>
  )
}
