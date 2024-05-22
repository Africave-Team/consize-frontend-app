import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import he from "he"
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Select, Spinner, useToast } from '@chakra-ui/react'
import { addLessonQuiz, rewriteBlockQuiz, suggestBlockQuiz } from '@/services/secure.courses.service'
import { useCourseMgtStore } from '@/store/course.management.store'
import { QuizUnformed } from '@/type-definitions/secure.courses'
import { OptionButtons } from '@/type-definitions/course.mgt'
import { stripHtmlTags } from '@/utils/string-formatters'
import { delay } from '@/utils/tools'


const validationSchema = Yup.object({
  question: Yup.string(),
  correctAnswer: Yup.string().required(),
  correctAnswerContext: Yup.string(),
  wrongAnswerContext: Yup.string(),
  revisitChunk: Yup.string(),
  hint: Yup.string(),
  choices: Yup.array().of(Yup.string().required()).min(3).max(3)

})

export default function NewQuizForm ({ courseId, close }: { courseId: string, close: (reload?: boolean) => void }) {
  const { createContent } = useCourseMgtStore()
  const [improvementQuizOpen, setImprovementQuizOpen] = useState(false)
  const [improvedQuiz, setImprovedQuiz] = useState<QuizUnformed | null>(null)
  const [aiProgress, setAiProgress] = useState(false)
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      revisitChunk: "",
      hint: "",
      choices: ["", "", ""],
      question: "",
      correctAnswer: "yes",
      correctAnswerContext: "",
      wrongAnswerContext: ""
    },
    onSubmit: async function (values) {
      if (createContent) {
        const options = ["A", "B", "C"]
        let choices = values.choices
        let correctIndex = choices.indexOf(values.correctAnswer)
        const { message, data } = await addLessonQuiz({
          lessonId: createContent.lessonId, courseId, quiz: {
            choices,
            hint: values.hint,
            question: values.question,
            revisitChunk: `${values.correctAnswerContext}`,
            correctAnswerIndex: correctIndex,
            correctAnswerContext: values.correctAnswerContext,
            wrongAnswerContext: `${values.correctAnswerContext}`,
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

  const handleAIButton = async (type: OptionButtons) => {
    if (!createContent || !createContent.content) {
      return
    }
    // check if title is present
    if (type === OptionButtons.SUGGESTQUIZ) {
      setImprovementQuizOpen(true)
      setAiProgress(true)
      const { message, data } = await suggestBlockQuiz({
        content: stripHtmlTags(he.decode(createContent.content)),
        isFollowup: false
      })
      setImprovedQuiz(data)
      setAiProgress(false)
    } else if (type === OptionButtons.IMPROVEQUIZ) {
      setImprovementQuizOpen(true)
      setAiProgress(true)
      const { data } = await rewriteBlockQuiz({
        content: stripHtmlTags(he.decode(createContent.content)),
        isFollowup: false
      })
      setImprovedQuiz(data)
      setAiProgress(false)
    }
  }

  const acceptQuiz = async function (quiz: QuizUnformed) {
    form.setFieldValue("question", quiz.question)
    form.setFieldValue("choices", quiz.options)
    form.setFieldValue("hint", quiz.hint)
    form.setFieldValue("correctAnswer", quiz.options[Number(quiz.correct_answer)])
    form.setFieldValue("correctAnswerContext", quiz.explanation)
    form.setFieldValue("wrongAnswerContext", quiz.explanation)
    setImprovementQuizOpen(false)
    const item = document.getElementById('choices[2]')
    if (item) {
      item.focus()
      await delay(100)
      item.blur()
    }
  }

  return (
    <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
      <div className='flex justify-between items-center h-10'>
        <div className='font-semibold text-lg'>Add a new lesson quiz</div>
      </div>
      <div className='mt-4 flex-1 overflow-y-scroll' id="parent">
        <div className='flex flex-col gap-4'>
          <div>
            <label htmlFor="description">Question *</label>
            <CustomTinyMCEEditor isFollowup={false} improvement={improvementQuizOpen} closeImprovement={() => setImprovementQuizOpen(false)} onAIQueryButtonClick={handleAIButton} field='content' maxLength={150} onChange={(value) => {
              form.setFieldValue("question", value)
            }} aiProgress={aiProgress} quiz={improvedQuiz} acceptQuiz={acceptQuiz} placeholder='Enter the quiz question for this section here' value={form.values.question} aiOptionButtons={[OptionButtons.SUGGESTQUIZ, OptionButtons.IMPROVEQUIZ]} />
          </div>
          <div id="wrongAnswer" className='mt-2'>
            <label htmlFor="description">Hint *</label>
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
  )
}
