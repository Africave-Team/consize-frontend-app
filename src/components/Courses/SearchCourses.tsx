import { searchCourses } from '@/services/secure.courses.service'
import { Course } from '@/type-definitions/secure.courses'
import { stripHtmlTags } from '@/utils/string-formatters'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import he from "he"
import { FaSearch } from 'react-icons/fa'

export default function SearchCourses () {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [search, setSearch] = useState("")
  const loadData = async function (payload: { search: string }) {
    const { data } = await searchCourses({ search: payload.search })
    return data
  }

  const { data: searchResults, isFetching, refetch } =
    useQuery({
      queryKey: ['search', { search, isOpen }],
      queryFn: () => isOpen && loadData({ search })
    })


  return (

    <div>
      <div onClick={onOpen} className='h-10 w-full border-2 select-none cursor-pointer px-2 flex hover:border-[#0D1F23] justify-start items-center gap-2'>
        <FaSearch /> Search courses
      </div>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'md'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 p-0'>
          <ModalBody className='h-96 px-2'>
            <div className='relative'>
              <div className='pl-12 absolute top-0 left-0 flex h-14 font-semibold items-center text-lg'>{search.length === 0 ? 'Search courses' : ''}</div>
              <input onChange={(e) => setSearch(e.target.value)} placeholder='' id="search" type="text" className={`w-full bg-white  h-14 pl-12 pr-5 border font-semibold text-lg focus-visible:outline-[#0D1F23]`} />
              <div className='absolute left-0 top-0 h-14 w-12 flex justify-center items-center'>
                <FaSearch className='text-xl' />
              </div>
              <div className='absolute right-0 top-0 h-14 w-12 flex justify-center items-center'>
                {isFetching && <Spinner size={'md'} className='text-xl' />}
              </div>
            </div>

            {searchResults && <div>
              {searchResults.length === 0 ? <div className='w-full h-10 flex justify-center items-center mt-4'>
                No results found
              </div> : <div>
                <div className='h-10 w-full mt-3'>
                  {searchResults.length} results
                </div>
                <div className='w-full h-96 overflow-y-scroll'>
                  {searchResults.map((course: Course) => (<div className='min-h-20 cursor-pointer hover:bg-[#0D1F23] hover:text-white p-2' key={course.id}>
                    <div className='text-sm font-bold'>{course.title} {'->'} {course.status}</div>
                    {/* {course.description} */}
                    <div className='mt-2 text-xs' dangerouslySetInnerHTML={{ __html: he.decode(course.description) }}></div>
                  </div>))}
                </div>
              </div>}
            </div>}
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
