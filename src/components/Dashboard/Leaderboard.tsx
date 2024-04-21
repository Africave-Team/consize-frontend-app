import { LeaderboardMember, RTDBStudent } from '@/type-definitions/secure.courses'
import { MenuItem, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiList } from 'react-icons/fi'

export default function Leaderboard ({ students }: { students: RTDBStudent[] }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [rankings, setRankings] = useState<LeaderboardMember[]>([])
  useEffect(() => {
    setRankings(students.sort((a: RTDBStudent, b: RTDBStudent) => {
      const first = a.scores ? a.scores.reduce((a, b) => a + b, 0) : 0
      const second = b.scores ? b.scores.reduce((a, b) => a + b, 0) : 0
      return second - first
    }).map((std: RTDBStudent, index: number) => {
      return {
        name: std.name,
        rank: index + 1,
        score: std.scores ? std.scores.reduce((a, b) => a + b, 0) : 0
      }
    }))
  }, [students])
  return (

    <>
      <MenuItem onClick={onOpen} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiList className='text-sm' />}>Leaderboard</MenuItem>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'md'}
        isCentered
      >
        <ModalOverlay />
        <ModalContent className='p-0'>
          <ModalHeader><h3 className='font-semibold text-lg'>General student leaderboard</h3></ModalHeader>
          <ModalBody className='h-full px-5 py-3 min-h-96 max-h-[650px] overflow-y-scroll'>
            {rankings.map((member, index) => {
              return <div key={`member_${index}`} className={`py-3 text-sm flex justify-between items-center px-4 w-full rounded-md ${(index === 0 || index % 2 !== 0) ? 'bg-gray-100' : ''}`}>
                <div>{member.rank}</div>
                <div>{member.name}</div>
                <div>{member.score}</div>
              </div>
            })}
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
