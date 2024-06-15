import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Editable, EditableInput, EditablePreview, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { FiEdit2, FiPlus, FiTrash } from 'react-icons/fi'
import { v4 } from 'uuid'
import { updateSurveyRequest } from '@/services/survey.services'
import { Survey } from '@/type-definitions/survey'

interface SurveyQuestion {
  id: string,
  question: string,
  choices: string[]
  responseType: "free-form" | "multi-choice" | string
}

const questionSchema = Yup.object({
  id: Yup.string().required(),
  choices: Yup.array().of(Yup.string()).when("responseType", {
    is: "multi-choice",
    then: schema => schema.min(3, "Provide three choices for the user to select from"),
    otherwise: schema => schema.min(0)
  }),
  responseType: Yup.string().oneOf(["free-form", "multi-choice"], "Select a valid response type"),
  question: Yup.string().required("Provide a question"),
})

const validationSchema = Yup.object({
  title: Yup.string().required(),
  questions: Yup.array().of(questionSchema).min(1)
})

export default function UpdateSurveyButton ({ onFinish, survey }: { onFinish: () => void, survey: Survey }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const form = useFormik<{ questions: SurveyQuestion[], title: string }>({
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    initialValues: {
      title: "",
      questions: []
    },
    async onSubmit (values, formikHelpers) {
      await updateSurveyRequest(values, survey.id)
      onClose()
      formikHelpers.resetForm()
      onFinish()
      toast({
        title: 'Finished',
        description: "Survey has been updated",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const handleButtonClick = () => {
    form.setFieldValue("title", survey.title)
    form.setFieldValue("questions", survey.questions)
    onOpen()
  }

  const addQuestion = async function () {
    let lastIndex = form.values.questions.length - 1
    const copy: SurveyQuestion[] = [...form.values.questions]
    if (lastIndex >= 0) {
      try {
        questionSchema.validateSync(copy[lastIndex])
      } catch (error) {
        toast({
          title: 'Form validation failed.',
          description: (error as any).message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        return
      }
    }
    copy.push({
      id: v4(),
      question: "",
      choices: [],
      responseType: ""
    })
    form.setFieldValue("questions", copy)
  }

  const deleteQuestion = function (index: number) {
    const copy: SurveyQuestion[] = [...form.values.questions]
    copy.splice(index, 1)
    form.setFieldValue("questions", copy)
  }


  return (
    <>
      <button onClick={handleButtonClick} className='flex gap-1 font-medium items-center justify-center w-10 rounded-md hover:bg-primary-dark hover:text-white h-10'>
        <FiEdit2 />
      </button>

      {isOpen && <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={'2xl'}
      >
        <ModalOverlay />
        <ModalContent className='min-h-48 p-0'>
          <ModalBody className='h-48 px-5 py-5'>
            <h2 className='font-semibold text-xl'>Update a survey</h2>
            <form onSubmit={form.handleSubmit} className='mt-5'>
              <div>
                <label htmlFor="">Survey title</label>
                <input onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} name={`title`} id={`title`} type="text" placeholder='Survey title' className='h-12 px-4 focus-visible:outline-none w-full rounded-md border-2 border-[#0D1F23]' />
              </div>

              <Accordion className='flex mt-5 flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>
                {form.values.questions.map((value: SurveyQuestion, index) => <AccordionItem className='border-none' key={value.id}>
                  <div className='flex justify-between items-center border rounded-md h-12 hover:!bg-[#FFF] bg-[#FFF] '>
                    <AccordionButton className='h-full hover:!bg-[#FFF] bg-[#FFF] rounded-lg flex gap-2'>
                      <div>
                        Question {index + 1}
                      </div>
                    </AccordionButton>
                    <div className='flex items-center gap-2 h-full'>
                      {form.values.questions.length > 1 && <button onClick={() => deleteQuestion(index)} className='h-10 hover:bg-gray-100 rounded-md w-10 flex justify-center items-center'>
                        <FiTrash />
                      </button>}
                      <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                        <AccordionIcon />
                      </AccordionButton>
                    </div>
                  </div>
                  <AccordionPanel className='py-2 px-5'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-col items-start'>
                        <div className='w-full'>
                          <label htmlFor="">Survey question</label>
                          <input onChange={form.handleChange} value={value.question} onBlur={form.handleBlur} name={`questions.${index}.question`} id={`questions.${index}.question`} type="text" placeholder='' className='h-12 px-4 focus-visible:outline-none w-full rounded-md border-2 border-[#0D1F23]' />
                        </div>

                        <div className='flex w-full gap-4 mt-4'>
                          {["free-form", "multi-choice"].map((value) => {
                            return (
                              <div onClick={() => {
                                form.setFieldValue(`questions.${index}.responseType`, value)
                              }} className={`capitalize cursor-pointer w-1/2 border-2 ${form.values.questions[index].responseType === value ? 'border-[#0CDA50] text-[#0CDA50]' : 'text-primary-dark border-primary-dark'} rounded-md h-12 gap-2 flex justify-start items-center px-3`} key={value}>
                                <div className={`flex justify-center items-center h-4 w-4 rounded-full border ${form.values.questions[index].responseType === value ? 'border-[#0CDA50]' : 'border-primary-dark'} `}>
                                  <div className={`h-2 w-2 rounded-full ${form.values.questions[index].responseType === value ? 'bg-[#0CDA50]' : 'bg-white'}`}></div>
                                </div>{value.replace('-', ' ')}
                              </div>
                            )
                          })}
                        </div>

                        <div className='flex flex-col w-full mt-3'>
                          {form.values.questions[index].responseType === "multi-choice" && <>
                            <div className='mt-2'>
                              <label htmlFor="description">Responses *</label>
                              <div className='flex flex-col gap-2 mt-1'>
                                <div className='flex gap-2 items-center w-full'>
                                  <div className='w-10 flex font-medium text-sm justify-center items-center'>
                                    A.
                                  </div>
                                  <div className='flex-1'>
                                    <input onChange={form.handleChange} value={value.choices[0]} onBlur={form.handleBlur} name={`questions.${index}.choices.0`} id={`questions.${index}.choices.0`} type="text" placeholder='Response A' className='h-12 px-4 focus-visible:outline-none w-full rounded-md border-2 border-[#0D1F23]' />
                                  </div>
                                </div>
                                <div className='flex gap-2 items-center w-full'>
                                  <div className='w-10 flex font-medium text-sm justify-center items-center'>
                                    B.
                                  </div>
                                  <div className='flex-1'>
                                    <input onChange={form.handleChange} value={value.choices[1]} onBlur={form.handleBlur} name={`questions.${index}.choices.1`} id={`questions.${index}.choices.1`} type="text" placeholder='Response B' className='h-12 px-4 focus-visible:outline-none w-full rounded-md border-2 border-[#0D1F23]' />
                                  </div>
                                </div>
                                <div className='flex gap-2 items-center w-full'>
                                  <div className='w-10 flex font-medium text-sm justify-center items-center'>
                                    C.
                                  </div>
                                  <div className='flex-1'>
                                    <input onChange={form.handleChange} value={value.choices[2]} onBlur={form.handleBlur} name={`questions.${index}.choices.2`} id={`questions.${index}.choices.2`} type="text" placeholder='Response C' className='h-12 px-4 focus-visible:outline-none w-full rounded-md border-2 border-[#0D1F23]' />
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

              <div className='mt-5 justify-between flex items-center'>
                <button type='button' className='h-12 w-32 flex gap-2 justify-center items-center rounded-md border' onClick={addQuestion}>
                  <FiPlus /> Question
                </button>
                <div className='flex gap-2 items-center'>
                  <button type='button' className='h-12 w-32 flex gap-2 justify-center items-center rounded-md border' onClick={onClose}>
                    Cancel
                  </button>
                  <button disabled={!form.isValid || form.isSubmitting} type='submit' className='h-12 w-40 flex gap-2 disabled:bg-primary-dark/50 justify-center items-center bg-primary-dark text-white rounded-md border'>
                    Save changes {form.isSubmitting && <Spinner size={'xs'} />}
                  </button>
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
