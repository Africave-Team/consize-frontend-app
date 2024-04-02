import uploadFile from '@/services/upload.service'
import { FileTypes } from '@/type-definitions/utils'
import { useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Accept, useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi'

interface Props {
  mimeTypes: FileTypes[]
  onUploadComplete: (url: string) => void
  originalUrl: string
  droppable?: boolean
  previewable?: boolean

}
export default function FileUploader ({ droppable, mimeTypes, previewable, originalUrl, onUploadComplete }: Props) {
  const [accept, setAccept] = useState({})
  const toast = useToast()

  const maxFileSize = 15 * 1024 * 1024

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file.size > maxFileSize) {
      toast({
        title: "Error",
        description: 'File size exceeds the maximum allowed size',
        status: "error"
      })
      return
    }
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      // upload and return the url to the parent
      const { data } = await uploadFile(formData)
      if (data) {
        onUploadComplete(data)
      }
    }
  }, [])

  const onFileChange = useCallback((acceptedFiles: File[]) => {

  }, [])

  useEffect(() => {
    let cp: Accept = {}
    for (let type of mimeTypes) {
      cp[type] = []
    }
    setAccept(cp)
  }, [mimeTypes])

  const handleClick = () => {
    const element = document.getElementById("upload")
    if (element) {
      element.click()
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept
  })
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex justify-between items-center h-full'>
        <div className='w-full h-full'>
          {!droppable ? <div className='flex gap-1 w-full items-center border rounded-lg'>
            <button onClick={handleClick} type='button' className='text-sm h-10 w-24 text-white bg-[#0D1F23] rounded-none'>Select file</button>
            <div className='h-10 truncate overflow-hidden flex-1 text-sm px-3 flex items-center'>
              {originalUrl.length > 0 ? <a href={originalUrl} target="_blank" rel="noopener noreferrer">Preview</a> : 'No file selected'} <div className='w-10'></div>
            </div>

            {/* <input id="upload" name="upload" {...getInputProps()} /> */}
          </div> : <div className='h-full w-full'>
            <div
              {...getRootProps()}
              className={`p-8 h-36 flex items-center justify-center border-dashed bg-[#D8E0E9]/20 border-2 ${isDragActive ? 'border-blue-500' : 'border-gray-300'} rounded-md text-center cursor-pointer`}
            >
              <input id="upload" name="upload" {...getInputProps()} />
              <div className='h-full flex items-center flex-col justify-center'>
                <div className="flex justify-center">
                  <FiUploadCloud className='text-4xl' />
                </div>
                <div className='text-center mt-3 font-semibold text-sm'>
                  Choose a file or drag & drop it here
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
      {previewable && originalUrl.length > 0 && originalUrl.startsWith('https') && <div className='h-40 rounded-lg w-full border mt-2'>
        <img src={originalUrl} className='h-full w-full rounded-md' />
      </div>}

    </div>
  )
}
