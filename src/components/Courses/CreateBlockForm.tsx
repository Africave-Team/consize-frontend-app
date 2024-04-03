import React, { useEffect } from 'react'
import * as Yup from 'yup'
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import { useFormik } from 'formik'
import { Checkbox, HStack, Spinner, useRadioGroup, useToast } from '@chakra-ui/react'
import he from "he"
import FileUploader from '../FileUploader'
import { MediaType } from '@/type-definitions/secure.courses'
import { FileTypes } from '@/type-definitions/utils'
import RadioCard from '../RadioCard'
import { addBlockQuiz, addLessonBlock } from '@/services/secure.courses.service'
import { useCourseMgtStore } from '@/store/course.management.store'
import { convertToWhatsAppString } from '@/utils/string-formatters'
import mime from "mime-types"


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

export default function NewBlockForm ({ courseId, close }: { courseId: string, close: (reload?: boolean) => void }) {
  const { createContent } = useCourseMgtStore()
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      title: "",
      allowQuiz: false,
      content: "",
      bodyMedia: {
        mediaType: MediaType.IMAGE,
        url: ""
      },
      quiz: {
        question: "",
        correctAnswer: "yes",
        correctAnswerContext: "",
        wrongAnswerContext: ""
      }
    },
    onSubmit: async function (values) {
      if (createContent) {
        if (values.bodyMedia && values.bodyMedia.url) {
          const mimeType = mime.lookup(values.bodyMedia.url)
          if (mimeType) {
            values.bodyMedia.mediaType = mimeType.split('/')[0] as MediaType
          }
        }
        const { message, data } = await addLessonBlock({
          lessonId: createContent.lessonId, courseId, block: {
            title: values.title,
            content: values.content,
            bodyMedia: values.bodyMedia
          }
        })
        if (values.allowQuiz && data && values.quiz) {
          // add quiz
          let choices = ["yes", "no"]
          await addBlockQuiz({
            lessonId: createContent.lessonId, courseId, blockId: data.id, quiz: {
              choices,
              question: values.quiz.question,
              correctAnswerIndex: choices.indexOf(values.quiz.correctAnswer),
              correctAnswerContext: values.quiz.correctAnswerContext,
              wrongAnswerContext: values.quiz.wrongAnswerContext
            }
          })
        }
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

  return (
    <form onSubmit={form.handleSubmit} className='w-full h-full p-3 flex flex-col justify-between'>
      <div className='flex justify-between items-center h-10'>
        <div className='font-semibold text-lg'>Add a new lesson section</div>
        <div className={`font-semibold text-sm flex gap-1 items-center ${contentLength() <= 1000 ? 'text-green-500' : 'text-red-500'}`}>Total content length {contentLength()}:{contentLength() <= 1000 ? 'Good' : 'Bad'}</div>
      </div>
      <div className='mt-4 flex-1 overflow-y-scroll' id="parent">
        <div className='flex flex-col gap-4'>
          <div>
            <label htmlFor="title">Section title *</label>
            <input onChange={form.handleChange} value={form.values.title} onBlur={form.handleBlur} name="title" id="title" type="text" placeholder='Section title' className='h-14 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
          </div>
          <div>
            <label htmlFor="description">Section content *</label>
            <CustomTinyMCEEditor field='content' maxLength={allowedContentLength()} onChange={(value) => {
              form.setFieldValue("content", value)
            }} placeholder='Enter the content of this section here' value={form.values.content} aiOptionButtons={[]} />
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
          <div className='flex gap-2 items-center flex-row-reverse justify-end'>
            <Checkbox onChange={(val) => {
              form.setFieldValue('allowQuiz', val.target.checked)
            }} isChecked={form.values.allowQuiz}>
              Add a follow up quiz
            </Checkbox>
          </div>

          <div className={`transition-all duration-500 flex flex-col gap-3 ${form.values.allowQuiz ? 'h-[500px]' : 'h-0'}`}>
            {form.values.allowQuiz && <>
              <div>
                <label htmlFor="description">Question *</label>
                <CustomTinyMCEEditor field='content' maxLength={150} onChange={(value) => {
                  form.setFieldValue("quiz.question", value)
                }} placeholder='Enter the follow-up question for this section here' value={form.values.quiz.question} aiOptionButtons={[]} />
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
          <button onClick={() => close()} className='bg-gray-100 h-10 rounded-lg text-primary-dark px-5 text-sm'>Cancel</button>
          <button disabled={!form.isValid} type='submit' className='text-sm px-5 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Save section
            {form.isSubmitting && <Spinner size={'sm'} />}
          </button>
        </div>
      </div>
    </form>
  )
}
