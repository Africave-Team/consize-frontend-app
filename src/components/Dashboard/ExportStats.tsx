import { CourseStatistics } from '@/type-definitions/secure.courses'
import { RowData, handleExport } from '@/utils/generateExcelSheet'
import { MenuItem, Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FiDownloadCloud } from 'react-icons/fi'


export default function ExportStats ({ stats, fields, courseId }: { stats: CourseStatistics, courseId: string, fields: { field: string, title: string }[] }) {

  const handleExportButton = () => {
    const statsData: RowData[][] = [
      [
        {
          v: "Title",
          t: "s",
          s: {
            font: {
              bold: true,
              sz: 15
            }
          }
        },
        {
          v: "Value",
          t: "s",
          s: {
            font: {
              sz: 15,
              bold: true,
            }
          }
        }
      ],
      ...fields.map((field) => {
        return [
          {
            v: field.title,
            t: "s",
            s: {
              font: {
                bold: true
              }
            }
          },
          { //@ts-ignore
            v: stats[field.field].toFixed(1),
            t: "s",
          }
        ]
      })
    ]

    const name = "course-statistics-data-" + courseId + new Date().toISOString()

    handleExport({
      name, statsData
    })
  }
  return (

    <>
      <MenuItem onClick={handleExportButton} className='hover:bg-primary-dark/90 bg-primary-dark text-white' icon={<FiDownloadCloud className='text-sm' />}>Export stats</MenuItem>
    </>
  )
}
