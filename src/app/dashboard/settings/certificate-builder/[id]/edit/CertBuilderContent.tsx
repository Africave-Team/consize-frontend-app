"use client"
import { useAuthStore } from '@/store/auth.store'
import { CertificateComponent, CertificateTemplate, ComponentTypes } from '@/type-definitions/cert-builder'
import { certificateTemplates } from '@/utils/certificate-templates'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react'
import React, { MouseEvent, useEffect, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'

export default function CertBuilderContent () {
  const { team } = useAuthStore()
  const [selected, setSelected] = useState<CertificateTemplate | null>(null)
  const [activeComponent, setActiveComponent] = useState<CertificateComponent | null>(null)
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(null)
  const handleDragStop = function (data: DraggableData, index: number) {
    if (selected) {
      let copy = [...selected?.components]
      let item = copy[index]
      if (item) {
        item.position.x = data.x
        item.position.y = data.y
        setSelected({ ...selected, components: copy })
      }

    }
  }
  useEffect(() => {
    console.log(selected)
  }, [selected])

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const hasDragNodeClass = (element: HTMLElement | null): boolean => {
      if (!element) return false
      if (element.classList.contains('drag-node')) return true
      return hasDragNodeClass(element.parentElement)
    }
    if (!hasDragNodeClass(target)) {
      setActiveComponent(null)
      setActiveComponentIndex(null)
    }
  }

  const renderComponent = function (data: CertificateComponent) {
    let component = <div></div>
    switch (data.type) {
      case ComponentTypes.TEXT:
      case ComponentTypes.NAME:
        let teamName = ''
        if (team) {
          teamName = team.name
          data.default = data.default ? data.default.replaceAll('{{teamName}}', teamName) : ""
        }
        component = <div contentEditable className={data.text?.classNames} dangerouslySetInnerHTML={{ __html: data.default || "" }} />
        break
      case ComponentTypes.SIGNATORY:
        component = <div className={`${data.signatory?.classNames} w-52`}>
          <div className={`w-full ${data.signatory?.title ? 'border-b' : ''} h-7`}></div>
          <div className='w-full h-7 flex items-center justify-center'>{data.signatory?.signatoryName}</div>
          {data.signatory?.title && <div className='w-full h-6 flex items-center justify-center'>{data.signatory?.title}</div>}
        </div>
        break
      default:
        break
    }

    return component
  }
  return (
    <div className='flex gap-2 h-full'>
      <div className='w-[500px] h-full py-5 px-3'>
        <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0, 1]} allowMultiple>
          <AccordionItem className='border-none w-full' >
            <div className='flex justify-between w-full items-center rounded-lg h-8 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
              <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                <div className='flex flex-col items-start'>
                  <div className='text-sm text-black font-semibold'>
                    Certificate backgrounds
                  </div>
                </div>
              </AccordionButton>
              <div className='flex items-center gap-2 h-full'>
                <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                  <AccordionIcon />
                </AccordionButton>
              </div>
            </div>
            <AccordionPanel className='px-0 py-2 grid grid-cols-2 gap-3 overflow-y-scroll h-96 pb-12'>
              {certificateTemplates.map((e, index) => <div key={`template_${index}`} className={`relative h-40 rounded-md ${selected && selected.name === e.name && 'border-2 border-black '}`}>
                <img className='absolute top-0 left-0 h-40 w-full rounded-md' src={e.bg} />
                <div className='absolute top-0 left-0 h-40 w-full rounded-md group flex justify-center items-center hover:bg-white/40'>
                  <button onClick={() => setSelected(e)} className='hidden group-hover:flex rounded-md h-7 text-xs bg-white border items-center justify-center px-3'>Select</button>
                </div>
              </div>)}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem className='border-none w-full' >
            <div className='flex justify-between w-full items-center rounded-lg h-8 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
              <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                <div className='flex flex-col items-start'>
                  <div className='text-sm text-black font-semibold'>
                    Properties
                  </div>
                </div>
              </AccordionButton>
              <div className='flex items-center gap-2 h-full'>
                <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                  <AccordionIcon />
                </AccordionButton>
              </div>
            </div>
            <AccordionPanel className='px-0 py-2 grid grid-cols-1 overflow-y-scroll h-96'>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem className='border-none w-full' >
            <div className='flex justify-between w-full items-center rounded-lg h-8 hover:!bg-[#F5F7F5] bg-[#F5F7F5] '>
              <AccordionButton className='h-full hover:!bg-[#F5F7F5] bg-[#F5F7F5] rounded-lg flex gap-2'>
                <div className='flex flex-col items-start'>
                  <div className='text-sm text-black font-semibold'>
                    Elements
                  </div>
                </div>
              </AccordionButton>
              <div className='flex items-center gap-2 h-full'>
                <AccordionButton className='h-full w-14 flex justify-center items-center hover:!bg-transparent'>
                  <AccordionIcon />
                </AccordionButton>
              </div>
            </div>
            <AccordionPanel className='px-0 py-2 grid grid-cols-1 overflow-y-scroll h-96'>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
      <div className='flex-1 p-10 h-full flex justify-center overflow-y-scroll'>
        {selected && <div className='h-[540px] w-[800px] bg-gray-200 relative'>
          <img className='absolute top-0 left-0 h-full w-[800px] rounded-md' src={selected.bg} />
          <div onClick={handleContainerClick} className='absolute top-0 left-0 h-full w-[800px] rounded-md group'>
            {
              selected.components.map((comp, index) => <Draggable onMouseDown={() => {
                setActiveComponent(comp)
                setActiveComponentIndex(index)
              }} defaultClassName={`cursor-pointer p-3 drag-node ${activeComponent && activeComponentIndex === index ? 'border' : ''}`} defaultPosition={comp.position} onDrag={(e, data) => handleDragStop(data, index)} key={`component_${selected.name}_${index}`}>
                {renderComponent(comp)}
              </Draggable>)
            }
          </div>

        </div>}
      </div>
    </div >
  )
}
