import { RTDBStudent } from '@/type-definitions/secure.courses'
import React, { useEffect, useState } from 'react'
import SortStudentItems from './SortStudentItems'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, ButtonGroup, Tooltip } from '@chakra-ui/react'
export default function StudentsTable ({ students, courseId }: { students: RTDBStudent[], courseId: string }) {
  const pageSize = 10
  const [data, setData] = useState<RTDBStudent[]>([...students])
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    let start = (page - 1) * pageSize
    let end = pageSize * page
    setData(students.slice(start, end))
    setPages(Math.ceil(students.length / pageSize))
  }, [page, students])

  useEffect(() => {
    if (searchParams.get("page")) {
      setPage(Number(searchParams.get("page")))
    }
  }, [searchParams.get("page")])

  const goto = function (newPage: number) {
    router.push(`/dashboard/courses/${courseId}?page=${newPage}`)
  }
  return (
    <div>
      <div className='h-[500px]'>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 w-full">
            <tr className=' w-full'>
              <th className="px-4 py-3">
                <div className='flex items-center gap-3'>
                  Student name
                  {data && <SortStudentItems students={data} field='name' update={(students: RTDBStudent[]) => {
                    setData([...students])
                  }} />}

                </div>
              </th>
              <th className="px-4 py-3">
                <div className='flex items-center gap-3'>
                  Phone number
                  {data && <SortStudentItems students={data} field='phoneNumber' update={(students: RTDBStudent[]) => {
                    setData([...students])
                  }} />}

                </div>
              </th>
              <th className="px-4 py-3">
                <div className='flex items-center gap-3'>
                  Progress
                  {data && <SortStudentItems students={data} field='progress' update={(students: RTDBStudent[]) => {
                    setData([...students])
                  }} />}

                </div>
              </th>
              <th className="px-4 py-3 flex justify-center">
                <div className='flex items-center gap-3'>
                  Performance
                  {data && <SortStudentItems students={data} field='performance' update={(students: RTDBStudent[]) => {
                    setData([...students])
                  }} />}

                </div>
              </th>
              <th className="px-4 py-3">
                <div className='flex items-center gap-3'>
                  Status
                  {data && <SortStudentItems students={data} field='status' update={(students: RTDBStudent[]) => {
                    setData([...students])
                  }} />}

                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && <tr className="border-b hover:bg-gray-100 cursor-pointer">
              <th colSpan={5} scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                No students found
              </th>
            </tr>}
            {
              data.map((student: RTDBStudent) => {
                return <tr key={student.id} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => router.push(`/dashboard/courses/${courseId}/enrollments/${student.id}`)}>
                  <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{student.name}</th>
                  <td className="px-4 py-3">{student.phoneNumber}

                  </td>
                  <td className="px-4 py-3">
                    <Tooltip hasArrow placement='top-end' label={`${Math.ceil(student.progress)}%`}>
                      <div className="w-full bg-gray-200 rounded-full">
                        <div className={`${student.progress < 100 ? 'bg-purple-500' : 'bg-green-500'} text-xs font-medium text-blue-100 text-center p-0.5 leading-none h-1.5 rounded-full flex flex-col justify-center`} style={{ width: `${student.progress}%` }} />
                      </div>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 flex justify-center">
                    <div className='w-14'>
                      {student.scores ? student.scores.reduce((a, b) => a + b) : 0}
                    </div>
                  </td>
                  <td className="px-4 py-3">{student.droppedOut ? 'Dropped out' : student.completed ? 'Completed' : 'Active'}</td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>

      {pages > 1 && <div className='flex justify-center py-4'>
        <ButtonGroup variant='outline' isAttached>
          <Button isDisabled={page === 1} onClick={() => { goto(page - 1) }} className='font-medium' size={'sm'}>Previous</Button>
          {new Array(pages).fill(0).map((_, i) => {
            if ((i + 1) === page) {
              return (
                <Button onClick={() => { goto(i + 1) }} className={`!font-medium bg-gray-200`} key={i} size={'sm'}>{i + 1}</Button>
              )
            } else {
              return (
                <Button onClick={() => { goto(i + 1) }} className='!font-medium' key={i} size={'sm'}>{i + 1}</Button>
              )
            }
          })}

          <Button onClick={() => { goto(page + 1) }} isDisabled={page === pages} className='font-medium' size={'sm'}>Next</Button>
        </ButtonGroup>
      </div>}
    </div>
  )
}
