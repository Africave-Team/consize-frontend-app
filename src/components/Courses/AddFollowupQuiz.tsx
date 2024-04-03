import React, { useEffect } from 'react'
import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Select, Spinner, useRadioGroup, useToast } from '@chakra-ui/react'
import { addBlockQuiz, addLessonQuiz } from '@/services/secure.courses.service'
import { useCourseMgtStore } from '@/store/course.management.store'
import RadioCard from '../RadioCard'


const validationSchema = Yup.object({
  question: Yup.string().required(),
  correctAnswer: Yup.string().required(),
  correctAnswerContext: Yup.string().required(),
  wrongAnswerContext: Yup.string().required(),
  choices: Yup.array().of(Yup.string().required()).min(2).max(2)

})

export default function NewBlockQuizForm ({ courseId, close, blockId }: { courseId: string, close: (reload?: boolean) => void, blockId: string }) {
  const { createContent } = useCourseMgtStore()
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      choices: ["yes", "no"],
      question: "",
      correctAnswer: "yes",
      correctAnswerContext: "",
      wrongAnswerContext: ""
    },
    onSubmit: async function (values) {
      if (createContent) {
        let choices = values.choices
        let correctIndex = choices.indexOf(values.correctAnswer)
        const { message, data } = await addBlockQuiz({
          lessonId: createContent.lessonId, courseId, blockId, quiz: {
            choices,
            question: values.question,
            correctAnswerIndex: correctIndex,
            correctAnswerContext: values.correctAnswerContext,
            wrongAnswerContext: values.wrongAnswerContext,
          }
        })
        toast({
          description: message,
          title: "Completed",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        close(true)

      }
    },
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'correctAnswer',
    defaultValue: form.values.correctAnswer,
    onChange: (val) => {
      form.setFieldValue("correctAnswer", val)
    },
  })

  const group = getRootProps()

  return (
    <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
      <div className='flex justify-between items-center h-10'>
        <div className='font-semibold text-lg'>Add a new block quiz</div>
      </div>
      <div className='mt-4 flex-1 overflow-y-scroll' id="parent">
        <>
          <div>
            <label htmlFor="description">Question *</label>
            <CustomTinyMCEEditor field='question' maxLength={150} onChange={(value) => {
              form.setFieldValue("question", value)
            }} placeholder='Enter the follow-up question for this section here' value={form.values.question} aiOptionButtons={[]} />
          </div>
          <div>
            <label htmlFor="">Correct answer</label>
            <div className='flex mt-1 w-full gap-3' {...group}>
              {["yes", "no"].map((value) => {
                const radio = getRadioProps({ value })
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                )
              })}
            </div>
          </div>
          <div className='mt-3'>
            <label htmlFor="description">Correct answer context *</label>
            <CustomTinyMCEEditor field='correctAnswerContext' maxLength={150} onChange={(value) => {
              form.setFieldValue("correctAnswerContext", value)
            }} placeholder='Enter the message we should send when the user answers correctly' value={form.values.correctAnswerContext} aiOptionButtons={[]} />
          </div>

          <div id="wrongAnswer" className='mt-2'>
            <label htmlFor="description">Wrong answer context *</label>
            <CustomTinyMCEEditor field='wrongAnswerContext' maxLength={150} onChange={(value) => {
              form.setFieldValue("wrongAnswerContext", value)
            }} placeholder='Enter the message we should send when the user answers wrongly' value={form.values.wrongAnswerContext} aiOptionButtons={[]} />
          </div>

        </>
      </div>
      <div className='h-14 w-full'>
        <div className='justify-end flex h-full items-center gap-2'>
          <button onClick={() => close()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
          <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Add to block
            {form.isSubmitting && <Spinner size={'sm'} />}
          </button>
        </div>
      </div>
    </form>
  )
}
