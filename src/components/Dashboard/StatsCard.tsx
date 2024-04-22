import { TrendStatistics } from '@/type-definitions/secure.courses'
import React from 'react'
import dynamic from 'next/dynamic'
import InfoPopover from './InfoPopover'
import { IoMdArrowDropdown } from 'react-icons/io'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'

export default function StatsCard ({ value, title, trends, latestTrend, description, unit }: {
  value: string,
  title: string,
  trends: TrendStatistics[]
  latestTrend: TrendStatistics
  description: string,
  unit: string
}) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  let xLabel = "Dates", yLabel = title, multiplier = 1

  return (
    <>
      <div className='h-20 border rounded-lg hover:shadow-md shadow-sm py-3 px-2 flex-col'>
        <div className='h-8 flex items-center gap-2'>
          <div className='text-gray-900 value font-bold text-xl'>{value}<span className='text-xs ml-1'>{unit}</span></div>
          <button onClick={onOpen} className='border h-6 hover:bg-gray-100 px-2 text-xs flex justify-center items-center rounded-md'>
            {latestTrend.value > 0 ? <div className='text-green-500'>+{latestTrend.value.toFixed(1)}%</div> : latestTrend.value === 0 ? <div>0%</div> : <div className='text-red-500'>-{Math.abs(latestTrend.value).toFixed(1)}%</div>}
            <IoMdArrowDropdown className='text-sm' />
          </button>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm'>{title}</span>
          <InfoPopover message={description} />
        </div>
      </div>
      <Modal size={'xl'} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {trends.length > 0 && <Chart
              options={{
                dataLabels: {
                  enabled: false
                },
                chart: {
                  toolbar: {
                    show: false
                  },
                },
                legend: {
                  show: false
                },
                yaxis: {
                  labels: {
                    show: true
                  },
                  title: {
                    text: yLabel
                  }
                },
                xaxis: {
                  labels: {
                    show: true
                  },
                  categories: trends.map(e => e.date),
                  title: {
                    text: xLabel
                  }
                },
              }} series={trends.map(e => e.value)} type="area" width={"100%"} height={200} />}

            {trends.length === 0 && <div className='h-[200px] w-full flex justify-center items-center'>
              No trends data available.
            </div>}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
