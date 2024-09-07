import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import he from "he"
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Select, Spinner, useToast } from '@chakra-ui/react'
import { addAssessmentQuiz, addLessonQuiz, rewriteBlockQuiz, suggestBlockQuiz } from '@/services/secure.courses.service'
import { useCourseMgtStore } from '@/store/course.management.store'
import { QuestionTypes, QuizUnformed } from '@/type-definitions/secure.courses'
import { OptionButtons } from '@/type-definitions/course.mgt'
import { stripHtmlTags } from '@/utils/string-formatters'
import { delay } from '@/utils/tools'
import { queryClient } from '@/utils/react-query'


const validationSchema = Yup.object({
  question: Yup.string(),
  correctAnswer: Yup.string().required(),
  correctAnswerContext: Yup.string(),
  wrongAnswerContext: Yup.string(),
  revisitChunk: Yup.string(),
  hint: Yup.string(),
  choices: Yup.array().of(Yup.string().required()).min(3).max(3)

})

export default function NewAssessmentQuestionForm ({ courseId, close, assessment }: { courseId: string, close: () => void, assessment: string }) {
  const { createContent } = useCourseMgtStore()
  const [improvementQuizOpen, setImprovementQuizOpen] = useState(false)
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      revisitChunk: "Hey",
      hint: "Hey",
      choices: ["", "", ""],
      question: "",
      correctAnswer: "",
      correctAnswerContext: "Hey",
      wrongAnswerContext: "Hey"
    },
    onSubmit: async function (values) {
      if (createContent) {
        let choices = values.choices
        let correctIndex = choices.indexOf(values.correctAnswer)
        const { message, data } = await addAssessmentQuiz({
          lessonId: assessment, courseId, quiz: {
            choices,
            hint: values.hint,
            questionType: QuestionTypes.OBJECTIVE,
            question: values.question,
            block: createContent.blockId,
            revisitChunk: `${values.correctAnswerContext}`,
            correctAnswerIndex: correctIndex,
            correctAnswerContext: values.correctAnswerContext,
            wrongAnswerContext: `${values.correctAnswerContext}`,
          }
        })
        queryClient.invalidateQueries({
          queryKey: ['course', courseId],
        })
        queryClient.invalidateQueries({
          queryKey: ['assessment', { assessmentId: assessment, courseId }],
        })
        toast({
          description: message,
          title: "Completed",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        delay(1000).then(() => close())
      }
    },
  })


  return (
    <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
      <div className='flex justify-between items-center h-10'>
        <div className='font-semibold text-lg'>Add a new assessment question</div>
      </div>
      <div className='mt-4 flex-1 overflow-y-scroll' id="parent">
        <div className='flex flex-col gap-4'>
          <div>
            <label htmlFor="description">Question *</label>
            <CustomTinyMCEEditor isFollowup={false} improvement={improvementQuizOpen} closeImprovement={() => setImprovementQuizOpen(false)} field='content' maxLength={150} onChange={(value) => {
              form.setFieldValue("question", value)
            }} placeholder='Enter the question here' value={form.values.question} aiOptionButtons={[]} />
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

        </div>

      </div>
      <div className='h-14 w-full'>
        <div className='justify-end flex h-full items-center gap-2'>
          <button onClick={() => close()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
          <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save question
            {form.isSubmitting && <Spinner size={'sm'} />}
          </button>
        </div>
      </div>
    </form>
  )
}
