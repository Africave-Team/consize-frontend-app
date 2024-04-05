'use client'
import React, { useCallback, useState } from 'react'
import { SiGooglesheets } from "react-icons/si"
import { useDropzone } from 'react-dropzone'

interface FilePreview {
  file: File
}

interface Props {
  onFileChange: (data: FilePreview) => void
}

const DragAndDropUpload = ({ onFileChange }: Props) => {
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setFilePreview({ file })
      onFileChange({ file })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }, // Accept CSV and spreadsheet formats
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-8 border-dashed border flex flex-col justify-end items-center gap-4 h-40 ${isDragActive ? 'border-blue-500' : 'border-gray-300'} rounded-md text-center cursor-pointer`}
      >
        <input {...getInputProps()} />
        <SiGooglesheets className='text-4xl text-primary-500' />
        <p className="text-gray-500">Drop a CSV, .xls or .xlsx file here or <span className='text-primary-500 font-bold'>browse</span></p>
      </div>

      {filePreview && (
        <div className="mt-2 hover:bg-gray-100 rounded-md text-xs cursor-pointer py-3 px-2">
          <p>File Name: {filePreview.file.name}</p>
        </div>
      )}
    </div>
  )
}

export default DragAndDropUpload
