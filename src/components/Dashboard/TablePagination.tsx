"use client"

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
}

export default function TablePagination ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange
}: TablePaginationProps) {
  let end = ((perPage * (currentPage - 1)) + perPage)
  return (
    <div className='flex items-center justify-between w-full h-[72px] px-10 mt-2 border-t border-[#E4E7EB]'>
      <div>
        Showing {((perPage * (currentPage - 1)) + 1)}-{end > totalItems ? totalItems : end} out of {totalItems}
      </div>
      <div className='flex items-center gap-4'>
        {totalPages > 0 && <div className='flex h-10 gap-3'>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalItems < 0}
            className='h-10 flex items-center gap-1 disabled:text-[#898989]'
          >
            <FiChevronLeft />
            Prev
          </button>
          <div className='h-10 flex gap-1'>
            {new Array(totalPages)
              .fill(0)
              .map((_, i) => i)
              .slice(currentPage < 3 ? 0 : (currentPage - 3), (currentPage < 3 ? 5 : currentPage + 2))
              .map((index) => (
                <button
                  key={index}
                  onClick={() => onPageChange(index + 1)}
                  className={`h-10 rounded-md w-10 ${currentPage === (index + 1) ? 'bg-[#ECEFFA]' : 'hover:bg-[#ECEFFA]'}`}
                >
                  {index + 1}
                </button>
              ))}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalItems < 1}
            className='h-10 flex items-center gap-1 disabled:text-[#898989]'
          >
            Next
            <FiChevronRight />
          </button>
        </div>}
      </div>
    </div>
  )
}