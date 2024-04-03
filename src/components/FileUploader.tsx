import uploadFile from '@/services/upload.service'
import { FileTypes } from '@/type-definitions/utils'
import { Spinner, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Accept, useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi'
import mime from "mime-types"
import { MediaType } from '@/type-definitions/secure.courses'

interface Props {
  mimeTypes: FileTypes[]
  onUploadComplete: (url: string) => void
  originalUrl: string
  droppable?: boolean
  previewable?: boolean

}
export default function FileUploader ({ droppable, mimeTypes, previewable, originalUrl, onUploadComplete }: Props) {
  const [accept, setAccept] = useState({})
  const [fileType, setFileType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
      setIsLoading(true)
      const { data } = await uploadFile(formData)
      if (data) {
        onUploadComplete(data)
      }
      setIsLoading(false)
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

  useEffect(() => {
    const type = mime.lookup(originalUrl)
    if (type) {
      setFileType(type)
    }
  }, [originalUrl])

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
            <button onClick={handleClick} type='button' className='text-sm h-10 w-24 text-white bg-[#0D1F23] rounded-lg'>Select file</button>
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
                  {isLoading ? <Spinner /> : <FiUploadCloud className='text-4xl' />}
                </div>
                <div className='text-center mt-3 font-semibold text-sm'>
                  Choose a file or drag & drop it here
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
      {previewable && originalUrl.length > 0 && originalUrl.startsWith('https') && <div className='rounded-lg w-full border mt-2'>
        {
          fileType.includes(MediaType.IMAGE) && <img src={originalUrl} className='h-80 w-full rounded-md' />
        }

        {
          fileType.includes(MediaType.AUDIO) &&
          <>
            <audio controls>
              <source src={originalUrl} type={fileType} />
              Your browser does not support the audio tag.
            </audio>
          </>
        }
        {
          fileType.includes(MediaType.VIDEO) && <>
            <video className='h-80 w-full' controls>
              <source src={originalUrl} type={fileType} />
              Your browser does not support the video tag.
            </video>
          </>
        }

      </div>}

    </div>
  )
}
