"use client"
import Circle from '@/components/CertificateElements/Circle'
import { updateMyTeamInfo } from '@/services/teams'
import uploadFile from '@/services/upload.service'
import { useAuthStore } from '@/store/auth.store'
import { CertificateComponent, CertificateTemplate, ComponentTypes } from '@/type-definitions/cert-builder'
import { certificateTemplates } from '@/utils/certificate-templates'
import { queryClient } from '@/utils/react-query'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Spinner } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import React, { MouseEvent, useEffect, useState } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { Rnd } from 'react-rnd'

export default function CertBuilderContent () {
  const { team, setTeam } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [backgrounds, setBackgrounds] = useState<string[]>([])
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

  const { mutateAsync: _updateTeamBackgrounds } = useMutation({
    mutationFn: (load: { payload: { certificateBackgrounds: string[] } }) => {
      return updateMyTeamInfo(load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })

  useEffect(() => {
    setBackgrounds(["plain", ...(team?.certificateBackgrounds || []), ...certificateTemplates.map(e => e.bg)])
  }, [team, certificateTemplates])

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

  const handleBgUpload = async function (file?: File) {
    if (file) {
      setUploading(true)
      const formData = new FormData()
      const originalName = file.name
      const fileExtension = originalName.substring(originalName.lastIndexOf('.'))
      let timestamp = new Date().getTime()
      formData.append("file", file, `${timestamp}${fileExtension}`)
      // upload and return the url to the parent
      const { data } = await uploadFile(formData)
      if (data) {
        let urls = [...(team?.certificateBackgrounds || [])]
        urls.push(data)
        const res = await _updateTeamBackgrounds({ payload: { certificateBackgrounds: urls } })
        setTeam(res.data)
      }
      setUploading(false)
    }
  }

  const removeTeamBg = async function (url: string) {
    let urls = [...(team?.certificateBackgrounds || [])]
    let index = urls.findIndex((e) => e === url)
    if (index >= 0) {
      urls.splice(index, 1)
      const res = await _updateTeamBackgrounds({ payload: { certificateBackgrounds: urls } })
      setTeam(res.data)

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
      case ComponentTypes.CIRCLE:
        component = <Circle size={100} color='#000' />
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
              {backgrounds.map((url, index) => <div key={`template_${index}`} className={`relative h-40 rounded-md ${selected && selected.bg === url && 'border-2 border-black '}`}>
                {url === "plain" ? <div className='absolute border top-0 left-0 h-40 w-full rounded-md bg-white'></div> : <img className='absolute top-0 left-0 h-40 w-full rounded-md' src={url} />}
                <div className='absolute top-0 left-0 h-40 w-full rounded-md group flex justify-end items-start hover:bg-white/40'>
                  <div className='flex gap-1 p-1'>
                    <button onClick={() => setSelected({
                      bg: url,
                      components: [
                        {
                          type: ComponentTypes.CIRCLE,
                          position: {
                            "x": 277,
                            "y": 60
                          }
                        },
                        {
                          type: ComponentTypes.CIRCLE,
                          position: {
                            "x": 377,
                            "y": 60
                          }
                        },
                        {
                          type: ComponentTypes.CIRCLE,
                          position: {
                            "x": 477,
                            "y": 60
                          }
                        }
                      ]
                    })} className='hidden group-hover:flex rounded-md h-7 text-xs bg-white border items-center justify-center px-3'>Select</button>

                    {team?.certificateBackgrounds && team?.certificateBackgrounds.includes(url) && <button onClick={() => removeTeamBg(url)} className='hidden group-hover:flex rounded-md h-7 text-xs bg-white border items-center justify-center px-3'>
                      <FiTrash2 />
                    </button>}
                  </div>
                </div>
              </div>)}
              <div className={`relative h-40 rounded-md`}>
                <div className='absolute top-0 left-0 h-40 w-full rounded-md border group flex justify-center items-center hover:bg-white/40'>
                  <input className='hidden' onChange={(e => {
                    if (e.target.files) {
                      handleBgUpload(e.target.files[0])
                    }
                  })} type="file" id="add-certificate-bg" />
                  <button onClick={() => {
                    let ele = document.getElementById('add-certificate-bg')
                    if (ele) {
                      ele.click()
                    }
                  }} disabled={uploading} className='flex rounded-md h-7 text-xs bg-white items-center justify-center px-3'>
                    {uploading ? <Spinner /> : <FiPlus className='font-bold text-5xl' />}
                  </button>
                </div>
              </div>
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
          {activeComponent && <AccordionItem className='border-none w-full' >
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
          </AccordionItem>}

        </Accordion>
      </div>
      <div className='flex-1 p-10 h-full flex justify-start overflow-y-scroll'>
        {selected && <div className='h-[540px] w-[800px] bg-gray-200 relative'>

          {selected.bg === "plain" ? <div className='absolute border top-0 left-0 h-full w-[800px] rounded-md bg-white'></div> : <img className='absolute top-0 left-0 h-full w-[800px] rounded-md' src={selected.bg} />}
          {/* <div onClick={handleContainerClick} className='absolute top-0 left-0 h-full w-[800px] rounded-md group'>
            <div className='relative w-[800px] h-full'>
              {
                selected.components.map((comp, index) => <Draggable bounds={{ top: -50, left: -50, right: 50, bottom: 50 }} onMouseDown={() => {
                  setActiveComponent(comp)
                  setActiveComponentIndex(index)
                }} defaultClassName={`cursor-pointer absolute p-3 drag-node ${activeComponent && activeComponentIndex === index ? 'border' : ''}`} defaultPosition={comp.position} onDrag={(e, data) => handleDragStop(data, index)} key={`component_${selected.name}_${index}`}>
                  {renderComponent(comp)}
                </Draggable>)
              }
            </div>
          </div> */}
          <div className="container"
            onMouseDown={handleContainerClick}
            style={{
              width: '800px',
              height: '540px',
              position: 'relative',
              overflow: 'hidden', // Optional if you want to hide overflowed content
            }}>

            {
              selected.components.map((comp, index) => <Rnd
                bounds="parent" // This restricts dragging and resizing to the parent container
                default={{
                  x: 100,
                  y: 100,
                  width: 100,
                  height: 100,
                }}
                onResize={(e, dir, ref, delta) => {
                  console.log(dir, delta)
                }}
                onMouseDown={(e) => {
                  setActiveComponent(comp)
                  setActiveComponentIndex(index)
                  e.stopPropagation()
                }}
                className={`${activeComponent && activeComponentIndex === index ? 'border' : ''}`}
              >
                <div style={{ width: '100%', height: '100%' }} className=''>
                  {renderComponent(comp)}
                </div>
              </Rnd>)
            }

          </div>

        </div>}
      </div>
    </div >
  )
}
