import { useCourseMgtStore } from '@/store/course.management.store'
import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import NewBlockForm from './CreateBlockForm'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import NewQuizForm from './CreateQuizForm'

export default function CreateLessonSection ({ open, refetch }: { open: boolean, refetch: () => Promise<any> }) {
  const { closeCreateContent, createContent } = useCourseMgtStore()
  return (
    <Modal
      isOpen={open}
      onClose={closeCreateContent}
      isCentered
      size={'lg'}
    >
      <ModalOverlay />
      <ModalContent className='h-[85vh] p-0'>
        <ModalBody className='px-2 h-full'>
          <div className='h-full'>
            {createContent && createContent.contentType === ContentTypeEnum.SECTION && <NewBlockForm close={async () => {
              await refetch()
              closeCreateContent()
            }} courseId={createContent?.courseId} />}

            {createContent && createContent.contentType === ContentTypeEnum.QUIZ && <NewQuizForm close={async () => {
              await refetch()
              closeCreateContent()
            }} courseId={createContent?.courseId} />}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
