import { RTDBStudent } from '@/type-definitions/secure.courses'
import { RowData, handleExport } from '@/utils/generateExcelSheet'
import React from 'react'

export default function ExportStudents ({ students, courseId }: { students: RTDBStudent[], courseId: string }) {

  const exportData = function () {
    const titles = [
      {
        v: "Student name",
        t: "s",
        s: {
          font: {
            bold: true,
            sz: 15
          }
        }
      },
      {
        v: "Phone number",
        t: "s",
        s: {
          font: {
            sz: 15,
            bold: true
          }
        }
      }
    ]
    const tableData: RowData[][] = [
      [
        ...titles,
        {
          v: "Total lessons completed",
          t: "s",
          s: {
            font: {
              sz: 15,
              bold: true
            },
          }
        },
        {
          v: "Progress",
          t: "s",
          s: {
            font: {
              sz: 15,
              bold: true
            }
          }
        },
        {
          v: "Performance",
          t: "s",
          s: {
            font: {
              sz: 15,
              bold: true
            }
          }
        },
        {
          v: "Status",
          t: "s",
          s: {
            font: {
              sz: 15,
              bold: true
            },
          }
        },

      ],
      ...students.map((student: RTDBStudent) => {
        const defaults = [
          {
            v: student.name,
            t: "s",
          },
          {
            v: student.phoneNumber,
            t: "s",
          },
        ]
        const data = [
          ...defaults,
          {
            v: Object.entries(student.lessons ? student.lessons : {}).length + '',
            t: "s",
          },
          {
            v: `${student.progress}%`,
            t: "s",
          },
          {
            v: student.scores ? student.scores.reduce((a, b) => a + b, 0).toFixed(0) : '0',
            t: "s",
          },
          {
            v: `${student.droppedOut ? 'Dropped out' : student.completed ? 'Completed' : 'Active'}`,
            t: "s",
          }

        ]
        return data
      })
    ]
    const name = "course-statistics-data-" + courseId + new Date().toISOString()

    handleExport({
      name, tableData
    })
  }
  return (
    <button onClick={exportData} className='bg-primary-dark hover:bg-primary-dark/90 px-4 h-10 text-white rounded-md text-sm'>Export students</button>
  )
}
