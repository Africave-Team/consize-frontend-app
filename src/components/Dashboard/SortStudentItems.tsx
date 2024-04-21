"use client"
import { FaSortDown, FaSortUp } from "react-icons/fa6"
import React, { useState } from 'react'
import { RTDBStudent } from '@/type-definitions/secure.courses'

export default function SortStudentItems ({ students, field, update }: { students: RTDBStudent[], field: string, update: (students: RTDBStudent[]) => void }) {
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const sortFunction = function () {
    setOrder(order === "asc" ? "desc" : "asc")
    let copy = [...students]
    switch (field) {
      case "status":
        copy = copy.sort((a, b) => {
          const valueA = a.droppedOut ? 2 : a.completed ? 1 : 0
          const valueB = b.droppedOut ? 2 : b.completed ? 1 : 0
          return order === 'asc' ? valueA - valueB : valueB - valueA
        })
        break
      case "performance":
        copy = copy.sort((a, b) => {
          const valueA = Number(a.scores ? a.scores.reduce((a, b) => a + b) : 0)
          const valueB = Number(b.scores ? b.scores.reduce((a, b) => a + b) : 0)
          return order === 'asc' ? valueA - valueB : valueB - valueA
        })
        break
      case "progress":
        copy = copy.sort((a, b) => {
          const valueA = Number(a.progress)
          const valueB = Number(b.progress)
          return order === 'asc' ? valueA - valueB : valueB - valueA
        })
        break

      default:
        copy = copy.sort((a, b) => {
          // @ts-ignore
          const valueA = a[field]
          // @ts-ignore
          const valueB = b[field]
          return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
        })
        break
    }
    update(copy)
  }
  return (
    <div onClick={() => sortFunction()} className='flex flex-col cursor-pointer hover:bg-gray-200 rounded-md px-2 py-1 w-7'>
      <span className='-mb-2'><FaSortUp /></span>
      <span><FaSortDown /></span>
    </div>
  )
}
