import { fetchSingleCourse, updateCourse } from '@/services/secure.courses.service'
import { fetchSurveyRequest, fetchSurveys } from '@/services/survey.services'
import { Course, CreateCoursePayload } from '@/type-definitions/secure.courses'
import { Survey } from '@/type-definitions/survey'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Modal, ModalBody, ModalContent, ModalOverlay, Skeleton, Spinner, useDisclosure } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { FiCheckCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'
import CreateSurveyButton from '../FormButtons/CreateSurveyButton'
import { queryClient } from '@/utils/react-query'
import UpdateSurveyButton from '../FormButtons/EditSurveyButton'
interface SurveyQuestion {
  id: string,
  question: string,
  choices: string[]
  responseType: "free-form" | "multi-choice" | string
}
interface ApiResponse {
  data: Course
  message: string
}

interface SurveyApiResponse {
  data: Survey | null
  message: string
}

interface SurveysApiResponse {
  data: Survey[]
  message: string
}

export default function CourseSurveyCard ({ courseId, surveyId }: { courseId: string, surveyId?: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [selected, setSelected] = useState(surveyId)
  const [active, setActive] = useState<Survey>()

  const loadData = async function (payload: { course: string }) {
    const data = await fetchSingleCourse(payload.course)
    return data
  }

  const loadSurveyData = async function (payload: { survey?: string }): Promise<SurveyApiResponse> {
    if (payload.survey) {
      return fetchSurveyRequest(payload.survey)
    }
    return {
      message: "",
      data: null
    }
  }

  const { data: courseDetails, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course', courseId],
      queryFn: () => loadData({ course: courseId })
    })
  const { data: surveyDetails } =
    useQuery<SurveyApiResponse>({
      queryKey: ['survey', surveyId],
      queryFn: () => loadSurveyData({ survey: surveyId })
    })

  const { data: surveys } =
    useQuery<SurveysApiResponse>({
      queryKey: ['surveys'],
      queryFn: () => fetchSurveys()
    })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: Partial<CreateCoursePayload> }) => updateCourse({
      ...data.payload
    }, data.id)
  })

  const attachSurvey = async function (id?: string) {
    if (courseId && id) {
      await updateMutation.mutateAsync({ id: courseId, payload: { survey: id } })
      queryClient.invalidateQueries({
        queryKey: ['surveys']
      })
      refetch()
      onClose()
    }
  }

  const removeSurvey = async function () {
    if (courseId) {
      await updateMutation.mutateAsync({ id: courseId, payload: { survey: null } })
      refetch()
    }
  }

  useEffect(() => {
    if (courseDetails && courseDetails.data && courseDetails.data.survey) {
      setSelected(courseDetails.data.survey)
      if (surveys) {
        setActive(surveys.data.find(e => e.id === courseDetails.data.survey))
      }
    }
  }, [courseDetails, surveys])
  return (
    <div>
      {isFetching ? <Skeleton className='h-12 border w-full' /> :
        <div className='h-12 rounded-md flex items-center justify-between border w-full px-2'>
          {surveyDetails && surveyDetails.data && <div className='flex flex-col'>
            <div className='text-xs'>
              Active survey
            </div>
            <div className='text-base -mt-1 font-semibold'>
              {surveyDetails?.data?.title}
            </div>
          </div>}
          {surveyDetails && surveyDetails.data && <div className='flex gap-2'>
            <button onClick={onOpen} className='h-10 w-10 rounded-md border flex justify-center items-center'>
              <FiEdit2 />
            </button>
            <button onClick={() => removeSurvey()} className='h-10 w-10 rounded-md border flex justify-center items-center'>
              <FiTrash2 />
            </button>
          </div>}
          {!surveyDetails || !surveyDetails.data && <div onClick={onOpen} className='text-sm cursor-pointer text-center font-medium'>Add survey</div>}
        </div>
      }

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'6xl'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-[400px]'>
          <ModalBody className='flex overflow-hidden h-full py-5'>
            <div className='w-4/12 h-[400px]'>
              <div className='font-semibold text-base'>Set a course survey</div>
              <div className='flex flex-col gap-3 my-5 '>
                {surveys && surveys.data.map((survey) => (<div onClick={() => {
                  setSelected(survey.id)
                  setActive(survey)
                }} key={survey.id} className={`h-16 flex justify-between items-center px-3 border cursor-pointer rounded-md ${selected === survey.id && 'bg-primary-dark text-white'}`}>
                  <div className='flex flex-col justify-center'>
                    <div className='text-sm font-semibold'>{survey.title}</div>
                    <div className='text-xs'>{survey.questions.length} questions</div>
                  </div>
                  {courseDetails?.data.survey === survey.id && <div className={`h-10 w-10 flex justify-center rounded-full items-center ${selected === survey.id ? 'bg-white text-primary-dark' : 'bg-primary-dark text-white'} bg-primary-app`}>
                    <FiCheckCircle />
                  </div>}
                </div>))}
              </div>
              <CreateSurveyButton onFinish={attachSurvey} />
            </div>
            <div className='w-8/12 h-[550px] overflow-y-scroll p-8'>
              <div className='h-10 flex justify-end gap-3'>
                {active && courseDetails?.data.survey !== active.id && <button onClick={() => attachSurvey(active.id)} className='h-10 w-auto px-4 rounded-md border flex justify-center gap-2 items-center'>
                  Use this survey {updateMutation.isPending && <Spinner size={'sm'} />}
                </button>}
                {active && <UpdateSurveyButton survey={active} onFinish={() => queryClient.invalidateQueries({ queryKey: ['surveys'] })} />}
              </div>
              <div>
                <label className='font-medium text-base' htmlFor="">Survey title</label>
                <div className=''>
                  {active?.title}
                </div>
              </div>

              <Accordion className='flex mt-5 flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
                {active && active.questions.map((value: SurveyQuestion, index) => <AccordionItem className='border-none' key={value.id}>
                  <div className='flex justify-between items-center border rounded-md h-12 hover:!bg-[#FFF] bg-[#FFF] '>
                    <AccordionButton className='h-full hover:!bg-[#FFF] bg-[#FFF] rounded-lg flex gap-2'>
                      <div>
                        Question {index + 1}
                      </div>
                    </AccordionButton>
                    <div className='flex items-center gap-2 h-full'>
                      <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                        <AccordionIcon />
                      </AccordionButton>
                    </div>
                  </div>
                  <AccordionPanel className='py-2 px-5'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-col items-start'>
                        <div className='w-full'>
                          <label className='font-medium text-base' htmlFor="">Survey question</label>
                          <div className=''>
                            {value.question}
                          </div>
                        </div>

                        <div className='flex flex-col w-full mt-4'>
                          <label className='font-medium text-base' htmlFor="description">Response type</label>
                          <div>{value.responseType === "multi-choice" ? "Multiple choice question" : "Subjective response"}</div>
                        </div>

                        <div className='flex flex-col w-full mt-3'>
                          {value.responseType === "multi-choice" && <>
                            <div className='mt-2'>
                              <label className='font-medium text-base' htmlFor="description">Responses</label>
                              <div className='flex flex-col gap-2 mt-1'>
                                <div className='flex gap-2 items-center w-full'>
                                  <div className='w-10 flex font-medium text-sm justify-center items-center'>
                                    A.
                                  </div>
                                  <div className='flex-1'>
                                    <div className=''>
                                      {value.choices[0]}
                                    </div>
                                  </div>
                                </div>
                                <div className='flex gap-2 items-center w-full'>
                                  <div className='w-10 flex font-medium text-sm justify-center items-center'>
                                    B.
                                  </div>
                                  <div className='flex-1'>
                                    <div className=''>
                                      {value.choices[1]}
                                    </div>
                                  </div>
                                </div>
                                <div className='flex gap-2 items-center w-full'>
                                  <div className='w-10 flex font-medium text-sm justify-center items-center'>
                                    C.
                                  </div>
                                  <div className='flex-1'>
                                    <div className=''>
                                      {value.choices[2]}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>}
                        </div>
                      </div>
                    </div>
                  </AccordionPanel>
                </AccordionItem>)}
              </Accordion>

            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </div>
  )
}
