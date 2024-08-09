import { FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Popover, PopoverBody, PopoverContent, PopoverTrigger, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Course } from '@/type-definitions/secure.courses'
import { CohortsInterface } from '@/type-definitions/cohorts'
import { FiChevronDown, FiEdit2 } from 'react-icons/fi'
import { FaCheckCircle } from 'react-icons/fa'
import { FaPlus, FaTrash } from 'react-icons/fa6'
import { GrFavorite } from "react-icons/gr"
import { useFormik } from 'formik'
import { SlackCreateCohortValidator } from '@/validators/SlackCreateCohort'
import { createCohort, deleteCourseCohort, getCourseCohorts, updateCourseCohort } from '@/services/cohorts.services'
import { Distribution } from '@/type-definitions/callbacks'
import { queryClient } from '@/utils/react-query'
import { delay } from '@/utils/tools'
import { useQuery } from '@tanstack/react-query'

interface ApiResponse {
  data: CohortsInterface[]
  message: string
}


export default function CohortsButton ({ course, selectedCohort, tab, setSelectedCohort }: { course: Course, selectedCohort?: CohortsInterface, tab: string, setSelectedCohort: (val: CohortsInterface) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [action, setAction] = useState("none")
  const [cohorts, setCohorts] = useState<CohortsInterface[]>([])
  const [current, setCurrent] = useState<CohortsInterface | undefined>(selectedCohort)
  const [clickedItem, setClickedItem] = useState<CohortsInterface>()
  const toast = useToast()

  const loadData = async function (id: string, distribution: Distribution) {
    const data = await getCourseCohorts(id, distribution)
    return data
  }

  const { data: cohortResults, isFetching, refetch } =
    useQuery<ApiResponse>({
      queryKey: ['course-cohorts', { courseId: course.id, distribution: tab === "slack" ? Distribution.SLACK : Distribution.WHATSAPP }],
      queryFn: () => loadData(course.id, tab === "slack" ? Distribution.SLACK : Distribution.WHATSAPP)
    })


  useEffect(() => {
    setCurrent(selectedCohort)
  }, [selectedCohort])


  useEffect(() => {
    if (cohortResults && cohortResults.data && cohortResults.data[0]) {
      setSelectedCohort(cohortResults.data[0])
      setCurrent(cohortResults.data[0])
      setCohorts(cohortResults.data)
    }
  }, [cohortResults])

  const createCohortForm = useFormik({
    initialValues: {
      name: "",
    },
    validateOnChange: true,
    validationSchema: SlackCreateCohortValidator,
    onSubmit: async function (values, { resetForm }) {
      if (course) {
        if (action === "new") {
          const result = await createCohort({
            ...values,
            courseId: course.id,
            distribution: tab === "slack" ? Distribution.SLACK : Distribution.WHATSAPP
          })
          toast({
            description: "Cohort added successfully.",
            title: "Completed",
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
          setSelectedCohort(result.data)
        } else if (action === "edit") {
          if (clickedItem) {
            await updateCourseCohort(clickedItem.id, {
              ...values,
              default: clickedItem.default
            })
            toast({
              description: "Cohort renamed successfully.",
              title: "Completed",
              status: 'success',
              duration: 2000,
              isClosable: true,
            })
          }
        } else if (action === "favorite") {
          if (clickedItem) {
            await updateCourseCohort(clickedItem.id, {
              ...values,
              default: true
            })
            toast({
              description: "Cohort favorited successfully.",
              title: "Completed",
              status: 'success',
              duration: 2000,
              isClosable: true,
            })
          }
        } else if (action === "delete") {
          if (clickedItem) {
            await deleteCourseCohort(clickedItem.id)
            toast({
              description: "Cohort deleted successfully.",
              title: "Completed",
              status: 'success',
              duration: 2000,
              isClosable: true,
            })
          }
        }
        queryClient.invalidateQueries({
          queryKey: ['course-cohorts', { courseId: course.id, distribution: tab === "slack" ? Distribution.SLACK : Distribution.WHATSAPP }]
        })
        resetForm()
        onClose()
      }
    },
  })
  return (
    <div>

      <Popover placement='bottom-start'>
        <PopoverTrigger>
          <div className='flex flex-col min-w-32'>
            <label className='text-xs font-semibold' htmlFor="">Select a cohort</label>
            <button className='bg-white px-4 h-8 flex justify-between  items-center border-primary-dark border text-primary-dark rounded-md text-sm font-semibold'>
              {selectedCohort?.name}
              <FiChevronDown />
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className='bg-white border-primary-dark '>
          <PopoverBody className='h-52 overflow-y-scroll text-primary-dark text-sm'>
            <div className='flex justify-between items-center'>
              <div className='font-semibold'>Select a cohort</div>
              <Tooltip label="Create new cohort">
                <button onClick={() => {
                  setAction("new")
                  onOpen()
                  delay(200).then(() => {
                    let element = document.getElementById("name")
                    if (element) {
                      element.focus()
                    }
                  })
                }} className='h-6 w-6 rounded-full border border-primary-dark hover:bg-primary-dark hover:text-white flex justify-center items-center'>
                  <FaPlus />
                </button>
              </Tooltip>
            </div>
            <div className='flex flex-col gap-2 mt-2'>
              {cohorts.map((cohort) => <div key={cohort.id} className={`h-10 rounded-md px-2 hover:bg-primary-dark hover:text-white flex items-center group justify-between ${current?.id === cohort.id && 'bg-primary-dark text-white'}`}>
                <div onClick={() => { setSelectedCohort(cohort) }} className='flex gap-1 flex-1 items-center h-full text-xs cursor-pointer'>
                  {cohort.name}
                  {current?.id === cohort.id && <FaCheckCircle />}
                  {cohort.default && <div className='border rounded-2xl text-xs flex items-center justify-center px-2'>default</div>}
                </div>
                <div className='group-hover:flex justify-end hidden w-20 gap-1 items-center h-full'>
                  {!cohort.default && <Tooltip label="Make as default"><button onClick={() => {
                    setAction("favorite")
                    setClickedItem(cohort)
                    onOpen()
                  }} className='h-8 w-8 rounded-full border border-primary-dark hover:bg-black/50 flex justify-center items-center'>
                    <GrFavorite className='text-xs' />
                  </button></Tooltip>}
                  <Tooltip label="Rename cohort"><button onClick={() => {
                    setAction("edit")
                    createCohortForm.setFieldValue("name", cohort.name)
                    setClickedItem(cohort)
                    onOpen()
                    delay(200).then(() => {
                      let element = document.getElementById("name")
                      if (element) {
                        element.focus()
                      }
                    })
                  }} className='h-8 w-8 rounded-full border border-primary-dark hover:bg-black/50 flex justify-center items-center'>
                    <FiEdit2 className='text-xs' />
                  </button></Tooltip>
                  {cohort.members.length === 0 && <Tooltip label="Delete cohort"><button onClick={() => {
                    setAction("delete")
                    setClickedItem(cohort)
                    onOpen()
                  }} className='h-8 w-8 rounded-full border border-primary-dark hover:bg-black/50 flex justify-center items-center'>
                    <FaTrash className='text-xs' />
                  </button></Tooltip>}
                </div>
              </div>)}
            </div>
          </PopoverBody>
        </PopoverContent>
      </Popover>


      {isOpen && action !== "none" && <Modal size={'md'} onClose={() => {
        setClickedItem(undefined)
        onClose()
      }} isOpen={isOpen} isCentered={true}>

        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='border-b !py-3 text-base'>
            {action === "new" ? "Create a cohort" : action === "edit" ? "Rename a cohort" : "Delete a cohort"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {(action === "new" || action === "edit") && <form onSubmit={createCohortForm.handleSubmit}>
              <FormControl>
                <FormLabel className='text-sm mt-3' htmlFor='name' requiredIndicator={true}>Name this cohort <span className='text-red-500 text-xs'>*</span></FormLabel>
                <input id="name" name="name" value={createCohortForm.values.name} onChange={createCohortForm.handleChange} type="text" placeholder='Cohort name' className='w-full px-3 h-12 border rounded-lg' />
                {createCohortForm.errors.name && <span className='text-xs text-red-400'>{createCohortForm.errors.name}</span>}
              </FormControl>
              <button type="submit" className='h-10 my-5 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Save & close
                {createCohortForm.isSubmitting && <Spinner size={'sm'} />}
              </button>

            </form>}
            {action === "delete" && <div>
              <div>Are you sure you want to delete this cohort?</div>
              <form onSubmit={createCohortForm.handleSubmit}>
                <div className='flex justify-end'>
                  <button type="submit" className='h-10 my-5 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
                    {createCohortForm.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </form>
            </div>}
            {action === "favorite" && <div>
              <div>Are you sure you want to make this cohort the default cohort?</div>
              <form onSubmit={createCohortForm.handleSubmit}>
                <div className='flex justify-end'>
                  <button type="submit" className='h-10 my-5 flex jus items-center gap-2 rounded-lg px-4 text-white bg-primary-dark hover:bg-primary-dark/90'>Continue
                    {createCohortForm.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </form>
            </div>}
          </ModalBody>
        </ModalContent></Modal>}
    </div>
  )
}
