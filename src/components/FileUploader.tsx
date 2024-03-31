import { FileTypes } from '@/type-definitions/utils'
import React, { useCallback } from 'react'
import { Accept, useDropzone } from 'react-dropzone'

interface Props {
  mimeTypes: FileTypes[]
  onUploadComplete: (url: string) => void
  originalUrl: string
  droppable?: boolean
  previewable?: boolean

}
export default function FileUploader ({ droppable, mimeTypes, previewable, originalUrl }: Props) {


  const onDrop = useCallback((acceptedFiles: File[]) => {

  }, [])

  const handleClick = () => {
    const element = document.getElementById("upload")
    if (element) {
      element.click()
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  })
  return (
    <div className='flex flex-col w-full mt-2 min-h-10'>
      <div className='flex justify-between items-center'>
        <div className='w-full'>
          {!droppable ? <div className='flex gap-1 w-full items-center border rounded-lg'>
            <button onClick={handleClick} type='button' className='text-sm h-10 w-24 text-white bg-[#0D1F23] rounded-none'>Select file</button>
            <div className='h-10 truncate overflow-hidden flex-1 text-sm px-3 flex items-center'>
              {originalUrl.length > 0 ? <a href={originalUrl} target="_blank" rel="noopener noreferrer">Preview</a> : 'No file selected'} <div className='w-10'></div>
            </div>

            <input id="upload" name="upload" {...getInputProps()} />
          </div> : <div className='h-20 w-full mt-1.5'>
            <div
              {...getRootProps()}
              className={`p-8 h-full flex items-center justify-center border-dashed bg-[#D8E0E9]/20 border-2 ${isDragActive ? 'border-blue-500' : 'border-gray-300'} rounded-md text-center cursor-pointer`}
            >
              <input id="upload" name="upload" {...getInputProps()} />
              <div className='h-full flex items-center flex-col justify-center'>
                <div className="flex justify-center">
                  <img loading="lazy" src="/img.svg" className='h-5 w-5' alt="" />
                </div>
                <div className='text-center mt-3 font-semibold text-xs'>
                  Choose a file or drag & drop it here
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
      {previewable && originalUrl.length > 0 && originalUrl.startsWith('https') && <div className='h-60 w-full border mt-2'>
        <img src={originalUrl} className='h-full w-full' />
      </div>}

    </div>
  )
}
