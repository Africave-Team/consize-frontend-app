import http from '@/services/base'
import { CourseStatistics } from '@/type-definitions/secure.courses'
import { RowData, handleExport } from '@/utils/generateExcelSheet'
import { MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiDownloadCloud } from 'react-icons/fi'


export default function ExportStats ({ stats, fields, courseId }: { stats: CourseStatistics, courseId: string, fields: { field: string, title: string }[] }) {

  const handleExportButton = async () => {
    const result = await http.getBlob({
      url: `courses/${courseId}/export-stats`
    })
    if (result && result.data) {
      let url = URL.createObjectURL(result.data)
      // Create an anchor element and trigger a download
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', result.filename) // File name
      document.body.appendChild(link)
      link.click()

      // Clean up and remove the link
      link.parentNode?.removeChild(link)
    }
  }
  return (

    <>
      <MenuItem onClick={handleExportButton} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiDownloadCloud className='text-sm' />}>Export stats</MenuItem>
    </>
  )
}
