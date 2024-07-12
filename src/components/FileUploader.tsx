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
  onUploadComplete: (url: string | string[]) => void
  originalUrl: string | string[]
  droppable?: boolean
  previewable?: boolean
  buttonOnly?: boolean
  multiple?: boolean
  header?: boolean

}
export default function FileUploader ({ droppable, mimeTypes, previewable, originalUrl, onUploadComplete, buttonOnly, multiple, header }: Props) {
  const [accept, setAccept] = useState({})
  const [fileType, setFileType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const maxFileSize = 15 * 1024 * 1024

  const checkAspectRatio = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      const minAspectRatio = 0.5 // for example, height/width >= 0.5
      const maxAspectRatio = 2 // for example, height/width <= 2
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const width = img.width
          const height = img.height
          const aspectRatio = height / width
          if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
            toast({
              title: "Error",
              description: 'Image aspect ratio is not within the allowed range',
              status: "error"
            })
            reject(new Error('Image aspect ratio is not within the allowed range'))
          } else {
            resolve()
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    let files: File[] = []
    for (let file of acceptedFiles) {
      if (file) {
        if (file.size > maxFileSize) {
          toast({
            title: "Error",
            description: 'File size exceeds the maximum allowed size',
            status: "error"
          })
          return
        }
        if (header) {
          try {
            await checkAspectRatio(file)
            files.push(file)
          } catch (error) {
          }
        } else {
          files.push(file)
        }
      }
    }
    if (files.length > 0) {
      setIsLoading(true)
      let urls: string[] = []
      await Promise.all(files.map(async (file) => {
        const formData = new FormData()
        const originalName = file.name
        const fileExtension = originalName.substring(originalName.lastIndexOf('.'))
        let timestamp = new Date().getTime()
        formData.append("file", file, `${timestamp}${fileExtension}`)
        // upload and return the url to the parent
        const { data } = await uploadFile(formData)
        if (data) {
          urls.push(data)
        }
        return file
      }))
      setIsLoading(false)
      onUploadComplete(multiple ? urls : urls[0])
    }
  }, [multiple])

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
    if (!Array.isArray(originalUrl)) {
      const type = mime.lookup(originalUrl)
      if (type) {
        setFileType(type)
      }
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
    accept,
    multiple
  })
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex justify-between items-center h-full'>
        <div className='w-full h-full'>
          {!droppable ? <div className='flex gap-1 w-full items-center border rounded-lg'>
            <button onClick={handleClick} type='button' className='text-sm h-10 min-w-24 px-5 text-white bg-[#0D1F23] rounded-lg flex items-center justify-center gap-1'>Select file
              {isLoading && <Spinner size={'sm'} />}
            </button>
            {!buttonOnly && !multiple && <div className='h-10 truncate overflow-hidden flex-1 text-sm px-3 flex items-center'>
              {!Array.isArray(originalUrl) && originalUrl.length > 0 ? <a href={originalUrl} target="_blank" rel="noopener noreferrer">Preview</a> : 'No file selected'} <div className='w-10'></div>
            </div>}
            <input id="upload" name="upload" {...getInputProps()} />
          </div> : <div className='h-full w-full'>
            <div
              onClick={handleClick}
              {...getRootProps()}
              className={`p-8 h-36 flex items-center justify-center border-dashed bg-[#D8E0E9]/20 border-2 ${isDragActive ? 'border-blue-500' : 'border-gray-300'} rounded-md text-center cursor-pointer`}
            >
              <div className='h-full flex items-center flex-col justify-center'>
                <div className="flex justify-center">
                  {isLoading ? <Spinner /> : <FiUploadCloud className='text-4xl' />}
                </div>
                <input id="upload" name="upload" {...getInputProps()} />
                <div className='text-center mt-3 font-semibold flex flex-col text-sm'>
                  <div>Choose {mimeTypes.length === 3 ? `a .png, .jpg, .jpeg or .mp4` : 'a'} file </div>
                  <div>or drag & drop it here</div>

                </div>
              </div>
            </div>
          </div>}
          {header && !buttonOnly && <div className='text-sm'>Best to upload images of dimensions close to 1500 × 840</div>}
        </div>
      </div>
      {(!Array.isArray(originalUrl) && originalUrl.length > 0 && originalUrl.startsWith('https')) && previewable ? <>
        <div className='rounded-lg w-full border mt-2'>
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

        </div>
      </> : (Array.isArray(originalUrl)) && previewable && multiple ? <div className='flex flex-col gap-2'>
        {originalUrl.map((url) => <div key={url} className='h-10 px-4 flex items-center border'>
          {url}
        </div>)}
      </div> : <div className=''></div>}

    </div>
  )
}
