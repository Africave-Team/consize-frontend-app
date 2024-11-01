"use client"
import Box from '@/components/CertificateElements/Box'
import Circle from '@/components/CertificateElements/Circle'
import ImageBox from '@/components/CertificateElements/Image'
import StyledContextMenu, { ContextMenuGroup, ContextMenuOption } from '@/components/CertificateElements/StyledContextMenu'
import TextContent from '@/components/CertificateElements/TextContent'
import Trapezoid from '@/components/CertificateElements/Trapezoid'
import Triangle from '@/components/CertificateElements/Triangle'
import { updateMyTeamInfo } from '@/services/teams'
import uploadFile from '@/services/upload.service'
import { useAuthStore } from '@/store/auth.store'
import { CertificateComponent, CertificateTemplate, ComponentTypes, TextAlign } from '@/type-definitions/cert-builder'
import { certificateTemplates, defaultElements } from '@/utils/certificate-templates'
import { queryClient } from '@/utils/react-query'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, border, Input, Spinner } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import React, { MouseEvent, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { BiPaste } from 'react-icons/bi'
import { FiMessageCircle, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Rnd } from 'react-rnd'
import { useKey } from "react-use"

enum ContextMenuGroupEnum {
  MANAGE = "manage",
  CLIPBOARD = "clipboard",
  MORE = "more",
}

export default function CertBuilderContent () {
  const { team, setTeam } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [backgrounds, setBackgrounds] = useState<string[]>([])
  const [selected, setSelected] = useState<CertificateTemplate | null>(null)
  const [activeComponent, setActiveComponent] = useState<CertificateComponent | null>(null)
  const [selectedElement, setSelectedElement] = useState<CertificateComponent | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeComponentIndex, setActiveComponentIndex] = useState<number | null>(null)
  const workAreaRef = useRef<HTMLDivElement | null>(null)
  const [contextMenuData, setContextMenuData] = useState<ContextMenuGroup[]>(
    []
  )


  const tempDataRef = useRef<{
    activeComponent: CertificateComponent | null,
    selectedElement: CertificateComponent | null,
    activeComponentIndex: number | null,
    selected: CertificateTemplate | null,
  }>()


  const initContextMenu = [
    {
      label: ContextMenuGroupEnum.MANAGE,
      options: [],
    },
    {
      label: ContextMenuGroupEnum.CLIPBOARD,
      options: [],
    },
    {
      label: ContextMenuGroupEnum.MORE,
      options: [],
    },
  ]


  useEffect(() => {
    tempDataRef.current = {
      activeComponent,
      activeComponentIndex,
      selectedElement,
      selected
    }
  }, [
    activeComponent,
    activeComponentIndex,
    selectedElement,
    selected
  ])

  const { mutateAsync: _updateTeamBackgrounds } = useMutation({
    mutationFn: (load: { payload: { certificateBackgrounds: string[] } }) => {
      return updateMyTeamInfo(load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
  })

  useEffect(() => {
    // Attach mousemove event listener
    if (selectedElement) {
      window.addEventListener('mousemove', (e) => {
        if (workAreaRef.current) {
          const rect = workAreaRef.current.getBoundingClientRect() // Get work area bounds
          setMousePosition({
            x: e.clientX - rect.left, // Adjust x relative to the container
            y: e.clientY - rect.top,  // Adjust y relative to the container
          })
        }
      })
    }

    return () => {
      window.removeEventListener('mousemove', (e) => {
        if (workAreaRef.current) {
          const rect = workAreaRef.current.getBoundingClientRect() // Get work area bounds
          setMousePosition({
            x: e.clientX - rect.left, // Adjust x relative to the container
            y: e.clientY - rect.top,  // Adjust y relative to the container
          })
        }
      })
    }
  }, [selectedElement])

  useEffect(() => {
    setBackgrounds(["plain", ...(team?.certificateBackgrounds || []), ...certificateTemplates.map(e => e.bg)])
  }, [team, certificateTemplates])

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (selectedElement) {
      if (selected && mousePosition) {
        setSelected({
          ...selected, components: [...selected.components, {
            ...selectedElement, position: mousePosition
          }]
        })
        setSelectedElement(null)
      }
      return
    }
    const target = e.target as HTMLElement
    const hasDragNodeClass = (element: HTMLElement | null): boolean => {
      if (!element) return false
      if (element.classList.contains('drag-node')) return true
      return hasDragNodeClass(element.parentElement)
    }
    if (!hasDragNodeClass(target)) {
      if (selected?.components[0].type === ComponentTypes.BACKGROUND) {
        setActiveComponent(selected.components[0])
        setActiveComponentIndex(0)
      } else {
        setActiveComponent(null)
        setActiveComponentIndex(null)
      }
    }
  }

  useKey("v", (event) => {
    if ((event.ctrlKey || event.metaKey)) {
    }
  })
  useKey("Backspace", () => {
    if (tempDataRef.current) {
      const {
        activeComponent, activeComponentIndex, selected
      } = tempDataRef.current
      if (activeComponent && activeComponentIndex !== null && selected && activeComponent.type !== ComponentTypes.BACKGROUND) {
        const copy = { ...selected }
        copy.components.splice(activeComponentIndex, 1)
        setSelected({ ...copy })
      }
    }
  })

  useKey("c", (event) => {

  })

  useKey("x", (event) => {

  })

  useKey("z", (event) => {

  })
  useKey("y", (event) => {

  })



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

  const handlePaneContextMenu = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    let menu: ContextMenuGroup[] = initContextMenu

    const addOptionToContextMenu = (
      menu: ContextMenuGroup[],
      groupLabel: string,
      item: ContextMenuOption
    ) => {
      let group = menu.find((group) => group.label === groupLabel)
      if (group) {
        group.options.push(item)
      }
    }

    addOptionToContextMenu(menu, ContextMenuGroupEnum.MANAGE, {
      label: "New file",
      onClick: () => {
        // handleCreateFile({ x: event.clientX, y: event.clientY })
      },
      icon: <FiPlus />,
    })
    addOptionToContextMenu(menu, ContextMenuGroupEnum.MANAGE, {
      label: "New from templates",
      onClick: () => { },
    })
    addOptionToContextMenu(menu, ContextMenuGroupEnum.CLIPBOARD, {
      label: "Paste here",
      onClick: () => { },
      icon: <BiPaste />,
    })
    addOptionToContextMenu(menu, ContextMenuGroupEnum.MORE, {
      label: "Add a note",
      onClick: () => { },
      icon: <FiMessageCircle />,
    })
    setContextMenuData(menu)
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
        component = <TextContent text={data.properties.text} border={data.properties.border} height={data.properties.height || 40} width={data.properties.width || 100} />
        break
      case ComponentTypes.SIGNATORY:
        component = <div className={`${data.signatory?.classNames} w-52`}>
          <div className={`w-full ${data.signatory?.title ? 'border-b' : ''} h-7`}></div>
          <div className='w-full h-7 flex items-center justify-center'>{data.signatory?.signatoryName}</div>
          {data.signatory?.title && <div className='w-full h-6 flex items-center justify-center'>{data.signatory?.title}</div>}
        </div>
        break
      case ComponentTypes.CIRCLE:
        component = <Circle size={data.properties.size || 100} color={data.properties.color || '#000'} />
        break

      case ComponentTypes.IMAGE:
        component = <ImageBox radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} />
        break
      case ComponentTypes.TRAPEZOID:
        component = <Trapezoid leftSize={data.properties.leftSize || 0} rightSize={data.properties.rightSize || 130} bottomSize={data.properties.bottomSize || 100} width={data.properties.width || 200} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.TRIANGLE:
        component = <Triangle leftSize={data.properties.leftSize || 100} rightSize={data.properties.rightSize || 100} bottomSize={data.properties.bottomSize || 120} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.SQUARE:
        component = <Box radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 100} width={data.properties.width || 100} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.RECTANGLE:
        component = <Box radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} color={data.properties.color || '#000'} />
        break
      default:
        break
    }

    return component
  }


  const renderPickableComponent = function (data: CertificateComponent) {
    let component = <div></div>
    switch (data.type) {
      case ComponentTypes.TEXT:
        component = <div className='font-semibold'>Text</div>
        break
      case ComponentTypes.NAME:
        component = <div className='font-semibold'>Recipient</div>
        break
      case ComponentTypes.SIGNATORY:
        component = <div className={``}>
          Signature
        </div>
        break
      case ComponentTypes.CIRCLE:
        component = <Circle size={data.properties.size || 100} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.TRAPEZOID:
        component = <Trapezoid leftSize={data.properties.leftSize || 0} rightSize={data.properties.rightSize || 130} bottomSize={data.properties.bottomSize || 100} width={data.properties.width || 200} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.TRIANGLE:
        component = <Triangle leftSize={data.properties.leftSize || 100} rightSize={data.properties.rightSize || 100} bottomSize={data.properties.bottomSize || 120} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.SQUARE:
        component = <Box radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 100} width={data.properties.width || 100} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.RECTANGLE:
        component = <Box radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} color={data.properties.color || '#000'} />
        break

      case ComponentTypes.IMAGE:
        component = <ImageBox radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} />
        break
      default:
        break
    }

    return component
  }

  const renderComponentProperties = function (data: CertificateComponent, elements: CertificateTemplate) {
    if (activeComponentIndex === null || !elements) return <></>
    let component = <div></div>
    switch (data.type) {
      case ComponentTypes.CIRCLE:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-32'>
              <Input type='color' onChange={(e) => {
                let copySel = { ...elements }
                let copyActive = { ...data }
                copySel.components[activeComponentIndex].properties.color = e.target.value
                copyActive.properties.color = e.target.value
                setSelected(copySel)
                setActiveComponent(copyActive)
              }} value={data.properties.color} id="background-color" />
            </div>
          </div>
        </div>
        break
      case ComponentTypes.TRAPEZOID:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-32'>
              <Input type='color' onChange={(e) => {
                let copySel = { ...elements }
                let copyActive = { ...data }
                copySel.components[activeComponentIndex].properties.color = e.target.value
                copyActive.properties.color = e.target.value
                setSelected(copySel)
                setActiveComponent(copyActive)
              }} value={data.properties.color} id="background-color" />
            </div>
          </div>


          <div className='font-semibold text-xs mt-3'>Dimensions</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>W</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  let s = e.target.valueAsNumber || 0
                  if (s > 800) {
                    s = 800
                  } else if (s < 0) {
                    s = 0
                  }
                  copySel.components[activeComponentIndex].properties.width = s
                  copyActive.properties.width = s
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.width} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>

            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>H</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  let s = e.target.valueAsNumber || 0
                  if (s > 400) {
                    s = 400
                  } else if (s < 0) {
                    s = 0
                  }
                  copySel.components[activeComponentIndex].properties.bottomSize = s
                  copyActive.properties.bottomSize = s
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.bottomSize} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>

            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>R</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  let s = e.target.valueAsNumber || 0
                  if (s > 400) {
                    s = 400
                  } else if (s < 0) {
                    s = 0
                  }
                  copySel.components[activeComponentIndex].properties.rightSize = s
                  copyActive.properties.rightSize = s
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.rightSize} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>L</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  let s = e.target.valueAsNumber || 0
                  if (s > 400) {
                    s = 400
                  } else if (s < 0) {
                    s = 0
                  }
                  copySel.components[activeComponentIndex].properties.leftSize = s
                  copyActive.properties.leftSize = s
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.leftSize} max={800} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
          </div>
        </div>
        break
      case ComponentTypes.TRIANGLE:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-32'>
              <Input type='color' onChange={(e) => {
                let copySel = { ...elements }
                let copyActive = { ...data }
                copySel.components[activeComponentIndex].properties.color = e.target.value
                copyActive.properties.color = e.target.value
                setSelected(copySel)
                setActiveComponent(copyActive)
              }} value={data.properties.color} id="background-color" />
            </div>
          </div>
        </div>
        break
      case ComponentTypes.SQUARE:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-32'>
              <Input type='color' onChange={(e) => {
                let copySel = { ...elements }
                let copyActive = { ...data }
                copySel.components[activeComponentIndex].properties.color = e.target.value
                copyActive.properties.color = e.target.value
                setSelected(copySel)
                setActiveComponent(copyActive)
              }} value={data.properties.color} id="background-color" />
            </div>
          </div>

          <div className='font-semibold text-xs mt-3'>Dimensions</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>H</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  let s = e.target.valueAsNumber || 0
                  if (s > 600) {
                    s = 600
                  }
                  copySel.components[activeComponentIndex].properties.height = s
                  copySel.components[activeComponentIndex].properties.width = s
                  copyActive.properties.height = s
                  copyActive.properties.width = s
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.height} max={600} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
          </div>
        </div>
        break
      case ComponentTypes.RECTANGLE:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-32'>
              <Input type='color' onChange={(e) => {
                let copySel = { ...elements }
                let copyActive = { ...data }
                copySel.components[activeComponentIndex].properties.color = e.target.value
                copyActive.properties.color = e.target.value
                setSelected(copySel)
                setActiveComponent(copyActive)
              }} value={data.properties.color} id="background-color" />
            </div>
          </div>

          <div className='font-semibold text-xs mt-3'>Dimensions</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>H</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  copySel.components[activeComponentIndex].properties.height = e.target.valueAsNumber
                  copyActive.properties.height = e.target.valueAsNumber
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.height} max={600} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>W</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  copySel.components[activeComponentIndex].properties.width = e.target.valueAsNumber
                  copyActive.properties.width = e.target.valueAsNumber
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.width} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
          </div>


          <div className='font-semibold text-xs mt-3'>Radius</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>RT</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.radius && copyActive.properties.radius) {
                    copySel.components[activeComponentIndex].properties.radius.rt = e.target.valueAsNumber
                    copyActive.properties.radius.rt = e.target.valueAsNumber
                  } else {
                    let radius = {
                      rt: e.target.valueAsNumber,
                      rb: 0,
                      lb: 0,
                      lt: 0
                    }
                    copySel.components[activeComponentIndex].properties.radius = radius
                    copyActive.properties.radius = radius
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.radius?.rt} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>

            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>RB</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.radius && copyActive.properties.radius) {
                    copySel.components[activeComponentIndex].properties.radius.rb = e.target.valueAsNumber
                    copyActive.properties.radius.rb = e.target.valueAsNumber
                  } else {
                    let radius = {
                      rb: e.target.valueAsNumber,
                      rt: 0,
                      lb: 0,
                      lt: 0
                    }
                    copySel.components[activeComponentIndex].properties.radius = radius
                    copyActive.properties.radius = radius
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.radius?.rb} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>

            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>LB</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.radius && copyActive.properties.radius) {
                    copySel.components[activeComponentIndex].properties.radius.lb = e.target.valueAsNumber
                    copyActive.properties.radius.lb = e.target.valueAsNumber
                  } else {
                    let radius = {
                      lb: e.target.valueAsNumber,
                      rb: 0,
                      rt: 0,
                      lt: 0
                    }
                    copySel.components[activeComponentIndex].properties.radius = radius
                    copyActive.properties.radius = radius
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.radius?.lb} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>

            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>LT</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.radius && copyActive.properties.radius) {
                    copySel.components[activeComponentIndex].properties.radius.lt = e.target.valueAsNumber
                    copyActive.properties.radius.lt = e.target.valueAsNumber
                  } else {
                    let radius = {
                      lt: e.target.valueAsNumber,
                      rb: 0,
                      lb: 0,
                      rt: 0
                    }
                    copySel.components[activeComponentIndex].properties.radius = radius
                    copyActive.properties.radius = radius
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.radius?.lt} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
          </div>
        </div>
        break
      case ComponentTypes.BACKGROUND:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-32'>
              <Input type='color' onChange={(e) => {
                let copySel = { ...elements }
                let copyActive = { ...data }
                copySel.components[activeComponentIndex].properties.color = e.target.value
                copyActive.properties.color = e.target.value
                setSelected(copySel)
                setActiveComponent(copyActive)
              }} value={data.properties.color} id="background-color" />
            </div>
          </div>
        </div>
        break

      case ComponentTypes.NAME:
        component = <div className='mt-2'>
          <div className='font-semibold text-xs mt-3'>Dimensions</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/3 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>W</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  copySel.components[activeComponentIndex].properties.width = e.target.valueAsNumber
                  copyActive.properties.width = e.target.valueAsNumber
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.width} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
          </div>


          <div className='font-semibold text-xs mt-3'>Border</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>R</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.border && copyActive.properties.border) {
                    copySel.components[activeComponentIndex].properties.border.r = e.target.valueAsNumber
                    copyActive.properties.border.r = e.target.valueAsNumber
                  } else {
                    let border = {
                      r: e.target.valueAsNumber,
                      b: 0,
                      l: 0,
                      t: 0,
                      color: "#000"
                    }
                    copySel.components[activeComponentIndex].properties.border = border
                    copyActive.properties.border = border
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.border?.r} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>

            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>B</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.border && copyActive.properties.border) {
                    copySel.components[activeComponentIndex].properties.border.b = e.target.valueAsNumber
                    copyActive.properties.border.b = e.target.valueAsNumber
                  } else {
                    let border = {
                      b: e.target.valueAsNumber,
                      r: 0,
                      l: 0,
                      t: 0,
                      color: "#000"
                    }
                    copySel.components[activeComponentIndex].properties.border = border
                    copyActive.properties.border = border
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.border?.b} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>

            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>L</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.border && copyActive.properties.border) {
                    copySel.components[activeComponentIndex].properties.border.l = e.target.valueAsNumber
                    copyActive.properties.border.l = e.target.valueAsNumber
                  } else {
                    let border = {
                      l: e.target.valueAsNumber,
                      r: 0,
                      b: 0,
                      t: 0,
                      color: "#000"
                    }
                    copySel.components[activeComponentIndex].properties.border = border
                    copyActive.properties.border = border
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.border?.l} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
            <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>T</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  if (copySel.components[activeComponentIndex].properties.border && copyActive.properties.border) {
                    copySel.components[activeComponentIndex].properties.border.t = e.target.valueAsNumber
                    copyActive.properties.border.t = e.target.valueAsNumber
                  } else {
                    let border = {
                      t: e.target.valueAsNumber,
                      r: 0,
                      l: 0,
                      b: 0,
                      color: "#000"
                    }
                    copySel.components[activeComponentIndex].properties.border = border
                    copyActive.properties.border = border
                  }

                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.border?.t} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>



          </div>
        </div>
        break
      default:
        break
    }

    return component
  }
  return (
    <div className='flex gap-2 h-full'>
      <div className='w-[500px] h-full overflow-y-scroll py-5 px-3'>
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
                    <button onClick={() => {
                      let components: CertificateComponent[] = []
                      if (selected) {
                        if (selected.bg === "plain") {
                          components.push(...selected.components.filter(e => e.type !== ComponentTypes.BACKGROUND))
                        } else {
                          components.push(...selected.components)
                        }
                      }
                      setSelected({
                        bg: url,
                        components: url === "plain" ? [{
                          type: ComponentTypes.BACKGROUND,
                          position: {
                            x: 0,
                            y: 0
                          },
                          properties: {
                            color: "#ffffff"
                          }
                        }, ...components] : components
                      })
                      setActiveComponent(null)
                      setActiveComponentIndex(null)
                    }} className='hidden group-hover:flex rounded-md h-7 text-xs bg-white border items-center justify-center px-3'>Select</button>

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
            <AccordionPanel className='px-0 py-2 overflow-y-scroll h-96'>
              <div className="grid grid-cols-3 gap-5">
                {defaultElements.map((element) => <div key={element.type} onClick={() => setSelectedElement(element)} className={`h-32 flex justify-center items-center ${element.type === selectedElement?.type ? 'border-primary-dark border-2' : 'border'}`}>
                  {renderPickableComponent(element)}
                </div>)}
              </div>
            </AccordionPanel>
          </AccordionItem>
          {activeComponent && selected && <AccordionItem className='border-none w-full' >
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
              {renderComponentProperties(activeComponent, selected)}
            </AccordionPanel>
          </AccordionItem>}

        </Accordion>
      </div>
      <div className='flex-1 p-10 h-full flex justify-start overflow-y-scroll'>
        {selected && <StyledContextMenu
          modal={false}
          menuGroups={contextMenuData}
          onOpenChange={(open) => {
            if (!open) {
              setContextMenuData([])
            }
          }}
        >
          {/* @ts-gnore */}
          <div onContextMenu={handlePaneContextMenu} className='h-[600px] w-[900px] relative'>

            {selected.bg === "plain" ? <div style={{
              background: selected.components[0].properties.color
            }} className='absolute border top-0 left-0 h-full w-[900px] rounded-2xl'></div> : <img className='absolute top-0 left-0 h-full w-[900px] rounded-md' src={selected.bg} />}
            <div className={`${selectedElement ? 'cursor-crosshair' : 'cursor-move'} rounded-2xl`}
              onMouseDown={handleContainerClick}
              ref={workAreaRef}
              style={{
                width: '900px',
                height: '600px',
                position: 'relative',
                overflow: "hidden"
              }}>

              {
                selected.components.map((comp, index) => {
                  if (comp.type === ComponentTypes.BACKGROUND) {
                    return <div key={`${comp.type}_${index}`} />
                  } else {
                    return <Rnd
                      key={`${comp.type}_${index}`}
                      bounds="parent" // This restricts dragging and resizing to the parent container
                      position={{
                        x: comp.position.x || 100,
                        y: comp.position.y || 100,
                      }}
                      onDrag={(e, d) => {
                        let copySel = { ...selected }
                        let old = copySel.components[index].position
                        if (d.x > 0) {
                          old.x = d.x
                        }
                        if (d.y > 0) {
                          old.y = d.y
                        }
                        copySel.components[index].position = old
                        setSelected(copySel)

                      }}
                      enableResizing={false}
                      onMouseDown={(e) => {
                        setActiveComponent(comp)
                        setActiveComponentIndex(index)
                        e.stopPropagation()
                      }}
                      className={`absolute ${activeComponent && activeComponentIndex === index ? 'border border-primary-dark' : ''}`}
                    >
                      <div>{renderComponent(comp)}</div>
                    </Rnd>
                  }
                })
              }

              {selectedElement && (
                <div
                  className="cursor-text"
                  style={{
                    position: 'absolute',
                    top: `${mousePosition.y}px`,
                    left: `${mousePosition.x}px`,
                    pointerEvents: 'none', // Ensure this doesn't block other events
                    transform: 'translate(10px, 10px)', // Offset a bit from the cursor
                    background: 'lightyellow',
                    padding: '5px',
                    borderRadius: '5px',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                  }}
                >
                  Place here
                </div>
              )}

            </div>

          </div>
        </StyledContextMenu>}
      </div>
    </div >
  )
}
