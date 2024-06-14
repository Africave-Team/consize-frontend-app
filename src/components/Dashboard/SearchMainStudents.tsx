import { Student } from '@/type-definitions/secure.courses'
import { Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function SearchMainStudents ({ students }: { students: Student[] }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const router = useRouter()

  const handleSearch = (key: string) => {
    const results = students.filter((item: Student) => JSON.stringify(item).toLowerCase().indexOf(search.toLowerCase()) != -1)
    setSearchResults(results)
  }

  useEffect(() => {
    if (search.length === 0) {
      setSearchResults([])
    } else {
      handleSearch(search)
    }
  }, [search])
  return (

    <div>
      <div onClick={onOpen} className='h-10 w-full border-2 rounded-lg select-none cursor-pointer px-2 flex hover:border-[#0D1F23] justify-start items-center gap-2'>
        <FaSearch /> Search students
      </div>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'md'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='min-h-96 p-0'>
          <ModalBody className='h-96 px-2'>
            <div className='relative'>
              <div onClick={() => document.getElementById('search')?.focus()} className='pl-12 absolute top-0 left-0 flex h-14 font-semibold items-center text-base'>{search.length === 0 ? 'Search students by name or phone number' : ''}</div>
              <input onChange={(e) => setSearch(e.target.value)} placeholder='' id="search" type="text" className={`w-full bg-white  h-14 pl-12 pr-5 border font-semibold text-lg focus-visible:outline-[#0D1F23]`} />
              <div className='absolute left-0 top-0 h-14 w-12 flex justify-center items-center'>
                <FaSearch className='text-xl' />
              </div>
            </div>

            {searchResults && <div>
              {searchResults.length === 0 ? <div className='w-full h-10 flex justify-center items-center mt-4'>
                No results found
              </div> : <div>
                <div className='h-10 w-full mt-3'>
                  {searchResults.length} results
                </div>
                <div className='w-full overflow-y-scroll'>
                  {searchResults.map((student: Student) => (<div onClick={() => router.push(`/dashboard/students/${student.id}`)} className='min-h-10 cursor-pointer hover:bg-[#0D1F23] hover:text-white p-2' key={student.id}>
                    <div className='text-sm font-bold'>{student.firstName} {student.otherNames} {'->'} {student.phoneNumber}</div>
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
