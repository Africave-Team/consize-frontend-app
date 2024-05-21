import { useCourseMgtStore } from '@/store/course.management.store'
import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import NewBlockForm from './CreateBlockForm'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import NewQuizForm from './CreateQuizForm'
import NewBlockQuizForm from './AddFollowupQuiz'

export default function CreateLessonSection ({ open, refetch }: { open: boolean, refetch: () => Promise<any> }) {
  const { closeCreateContent, createContent } = useCourseMgtStore()
  return (
    <Modal
      isOpen={open}
      onClose={closeCreateContent}
      isCentered
      size={'xl'}
    >
      <ModalOverlay />
      <ModalContent className='min-h-[85vh] p-0'>
        <ModalBody className='px-2 h-full'>
          <div className='h-full'>
            {createContent && createContent.contentType === ContentTypeEnum.SECTION && <NewBlockForm close={async (reload) => {
              if (reload) {
                await refetch()
              }
              closeCreateContent()
            }} courseId={createContent?.courseId} />}

            {createContent && createContent.contentType === ContentTypeEnum.QUIZ && <NewQuizForm close={async (reload) => {
              if (reload) {
                await refetch()
              }
              closeCreateContent()
            }} courseId={createContent?.courseId} />}

            {createContent && createContent.blockId && createContent.contentType === ContentTypeEnum.BLOCK_QUIZ && <NewBlockQuizForm close={async (reload) => {
              if (reload) {
                await refetch()
              }
              closeCreateContent()
            }} blockId={createContent.blockId} courseId={createContent?.courseId} />}


          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
