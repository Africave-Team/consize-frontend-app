"use client"
import CustomTinyMCEEditor from '@/components/CustomTinyEditor'
import FileUploader from '@/components/FileUploader'
import ImageBuilder from '@/components/FormButtons/ImageBuilder'
import Layout from '@/layouts/PageTransition'
import { FileTypes } from '@/type-definitions/utils'
import React from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Course, CourseStatus, CreateCoursePayload, MediaType } from '@/type-definitions/secure.courses'
import { createCourse } from '@/services/secure.courses.service'
import { useRouter } from 'next/navigation'
import { Spinner, useToast } from '@chakra-ui/react'
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd'
import CourseItem from '@/components/Courses/CourseItem'
import SearchCourses from '@/components/Courses/SearchCourses'


const validationSchema = Yup.object({
  title: Yup.string().required("Provide a title for this bundle"),
  description: Yup.string().required("Enter a description for this bundle"),
  headerMedia: Yup.object({
    mediaType: Yup.string().required(),
    url: Yup.string().required()
  }).required("Supply an header photo"),
  courses: Yup.array().of(Yup.string()).min(2, "Bundles must have at least two courses")
})

enum PageType {
  ALL = 'all',
  COURSE = 'course',
  BUNDLE = 'bundle',
  DRAFT = 'draft'
}

export default function CreateBundlePageContent () {
  const router = useRouter()
  const toast = useToast()
  const form = useFormik<Pick<CreateCoursePayload, "title" | "description" | "courses" | "status" | "headerMedia">>({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      title: "",
      description: "",
      courses: [],
      status: CourseStatus.DRAFT,
      headerMedia: {
        mediaType: MediaType.IMAGE,
        url: ""
      }
    },
    onSubmit: async function (values) {
      const { data, message }: { message: string, data: Course } = await createCourse({
        ...values,
        free: true,
        bundle: true,
        private: false,
      })
      toast({
        description: message,
        title: "Completed",
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      let path = `/dashboard/courses/${data.id}/builder/publish`
      router.push(path)
    },
  })
  const onDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    const copy = form.values.courses ? [...form.values.courses] : []
    const item = copy[source.index]
    copy.splice(source.index, 1)
    copy.splice(destination.index, 0, item)
    form.setFieldValue("courses", copy)
  }
  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='px-5 pt-5'>
          <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
            <div className='font-semibold md:text-2xl text-xl'>
              Step 1
            </div>
          </div>
          <div>
            In this step, we'll ask you the name of your course bundle and what it’s about.
          </div>
        </div>
        <div className='flex-1 flex justify-center md:py-5'>
          <div className='w-full md:w-2/5'>
            <div className='px-4 font-semibold text-base mb-3'>
              Courses in this bundle
              <p className='text-xs text-gray-400 mb-3'>Drag handles to reorder the courses</p>
            </div>
            <div className='w-full px-3'>
              <SearchCourses filter={PageType.COURSE} onSelect={(course) => {
                const pg = form.values.courses ? [...form.values.courses] : []
                let index = pg.findIndex(e => e === course.id)
                if (index === -1) {
                  pg.push(course.id)
                }
                form.setFieldValue("courses", pg)
              }} />
            </div>
            {!form.values.courses || form.values.courses.length === 0 &&
              <div className='text-xs text-gray-400 py-3 px-4'>
                No courses have been added to this bundle
              </div>
            }
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='bundle-courses'>
                {(droppableProvided) => (
                  <div className='mt-5 px-4' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                    {form.values.courses?.map((e, index) => <CourseItem onDelete={() => {
                      const pg = form.values.courses ? [...form.values.courses] : []
                      pg.splice(index, 1)
                      form.setFieldValue("courses", pg)
                    }} key={e} index={index} id={e} />)}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className='px-8 w-full md:w-3/5'>
            <div className='w-4/5 mt-10'>
              <form onSubmit={form.handleSubmit} className='flex flex-col gap-4'>
                <div>
                  <label htmlFor="title">Course bundle title *</label>
                  <input onChange={form.handleChange} onBlur={form.handleBlur} id="title" type="text" placeholder='Course title' className='h-12 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                </div>

                <div>
                  <label htmlFor="description">Course bundle description *</label>
                  <CustomTinyMCEEditor field='description' maxLength={250} onChange={(value) => {
                    form.setFieldValue("description", value)
                  }} placeholder='Describe your course for us' value={form.values.description} aiOptionButtons={[]} />
                </div>
                <div >
                  <div className='flex justify-between items-center'>
                    <label htmlFor="">Course bundle header image</label>
                    <ImageBuilder imageText={form.values.title} onFileUploaded={(val) => {
                      form.setFieldValue("headerMedia.url", val)
                    }} label='Build header' />
                  </div>
                  <FileUploader originalUrl={form.values.headerMedia.url} mimeTypes={[FileTypes.IMAGE]} droppable={false} onUploadComplete={(val) => {
                    form.setFieldValue("headerMedia.url", val)
                  }} previewable={true} />
                </div>
                <div className='justify-end flex'>
                  <button disabled={!form.isValid} type='submit' className='text-sm px-10 h-10 border items-center justify-center text-white bg-[#0D1F23] flex gap-1 disabled:bg-[#0D1F23]/60 rounded-lg'>Next
                    {form.isSubmitting && <Spinner size={'sm'} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
