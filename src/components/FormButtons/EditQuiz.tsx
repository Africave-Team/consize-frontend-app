import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import he from "he"
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Modal, ModalBody, ModalContent, ModalOverlay, Select, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { addLessonQuiz, rewriteBlockQuiz, suggestBlockQuiz, updateQuiz } from '@/services/secure.courses.service'
import { useCourseMgtStore } from '@/store/course.management.store'
import { Quiz, QuizUnformed } from '@/type-definitions/secure.courses'
import { FiEdit2 } from 'react-icons/fi'
import { OptionButtons } from '@/type-definitions/course.mgt'
import { stripHtmlTags } from '@/utils/string-formatters'


const validationSchema = Yup.object({
  question: Yup.string(),
  correctAnswer: Yup.string().required(),
  correctAnswerContext: Yup.string(),
  wrongAnswerContext: Yup.string(),
  revisitChunk: Yup.string(),
  hint: Yup.string(),
  choices: Yup.array().of(Yup.string().required()).min(3).max(3)

})

export default function EditQuizForm ({ refetch, quiz, content, block }: { quiz: Quiz, refetch: () => Promise<any>, content: string, block: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [improvementQuizOpen, setImprovementQuizOpen] = useState(false)
  const [improvedQuiz, setImprovedQuiz] = useState<QuizUnformed | null>(null)
  const [aiProgress, setAiProgress] = useState(false)

  const toast = useToast()
  const form = useFormik({
    initialValues: {
      question: quiz.question,
      hint: quiz.hint || "",
      choices: quiz.choices,
      correctAnswer: quiz.choices[quiz.correctAnswerIndex],
      correctAnswerContext: quiz.correctAnswerContext,
      wrongAnswerContext: quiz.wrongAnswerContext
    },
    onSubmit: async function (values) {
      let choices = values.choices
      let correctIndex = choices.indexOf(values.correctAnswer)
      await updateQuiz({
        id: quiz.id, body: {
          choices,
          block,
          revisitChunk: `${values.correctAnswerContext}`,
          hint: values.hint,
          question: values.question,
          correctAnswerIndex: correctIndex,
          correctAnswerContext: values.correctAnswerContext,
          wrongAnswerContext: values.wrongAnswerContext,
        }
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

  const handleAIButton = async (type: OptionButtons) => {
    // check if title is present
    if (type === OptionButtons.SUGGESTQUIZ) {
      setImprovementQuizOpen(true)
      setAiProgress(true)
      const { message, data } = await suggestBlockQuiz({
        content: stripHtmlTags(he.decode(content)),
        isFollowup: false
      })
      setImprovedQuiz(data)
      setAiProgress(false)
    } else if (type === OptionButtons.IMPROVEQUIZ) {
      setImprovementQuizOpen(true)
      setAiProgress(true)
      const { data } = await rewriteBlockQuiz({
        content: stripHtmlTags(he.decode(content)),
        isFollowup: false
      })
      setImprovedQuiz(data)
      setAiProgress(false)
    }
  }

  const acceptQuiz = function (quiz: QuizUnformed) {
    form.setFieldValue("question", quiz.question)
    form.setFieldValue("choices", quiz.options)
    form.setFieldValue("hint", quiz.hint)
    form.setFieldValue("correctAnswer", quiz.options[Number(quiz.correct_answer)])
    form.setFieldValue("correctAnswerContext", quiz.explanation)
    form.setFieldValue("wrongAnswerContext", quiz.explanation)
    setImprovementQuizOpen(false)
  }
  return (
    <div>
      <button onClick={onOpen} className={`h-10 hover:bg-gray-100 rounded-lg flex justify-center items-center w-10`}>
        <FiEdit2 />
      </button>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'lg'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-[85vh] p-0'>
          <ModalBody className='min-h-48 px-2 py-5'>
            <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
              <div className='flex justify-between items-center h-10'>
                <div className='font-semibold text-lg'>Add a new lesson quiz</div>
              </div>
              <div className='mt-4 flex-1' id="parent">
                <div className='flex flex-col gap-4'>
                  <div>
                    <label htmlFor="description">Question *</label>
                    <CustomTinyMCEEditor improvement={improvementQuizOpen} closeImprovement={() => setImprovementQuizOpen(false)} onAIQueryButtonClick={handleAIButton} field='content' maxLength={150} onChange={(value) => {
                      form.setFieldValue("question", value)
                    }} aiProgress={aiProgress} quiz={improvedQuiz} acceptQuiz={acceptQuiz} placeholder='Enter the quiz question for this section here' value={form.values.question} aiOptionButtons={[OptionButtons.SUGGESTQUIZ, OptionButtons.IMPROVEQUIZ]} />
                  </div>
                  <div id="wrongAnswer" className='mt-2'>
                    <label htmlFor="description">Hint (optional)</label>
                    <CustomTinyMCEEditor field='hint' maxLength={150} onChange={(value) => {
                      form.setFieldValue("hint", value)
                    }} placeholder='Enter a hint for the student' value={form.values.hint} aiOptionButtons={[]} />
                  </div>
                  <div className='mt-2'>
                    <label htmlFor="description">Choices *</label>
                    <div className='flex flex-col gap-2 mt-1'>
                      <div className='flex gap-2 items-center w-full'>
                        <div className='w-10 flex font-medium text-sm justify-center items-center'>
                          A.
                        </div>
                        <div className='flex-1'>
                          <input onChange={form.handleChange} value={form.values.choices[0]} onBlur={form.handleBlur} name="choices[0]" id="choices[0]" type="text" placeholder='Choice A' className='h-10 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                        </div>
                      </div>
                      <div className='flex gap-2 items-center w-full'>
                        <div className='w-10 flex font-medium text-sm justify-center items-center'>
                          B.
                        </div>
                        <div className='flex-1'>
                          <input onChange={form.handleChange} value={form.values.choices[1]} onBlur={form.handleBlur} name="choices[1]" id="choices[1]" type="text" placeholder='Choice B' className='h-10 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                        </div>
                      </div>
                      <div className='flex gap-2 items-center w-full'>
                        <div className='w-10 flex font-medium text-sm justify-center items-center'>
                          C.
                        </div>
                        <div className='flex-1'>
                          <input onChange={form.handleChange} value={form.values.choices[2]} onBlur={form.handleBlur} name="choices[2]" id="choices[2]" type="text" placeholder='Choice C' className='h-10 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description">Correct answer</label>
                    <Select onChange={form.handleChange} value={form.values.correctAnswer} onBlur={form.handleBlur} name="correctAnswer" id="correctAnswer">
                      <option>Select the correct answer</option>
                      {form.values.choices.filter(e => e.length > 0).map(e => <option value={e} className='capitalize text-xs'>{e}</option>)}
                    </Select>
                  </div>
                  <div className='mt-2'>
                    <label htmlFor="description">Correct answer context *</label>
                    <CustomTinyMCEEditor field='correctAnswerContext' maxLength={150} onChange={(value) => {
                      form.setFieldValue("correctAnswerContext", value)
                    }} placeholder='Enter the message we should send when the user answers correctly' value={form.values.correctAnswerContext} aiOptionButtons={[]} />
                  </div>


                </div>

              </div>
              <div className='h-14 w-full'>
                <div className='justify-end flex h-full items-center gap-2'>
                  <button onClick={() => onClose()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
                  <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save section
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
