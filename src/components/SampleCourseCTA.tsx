import { Button, Link } from '@chakra-ui/react'
import React from 'react'

export default function SampleCourseCTA ({ bg }: { bg?: string }) {
  return (
    <Button as={Link} href="/courses/6571d810ac1b7303132bf391" _hover={{ bg }} className={` ${bg ? `${bg} text-white text-sm !hover:${bg}` : 'bg-white text-primary-500 text-sm md:mt-0 mt-5'} !no-underline md:px-8 px-6 py-2 rounded-md w-full'`}>Try a sample course</Button>
  )
}
