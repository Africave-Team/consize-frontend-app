import { useAuthStore } from '@/store/auth.store'
import React, { useEffect, useRef, useState } from 'react'
import { FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Spinner } from '@chakra-ui/react'
import moment from 'moment'
import { v4 } from 'uuid'
import { CourseMaterial } from '@/type-definitions/secure.courses'
import uploadFile from '@/services/upload.service'
import { updateSettings } from '@/services/secure.courses.service'

export default function StudentResources ({ resources, id, refetch }: { resources: CourseMaterial[], id: string, refetch: () => Promise<any> }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [uploading, setUploading] = useState<boolean>(false)

  const handleFileChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileInput = fileRef.current
    if (!fileInput || !fileInput.files) return
    // Check if any file is selected
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0]

      // Display file name
      console.log(`Selected File: ${file.name}`)

      // Determine MIME type
      const mimeType = file.type || 'unknown'
      console.log(`MIME Type: ${mimeType}`)

      // Determine file size
      const fileSizeInBytes = file.size
      const fileSizeInKB = fileSizeInBytes / 1024
      const payload: CourseMaterial = {
        id: v4(),
        fileName: file.name,
        fileUrl: '',
        fileSize: fileSizeInKB.toFixed(2),
        fileType: mimeType
      }
      console.log(`File Size: ${fileSizeInKB.toFixed(2)} KB`)
      const formData = new FormData()
      // get file url
      setUploading(true)
      formData.append("file", file)
      const { data } = await uploadFile(formData)
      payload.fileUrl = data
      await updateSettings({
        id, body: {
          courseMaterials: [...resources, payload]
        }
      })
      await refetch()
      setUploading(false)
    }
  }

  const handleDeleteItem = async function (item: string) {
    let lding = { ...loading }
    lding[item] = true
    setLoading(lding)
    let copy = [...resources]
    const index = copy.findIndex(e => e.id === item)
    if (index >= 0) {
      copy.splice(index, 1)
      await updateSettings({
        id, body: {
          courseMaterials: [...copy]
        }
      })
      await refetch()
    }
    lding[item] = false
    setLoading(lding)
  }
  return (
    <div className='flex w-full'>
      <div className='flex-1 rounded-lg w-full py-3 h-full'>
        <div className='flex justify-between px-3 items-center'>
          <div>
            <h1 className='font-medium text-sm'>Course materials</h1>
            <div className='text-[#64748B] text-sm'>Lists of materials availabe to students in this course</div>
          </div>
          <div className='flex items-center'>
            <input onChange={handleFileChange} ref={fileRef} type="file" className='hidden' />
            <button onClick={() => {
              if (fileRef && fileRef.current) {
                fileRef.current.click()
              }
            }} className='h-10 px-4 bg-primary-dark hover:bg-primary-dark/90 rounded-lg flex justify-center items-center'>

              {uploading ? <Spinner size={'sm'} className='text-white' /> : <FiPlus className='text-white font-bold text-xl' />}
            </button>
          </div>
        </div>
        <table className="w-full text-sm mt-5 text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className={`px-4 py-3`}>File name</th>
              <th scope="col" className="px-4 py-3">Size</th>
              <th scope="col" className="px-4 py-3"></th>
            </tr >
          </thead >

          {<tbody className=''>
            {resources.length === 0 && <tr>
              <td colSpan={4}>
                <div className='mt-3 px-3 text-sm'>No materials available for this course</div>
              </td>
            </tr>}

            {resources.map((entry, i) => {
              return (
                <tr className='hover:bg-gray-100' key={entry.id}>
                  <td className='px-4'>{entry.fileName}</td>
                  <td className='px-4'>{entry.fileSize}Kb</td>
                  <td className='px-4 flex'>
                    <button disabled={loading[entry.id]} onClick={() => handleDeleteItem(entry.id)} className='h-12 w-10 flex justify-center items-center'>
                      {loading[entry.id] ? <Spinner size={'sm'} /> : <FiTrash2 />}
                    </button>
                    <a href={entry.fileUrl} target='__blank' className='h-12 w-10 flex justify-center items-center'>
                      <FiExternalLink />
                    </a>
                  </td>
                </tr>
              )
            })}

          </tbody>}
        </table >
      </div>
    </div>
  )
}
