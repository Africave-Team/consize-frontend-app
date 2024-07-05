"use client"
import Layout from '@/layouts/PageTransition'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Course } from '@/type-definitions/secure.courses'
import { generateCourseOutlineFile } from '@/services/secure.courses.service'
import { useRouter } from 'next/navigation'
import { Spinner, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import FileUploader from '@/components/FileUploader'
import { FileTypes } from '@/type-definitions/utils'
import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { FiTrash2, FiUploadCloud } from 'react-icons/fi'
import uploadFile from '@/services/upload.service'


const validationSchema = Yup.object({
  title: Yup.string().required(),
  files: Yup.array().of(Yup.string().required()),
})

export default function page () {
  const router = useRouter()
  const [addedFiles, setAddedFiles] = useState<File[]>([])
  const toast = useToast()
  const form = useFormik({
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      title: "",
      files: [],
      id: ""
    },
    onSubmit: async function (values, { setFieldValue }) {
      try {
        // run upload here
        let files: string[] = []
        await Promise.all(addedFiles.map(async (file) => {
          const formData = new FormData()
          const originalName = file.name
          const fileExtension = originalName.substring(originalName.lastIndexOf('.'))
          let timestamp = new Date().getTime()
          formData.append("file", file, `${timestamp}${fileExtension}`)
          // upload and return the url to the parent
          const { data } = await uploadFile(formData)
          if (data) {
            files.push(data)
          }
          return file
        }))
        const { data }: { data: Course } = await generateCourseOutlineFile({
          title: values.title,
          files
        })
        toast({
          title: "Completed",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        router.push(`/dashboard/courses/${data.id}/builder/ai/finish`)
      } catch (error) {
        console.log(error)
      }
    },
  })

  const maxFileSize = 15 * 1024 * 1024
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    let files: File[] = [...addedFiles]
    let excess = false
    for (let file of acceptedFiles) {
      if (file.size > maxFileSize) {
        toast({
          title: "Error",
          description: 'File size exceeds the maximum allowed size',
          status: "error"
        })
        return
      }
      if (file && files.length < 10) {
        files.push(file)
      } else {
        excess = true
      }
    }
    setAddedFiles(files)
    if (excess) {
      toast({
        title: "Error",
        description: 'Maximum allowed is 10 documents',
        status: "error"
      })
    }
  }, [addedFiles, setAddedFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 10,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/vnd.ms-powerpoint": [],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": []
    },
    multiple: true
  })
  const handleClick = () => {
    const element = document.getElementById("upload")
    if (element) {
      element.click()
    }
  }
  return (
    <Layout>
      <div className='w-full overflow-y-scroll  max-h-full'>
        <div className='flex-1 flex justify-center md:py-10'>
          <div className='px-4 w-full md:w-4/5'>
            <div>
              Step 1
            </div>
            <div className='flex py-2 justify-between md:items-center md:flex-row flex-col gap-1'>
              <div className='font-semibold md:text-2xl text-xl'>
                Tell us about your course
              </div>
            </div>
            <div className='w-3/5'>
              In this step, we'll ask you a few questions about your course. This would help the AI better tailor the course content to your specific needs.
            </div>

            <div className='w-3/5 mt-8 border border-[#D8E0E9] shadow p-6 rounded-lg'>
              <form onSubmit={form.handleSubmit} className='flex flex-col gap-4'>
                <div>
                  <label htmlFor="title">Course title *</label>
                  <input value={form.values.title} onChange={form.handleChange} onBlur={form.handleBlur} id="title" type="text" placeholder='Course title' className='h-12 px-4 focus-visible:outline-none w-full rounded-lg border-2 border-[#0D1F23]' />
                </div>
                <div
                  onClick={handleClick}
                  {...getRootProps()}
                  className={`p-8 h-36 flex items-center justify-center border-dashed bg-[#D8E0E9]/20 border-2 ${isDragActive ? 'border-blue-500 bg-[#D8E0E9]/40' : 'border-gray-300'} rounded-md text-center cursor-pointer`}
                >
                  <div className='h-full flex items-center flex-col justify-center'>
                    <div className="flex justify-center">
                      <FiUploadCloud className='text-4xl' />
                    </div>
                    <input id="upload" name="upload" {...getInputProps()} />
                    <div className='text-center mt-3 font-semibold flex flex-col text-sm'>
                      <div>Choose PDF, DOCX, and PPTX files </div>
                      <div>or drag & drop them here</div>
                    </div>
                  </div>
                </div>

                <div className='mt-4 flex flex-col gap-3'>
                  {addedFiles.map((file: File, index: number) => (<div key={`file_${index}`} className='h-10 flex items-center justify-between pl-4 border rounded-md'>
                    <div className='text-xs font-medium line-clamp-1 flex-1'>
                      {file.name}
                    </div>
                    <div onClick={() => {
                      let copy = [...addedFiles]
                      copy.splice(index, 1)
                      setAddedFiles(copy)
                    }} className='w-10 h-10 hover:bg-gray-100 flex border rounded-r-md justify-center items-center'>
                      <FiTrash2 />
                    </div>
                  </div>))}
                </div>

                <div className='justify-end gap-2 flex'>
                  <Link href="/dashboard/courses/new/methods" className='text-sm px-7 h-12 border items-center justify-center text-primary-dark font-medium bg-white flex gap-1 rounded-3xl'>
                    Back
                  </Link>
                  <button disabled={!form.isValid || form.isSubmitting} type='submit' className='text-sm px-7 h-12 items-center justify-center text-primary-dark font-medium bg-primary-app flex gap-1 disabled:bg-primary-app/60 rounded-3xl'>Next
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
