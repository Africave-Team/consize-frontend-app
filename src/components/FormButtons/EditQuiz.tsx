import React, { useEffect } from 'react'
import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Modal, ModalBody, ModalContent, ModalOverlay, Select, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { addLessonQuiz, updateQuiz } from '@/services/secure.courses.service'
import { useCourseMgtStore } from '@/store/course.management.store'
import { Quiz } from '@/type-definitions/secure.courses'
import { FiEdit2 } from 'react-icons/fi'


const validationSchema = Yup.object({
  question: Yup.string(),
  correctAnswer: Yup.string().required(),
  correctAnswerContext: Yup.string(),
  wrongAnswerContext: Yup.string(),
  revisitChunk: Yup.string(),
  hint: Yup.string(),
  choices: Yup.array().of(Yup.string().required()).min(3).max(3)

})

export default function EditQuizForm ({ refetch, quiz }: { quiz: Quiz, refetch: () => Promise<any> }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
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
  return (
    <div>
      <button onClick={onOpen} className={`h-10 hover:bg-gray-100 rounded-lg hidden group-hover:flex justify-center items-center w-10`}>
        <FiEdit2 />
      </button>
      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'lg'}
      >
        <ModalOverlay />
        <ModalContent className='h-[85vh] p-0'>
          <ModalBody className='h-48 px-2 py-5'>
            <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
              <div className='flex justify-between items-center h-10'>
                <div className='font-semibold text-lg'>Add a new lesson quiz</div>
              </div>
              <div className='mt-4 flex-1 overflow-y-scroll' id="parent">
                <div className='flex flex-col gap-4'>
                  <div>
                    <label htmlFor="description">Question *</label>
                    <CustomTinyMCEEditor field='question' maxLength={150} onChange={(value) => {
                      form.setFieldValue("question", value)
                    }} placeholder='Enter the follow-up question for this section here' value={form.values.question} aiOptionButtons={[]} />
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
                  <button onClick={() => close()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
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