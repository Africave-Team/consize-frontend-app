import { fetchQUestionsByCourseId, updateAssessment } from '@/services/lessons.service'
import { QuestionGroupsInterface, Quiz } from '@/type-definitions/secure.courses'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Checkbox, Spinner, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import he from 'he'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { fetchSingleAssessment } from '@/services/secure.courses.service'
import { queryClient } from '@/utils/react-query'
import { delay } from '@/utils/tools'

const validationSchema = Yup.object({
  selectAll: Yup.boolean().required(),
  questions: Yup.array().of(Yup.string()).min(1),
})

interface ApiResponse {
  data: Quiz[]
  message: string
}


interface AssessmentApiResponse {
  data: QuestionGroupsInterface
  message: string
}

export default function SelectAssessmentQuestions ({ assessmentId, courseId, onClose, assessment }: { courseId: string, assessmentId: string, onClose: () => void, assessment: QuestionGroupsInterface }) {

  const loadData = async function (payload: { assessment: string, course: string }) {
    const data = await fetchQUestionsByCourseId({ courseId: payload.course, assessment: payload.assessment })
    return data
  }


  const { data: questions, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['questions', { assessmentId, courseId }],
      queryFn: () => loadData({ assessment: assessmentId, course: courseId })
    })

  const toast = useToast()


  const form = useFormik({
    validationSchema,
    initialValues: {
      questions: [] as string[],
      selectAll: false
    },
    onSubmit: async (val) => {
      if (assessment) {
        await updateAssessment({
          assessment: {
            questions: [...assessment.questions.map((ast) => {
              if (typeof ast === "string") return ast
              return ast._id || ast.id || ""

            }).filter(e => e !== ""), ...val.questions]
          }, assessmentId, courseId
        })
        queryClient.invalidateQueries({ queryKey: ['course', courseId] })
        queryClient.invalidateQueries({
          queryKey: ['assessment', { assessmentId, courseId }],
        })
        toast({
          description: "Selected questions have been added",
          title: "Completed",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        delay(1000).then(() => onClose())
      }
    }
  })
  return (
    <div className='min-h-[20vh]'>
      {isFetching ? <div className='flex min-h-[20vh] justify-center items-center w-full'>
        <Spinner size={'sm'} />
      </div> : <>
        <form onSubmit={form.handleSubmit} className='p-5'>
          <div>Select from this list, questions to add to this assessment</div>
          {questions && <div className='my-5'>
            <Checkbox className='ml-4 mb-3' onChange={(val) => {
              if (val.target.checked && questions.data) {
                form.setFieldValue("questions", questions.data.map(e => e.id))
              } else {
                form.setFieldValue("questions", [])
              }
            }} isChecked={form.values.questions.length === questions.data.length}>
              Select all
            </Checkbox>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>

              {questions?.data.map((question, index) => {
                let id = question.id || question._id || index + ""
                return <AccordionItem key={id} className='rounded-md w-full border'>
                  <div className='flex group'>
                    <AccordionButton className='hover:bg-white flex gap-2 items-center'>
                      <Checkbox onChange={(val) => {
                        let copy: string[] = [...form.values.questions]
                        if (val.target.checked) {
                          copy.push(id)
                        } else {
                          let index = copy.findIndex(e => e === id)
                          if (index >= 0) {
                            copy.splice(index, 1)
                          }
                        }
                        form.setFieldValue("questions", copy)
                      }} isChecked={form.values.questions.includes(id)} />
                      <Box className='font-semibold text-sm line-clamp-1' as="span" flex='1' textAlign='left' dangerouslySetInnerHTML={{ __html: he.decode(question.question) }} />
                    </AccordionButton>
                    <div className='flex gap-2 items-center pr-3'>
                      <div className='flex gap-1 h-10 items-center'>
                        {/* <EditQuizForm block={block.id} quiz={quiz} content={block.content} refetch={async () => {

        }} /> */}
                        {/* <DeleteLessonQuizButton lessonId={value.id} quizId={question.id} refetch={async () => {

        }} /> */}
                      </div>
                      <AccordionButton className='hover:bg-white px-0'>
                        <AccordionIcon />
                      </AccordionButton>
                    </div>
                  </div>
                  <AccordionPanel pb={4}>
                    <div className='flex flex-col gap-2'>
                      <div>
                        <label className='font-semibold text-sm' htmlFor="">Question</label>
                        <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(question.question) }} />
                      </div>


                      <div>
                        <label className='font-semibold text-sm' htmlFor="">Choices</label>
                        {question.choices.map((val, index) => <div key={val + index} className='text-sm'>{["A", "B", "C"][index]}: {val}</div>)}
                      </div>
                      <div>
                        <label className='font-semibold text-sm' htmlFor="">Correct answer</label>
                        <div className='text-sm'>{["A", "B", "C"][question.correctAnswerIndex]}</div>
                      </div>

                    </div>
                  </AccordionPanel>
                </AccordionItem>
              })}
            </Accordion>

            <div className='h-14 w-full mt-4'>
              <div className='justify-end flex h-full items-center gap-2'>
                <button onClick={() => onClose()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
                <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Add selection
                  {form.isSubmitting && <Spinner size={'sm'} />}
                </button>
              </div>
            </div>
          </div>}
        </form>
      </>}
    </div>
  )
}
