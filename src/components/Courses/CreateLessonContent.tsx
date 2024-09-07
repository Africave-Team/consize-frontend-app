import { useCourseMgtStore } from '@/store/course.management.store'
import { Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import NewBlockForm from './CreateBlockForm'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import NewQuizForm from './CreateQuizForm'
import NewBlockQuizForm from './AddFollowupQuiz'
import DeleteLessonComponent from './DeleteLessonComponent'
import NewAssessmentQuestionForm from './NewAssessmentQuiz'
import SelectAssessmentQuestions from './SelectAssessmentQuestions'
import DeleteAssessmentComponent from './DeleteAssessment'

export default function CreateLessonSection ({ open, refetch }: { open: boolean, refetch: () => Promise<any> }) {
  const { closeCreateContent, createContent } = useCourseMgtStore()
  return (
    <Modal
      isOpen={open}
      onClose={closeCreateContent}
      isCentered
      size={createContent && createContent.contentType === ContentTypeEnum.SELECT_ASSESSMENT_QUIZ ? '3xl' : 'xl'}
    >
      <ModalOverlay />
      <ModalContent className='min-h-[20vh] max-h-[85vh] overflow-y-auto p-0'>
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

            {createContent && createContent.contentType === ContentTypeEnum.ASSESSMENT_QUIZ && <NewAssessmentQuestionForm assessment={createContent.lessonId} close={closeCreateContent} courseId={createContent.courseId} />}
            {createContent && createContent.contentType === ContentTypeEnum.DELETE_ASSESSMENT_QUIZ && <DeleteAssessmentComponent assessmentId={createContent.lessonId} courseId={createContent.courseId} onClose={closeCreateContent} refetch={refetch} />}
            {createContent && createContent.assessment && createContent.contentType === ContentTypeEnum.SELECT_ASSESSMENT_QUIZ && <SelectAssessmentQuestions assessment={createContent.assessment} courseId={createContent.courseId} assessmentId={createContent.lessonId} onClose={closeCreateContent} />}
            {createContent && createContent.contentType === ContentTypeEnum.DELETE_LESSON && <DeleteLessonComponent courseId={createContent.courseId} lessonId={createContent.lessonId} onClose={closeCreateContent} refetch={refetch} />}

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
