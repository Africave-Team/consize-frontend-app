import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { useFormik } from 'formik'
import { Block, QuizUnformed } from '@/type-definitions/secure.courses'

import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { Checkbox, HStack, useRadioGroup } from '@chakra-ui/react'
import he from "he"
import FileUploader from '../FileUploader'
import { MediaType } from '@/type-definitions/secure.courses'
import { FileTypes } from '@/type-definitions/utils'
import RadioCard from '../RadioCard'
import { addBlockQuiz, addLessonBlock, rewriteBlockContent, rewriteBlockQuiz, suggestBlockContent, suggestBlockQuiz, updateLessonBlock, updateQuiz } from '@/services/secure.courses.service'
import { convertToWhatsAppString, stripHtmlTags } from '@/utils/string-formatters'
import mime from "mime-types"
import { OptionButtons } from '@/type-definitions/course.mgt'
import InfoPopover from '../Dashboard/InfoPopover'
import { queryClient } from '@/utils/react-query'



const validationSchema = Yup.object({
  title: Yup.string().required(),
  content: Yup.string().required(),
  allowQuiz: Yup.boolean(),
  quiz: Yup.object({
    question: Yup.string(),
    correctAnswer: Yup.string().oneOf(["yes", "no"]),
    correctAnswerContext: Yup.string(),
    wrongAnswerContext: Yup.string(),
  }).when('allowQuiz', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.optional(),
  }),
})

export default function EditBlockForm ({ refetch, block, lessonId }: { block: Block, refetch: () => Promise<any>, lessonId: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [improvementOpen, setImprovementOpen] = useState(false)
  const [improvedText, setimprovedText] = useState("")
  const [improvementQuizOpen, setImprovementQuizOpen] = useState(false)
  const [improvedQuiz, setImprovedQuiz] = useState<QuizUnformed | null>(null)
  const [aiProgress, setAiProgress] = useState(false)

  const toast = useToast()
  const form = useFormik({
    initialValues: {
      ...block,
      allowQuiz: !!block.quiz,
      bodyMedia: block.bodyMedia || { url: "", mediaType: MediaType.IMAGE, embedUrl: "" },
      quiz: block.quiz ? {
        question: block.quiz.question,
        correctAnswer: block.quiz.choices[block.quiz.correctAnswerIndex].toLowerCase(),
        correctAnswerContext: block.quiz.correctAnswerContext,
        wrongAnswerContext: block.quiz.wrongAnswerContext
      } : {
        question: "",
        correctAnswer: "yes",
        correctAnswerContext: "",
        wrongAnswerContext: ""
      }
    },
    onSubmit: async function (values) {
      let quizId
      if (values.allowQuiz) {
        if (!!block.quiz) {
          // update quiz
          quizId = block.quiz.id
          let choices = ["yes", "no"]
          let correctIndex = choices.indexOf(values.quiz.correctAnswer.toLowerCase())
          await updateQuiz({
            id: quizId, body: {
              choices,
              question: values.quiz.question,
              correctAnswerIndex: correctIndex,
              correctAnswerContext: values.quiz.correctAnswerContext,
              wrongAnswerContext: values.quiz.wrongAnswerContext,
            }
          })
        } else {
          // create quiz
          let choices = ["yes", "no"]
          let correctIndex = choices.indexOf(values.quiz.correctAnswer)
          const { data } = await addBlockQuiz({
            lessonId, courseId: block.course, blockId: block.id, quiz: {
              choices,
              question: values.quiz.question,
              correctAnswerIndex: correctIndex,
              correctAnswerContext: values.quiz.correctAnswerContext,
              wrongAnswerContext: values.quiz.wrongAnswerContext,
            }
          })
          quizId = data.id
        }
      }
      await updateLessonBlock({
        blockId: block.id, update: {
          title: values.title,
          content: values.content,
          bodyMedia: values.bodyMedia,
          quiz: values.allowQuiz ? quizId : undefined
        }
      })
      queryClient.invalidateQueries({
        queryKey: ['lesson', { lessonId, courseId: block.course }],
      })
      toast({
        description: "Section has been updated",
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      refetch()
      onClose()
    },
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'quiz.correctAnswer',
    defaultValue: form.values.quiz.correctAnswer,
    onChange: (val) => {
      form.setFieldValue("quiz.correctAnswer", val)
    },
  })

  const group = getRootProps()
  const contentLength = () => {
    let total = 0
    total += convertToWhatsAppString(he.decode(form.values.content)).length
    total += form.values.title.length
    if (form.values.allowQuiz && form.values.quiz.question) {
      total += convertToWhatsAppString(he.decode(form.values.quiz.question)).length
    }
    return total
  }

  const allowedContentLength = () => {
    let total = 1000
    if (form.values.allowQuiz) {
      total = 650
    }
    return total
  }

  const handleAIButton = async (type: OptionButtons) => {
    // check if title is present
    let title = form.values.title
    if (title.length < 5) {
      toast({
        status: "info",
        title: "Provide a title for this section",
        description: "We need you to provide us a title for this section in order for ConsizeAI to go to work."
      })
      return
    }
    if (type === OptionButtons.SUGGEST) {
      setAiProgress(true)
      const { message, data } = await suggestBlockContent({
        lessonId, courseId: block.course, seedTitle: title
      })
      form.setFieldValue("content", data.sectionContent)
      setAiProgress(false)
    } else if (type === OptionButtons.IMPROVE) {
      setImprovementOpen(true)
      setAiProgress(true)
      const { message, data } = await rewriteBlockContent({
        lessonId, courseId: block.course, seedTitle: title, seedContent: stripHtmlTags(he.decode(form.values.content))
      })
      setimprovedText(data.sectionContent)
      setAiProgress(false)
    } else if (type === OptionButtons.SUGGESTQUIZ) {
      setImprovementQuizOpen(true)
      setAiProgress(true)
      const { message, data } = await suggestBlockQuiz({
        content: stripHtmlTags(he.decode(form.values.content)),
        isFollowup: true
      })
      setImprovedQuiz(data)
      setAiProgress(false)
    } else if (type === OptionButtons.IMPROVEQUIZ) {
      setImprovementQuizOpen(true)
      setAiProgress(true)
      const { message, data } = await rewriteBlockQuiz({
        content: stripHtmlTags(he.decode(form.values.content)),
        isFollowup: true
      })
      setImprovedQuiz(data)
      setAiProgress(false)
    }
  }

  const acceptQuiz = function (quiz: QuizUnformed) {
    form.setFieldValue("quiz.question", quiz.question)
    form.setFieldValue("quiz.choices", quiz.options.map(e => e.toLowerCase()))
    form.setFieldValue("quiz.correctAnswer", quiz.correct_answer.toLowerCase())
    form.setFieldValue("quiz.correctAnswerContext", quiz.explanation)
    form.setFieldValue("quiz.wrongAnswerContext", quiz.explanation)
    setImprovementQuizOpen(false)
  }

  useEffect(() => {
    if (form.values.bodyMedia && form.values.bodyMedia.url) {
      const mimeType = mime.lookup(form.values.bodyMedia.url)
      if (mimeType) {
        let type = mimeType.split('/')[0] as MediaType
        form.setFieldValue('bodyMedia.mediaType', type)
      }
    }
  }, [form.values.bodyMedia.url])


  return (
    <div>
      <button onClick={onOpen} className={`h-10 hover:bg-gray-100 rounded-lg flex justify-center items-center w-10`}>
        <FiEdit2 />
      </button>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-[85vh] p-0'>
          <ModalBody className=' px-2 py-5'>
            <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
              <div className='flex justify-between items-center h-10'>
                <div className='font-semibold text-lg'>Update this section</div>
                <div className={`font-semibold text-sm flex gap-1 items-center ${contentLength() <= 1000 ? 'text-green-500' : 'text-red-500'}`}>Total content length {contentLength()}:{contentLength() <= 1000 ? 'Good' : 'Bad'}</div>
              </div>
              <div className='mt-4 flex-1' id="parent">
                <div className='flex flex-col gap-4'>
                  <div>
                    <label htmlFor="title">Section title *</label>
                    <input onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} name="title" id="title" type="text" placeholder='Section title' className='h-14 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                  </div>
                  <div>
                    <label htmlFor="description">Section content *</label>
                    <CustomTinyMCEEditor improvement={improvementOpen} closeImprovement={() => setImprovementOpen(false)} onAIQueryButtonClick={handleAIButton} field='content' maxLength={allowedContentLength()} onChange={(value) => {
                      form.setFieldValue("content", value)
                    }} improvementResult={improvedText} aiProgress={aiProgress} placeholder='Enter the content of this section here' value={form.values.content} aiOptionButtons={[OptionButtons.IMPROVE, OptionButtons.SUGGEST]} />
                  </div>
                  <div className='w-full'>
                    <div className='flex justify-between items-center'>
                      <label htmlFor="">Course header media</label>
                    </div>
                    <div className='min-h-36'>
                      <FileUploader originalUrl={form.values.bodyMedia.url} mimeTypes={[FileTypes.IMAGE, FileTypes.AUDIO, FileTypes.VIDEO]} droppable={true} onUploadComplete={(val) => {
                        form.setFieldValue("bodyMedia.url", val)
                      }} previewable={true} />
                    </div>
                  </div>

                  {/* {form.values.bodyMedia.mediaType && form.values.bodyMedia.mediaType === MediaType.VIDEO && <div>
                    <label className='flex gap-2 mb-1 items-center' htmlFor="bodyMedia.embedUrl">Youtube embed url <InfoPopover message={"This is only required if you intend to deliver this course through Slack."} /></label>
                    <input onChange={form.handleChange} value={form.values.bodyMedia.embedUrl} onBlur={form.handleBlur} name="bodyMedia.embedUrl" id="bodyMedia.embedUrl" type="text" placeholder='Paste the youtube embed url here' className='h-14 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                  </div>} */}

                  <div className='flex gap-2 items-center flex-row-reverse justify-end'>
                    <Checkbox onChange={(val) => {
                      form.setFieldValue('allowQuiz', val.target.checked)
                    }} isChecked={form.values.allowQuiz}>
                      Add a follow up quiz
                    </Checkbox>
                  </div>

                  <div className={`transition-all duration-500 flex flex-col gap-3 ${form.values.allowQuiz ? 'min-h-[500px]' : 'h-0'}`}>
                    {form.values.allowQuiz && <>
                      <div>
                        <label htmlFor="description">Question *</label>
                        <CustomTinyMCEEditor isFollowup={true} improvement={improvementQuizOpen} closeImprovement={() => setImprovementQuizOpen(false)} onAIQueryButtonClick={handleAIButton} field='content' maxLength={150} onChange={(value) => {
                          form.setFieldValue("quiz.question", value)
                        }} aiProgress={aiProgress} quiz={improvedQuiz} acceptQuiz={acceptQuiz} placeholder='Enter the follow-up question for this section here' value={form.values.quiz.question} aiOptionButtons={[OptionButtons.SUGGESTQUIZ, OptionButtons.IMPROVEQUIZ]} />
                      </div>
                      <div>
                        <label htmlFor="">Correct answer</label>
                        <div className='flex mt-1 w-full gap-3'>
                          {["yes", "no"].map((value) => {
                            return (
                              <div onClick={() => {
                                form.setFieldValue('quiz.correctAnswer', value)
                              }} className={`capitalize cursor-pointer w-1/2 border-2 ${form.values.quiz.correctAnswer === value ? 'border-[#0CDA50] text-[#0CDA50]' : 'text-primary-dark border-primary-dark'} rounded-md h-10 gap-2 flex justify-start items-center px-3`} key={value}>
                                <div className={`flex justify-center items-center h-4 w-4 rounded-full border ${form.values.quiz.correctAnswer === value ? 'border-[#0CDA50]' : 'border-primary-dark'} `}>
                                  <div className={`h-2 w-2 rounded-full ${form.values.quiz.correctAnswer === value ? 'bg-[#0CDA50]' : 'bg-primary-dark'}`}></div>
                                </div>{value}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className='mt-2'>
                        <label htmlFor="description">Correct answer context *</label>
                        <CustomTinyMCEEditor field='correctAnswerContext' maxLength={150} onChange={(value) => {
                          form.setFieldValue("quiz.correctAnswerContext", value)
                        }} placeholder='Enter the message we should send when the user answers correctly' value={form.values.quiz.correctAnswerContext} aiOptionButtons={[]} />
                      </div>

                      <div id="wrongAnswer" className='mt-2'>
                        <label htmlFor="description">Wrong answer context *</label>
                        <CustomTinyMCEEditor field='wrongAnswerContext' maxLength={150} onChange={(value) => {
                          form.setFieldValue("quiz.wrongAnswerContext", value)
                        }} placeholder='Enter the message we should send when the user answers wrongly' value={form.values.quiz.wrongAnswerContext} aiOptionButtons={[]} />
                      </div>

                    </>}
                  </div>
                </div>

              </div>
              <div className='h-14 w-full'>
                <div className='justify-end flex h-full items-center gap-2'>
                  <button onClick={() => onClose()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
                  <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save changes
                    {form.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
