"use client"
import { HexColorPicker } from "react-colorful"
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
import { CertificateComponent, CertificatesInterface, CertificateTemplate, ComponentTypes, TextAlign } from '@/type-definitions/cert-builder'
import { certificateTemplates, defaultElements } from '@/utils/certificate-templates'
import { queryClient } from '@/utils/react-query'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, border, Input, Popover, PopoverBody, PopoverContent, PopoverTrigger, Spinner } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { MouseEvent, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { BiPaste } from 'react-icons/bi'
import { FiAlignCenter, FiAlignLeft, FiAlignRight, FiChevronDown, FiCloud, FiMessageCircle, FiPlus, FiTrash2 } from 'react-icons/fi'
import { Rnd } from 'react-rnd'
import { useKey } from "react-use"
import { isValidHexColor } from '@/utils/string-formatters'
import { defaultDateFormats, defaultFonts, defaultFontSizes, defaultFontWeights } from '@/utils/certificate-utils'
import moment from 'moment'
import MediaSelectorCertificate from '@/components/MediaSelectorCertificate'
import { CertificateMediaTypes } from '@/type-definitions/auth'
import SignatureBox from '@/components/CertificateElements/SignatureBox'
import { useParams } from 'next/navigation'
import { fetchCertificateByID, updateCertificateByID } from '@/services/certificates.services'
import PreviewCertificateButton from '@/components/Dashboard/PreviewCertificate'

enum ContextMenuGroupEnum {
  MANAGE = "manage",
  CLIPBOARD = "clipboard",
  MORE = "more",
}

export default function CertBuilderContent () {
  const { id } = useParams()
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

  const loadData = async function (id: string) {
    const result = await fetchCertificateByID(id)
    return result.data
  }

  const { data: certificateInfo, isFetching } =
    useQuery<CertificatesInterface>({
      queryKey: ['certificate', { id }],
      queryFn: () => loadData(id)
    })

  const { isPending: updatePending, mutateAsync: _updateCertificate } = useMutation({
    mutationFn: (load: {
      payload: {
        components: CertificateTemplate,
        name?: string
      }, id: string
    }) => {
      return updateCertificateByID(load.id, load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['certificate', { id }] })
    }
  })


  useEffect(() => {
    if (certificateInfo) {
      setSelected(certificateInfo.components || null)
    }
  }, [certificateInfo])
  const [gridColor, setGridColor] = useState('rgba(255, 255, 255, 0.3)') // Default to light color

  // Function to determine brightness of the background image and set grid color
  const checkImageBrightness = (imageUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.crossOrigin = 'Anonymous'
      img.src = imageUrl

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = img.width
        canvas.height = img.height

        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height)

          const imageData = ctx.getImageData(0, 0, img.width, img.height).data
          let r, g, b, avg
          let colorSum = 0

          for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
              const offset = (y * img.width + x) * 4
              r = imageData[offset]
              g = imageData[offset + 1]
              b = imageData[offset + 2]

              avg = Math.floor((r + g + b) / 3)
              colorSum += avg
            }
          }

          const brightness = Math.floor(colorSum / (img.width * img.height))
          console.log("Image brightness:", brightness)
          resolve(brightness)
        } else {
          reject(new Error("Could not get 2D context from canvas."))
        }
      }

      img.onerror = (err) => reject(err)
    })
  }


  useEffect(() => {
    if (selected && selected.bg) {
      if (selected.bg.startsWith('https://')) {
        checkImageBrightness(selected.bg) // Call the function with the image URL
      }
    }
  }, [selected])


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
      if (selected?.components[0]?.type === ComponentTypes.BACKGROUND) {
        setActiveComponent(selected.components[0])
        setActiveComponentIndex(0)
      } else {
        setActiveComponent(null)
        setActiveComponentIndex(null)
      }
    }
  }

  function isActiveElementNotInput () {
    const activeElement = document.activeElement
    const inputTags = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"]
    if (!activeElement) return true
    return !inputTags.includes(activeElement.tagName)
  }

  useKey("v", (event) => {
    if ((event.ctrlKey || event.metaKey)) {
    }
  })
  useKey("Backspace", () => {
    if (tempDataRef.current) {
      if (isActiveElementNotInput()) {
        const {
          activeComponent, activeComponentIndex, selected
        } = tempDataRef.current
        if (activeComponent && activeComponentIndex !== null && selected && activeComponent.type !== ComponentTypes.BACKGROUND) {
          const copy = { ...selected }
          copy.components.splice(activeComponentIndex, 1)
          setSelected({ ...copy })
          setActiveComponent(null)
          setActiveComponentIndex(null)
        }
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

  useKey('ArrowRight', () => {
    if (tempDataRef.current) {
      if (isActiveElementNotInput()) {
        const {
          activeComponent, activeComponentIndex, selected
        } = tempDataRef.current
        if (activeComponent && activeComponentIndex !== null && selected && activeComponent.type !== ComponentTypes.BACKGROUND) {
          const copy = { ...selected }
          let selComponent = copy.components[activeComponentIndex]
          if (selComponent.position) {
            selComponent.position.x += 1
          }
          setSelected({ ...copy })
        }
      }
    }
  })

  // Listen for the "ArrowLeft" key
  useKey('ArrowLeft', () => {
    if (tempDataRef.current) {
      if (isActiveElementNotInput()) {
        const {
          activeComponent, activeComponentIndex, selected
        } = tempDataRef.current
        if (activeComponent && activeComponentIndex !== null && selected && activeComponent.type !== ComponentTypes.BACKGROUND) {
          const copy = { ...selected }
          let selComponent = copy.components[activeComponentIndex]
          if (selComponent.position) {
            selComponent.position.x -= 1
          }
          setSelected({ ...copy })
        }
      }
    }
  })

  // Listen for the "ArrowUp" key
  useKey('ArrowUp', () => {
    if (tempDataRef.current) {
      if (isActiveElementNotInput()) {
        const {
          activeComponent, activeComponentIndex, selected
        } = tempDataRef.current
        if (activeComponent && activeComponentIndex !== null && selected && activeComponent.type !== ComponentTypes.BACKGROUND) {
          const copy = { ...selected }
          let selComponent = copy.components[activeComponentIndex]
          if (selComponent.position) {
            selComponent.position.y -= 1
          }
          setSelected({ ...copy })
        }
      }
    }
  })

  // Listen for the "ArrowDown" key
  useKey('ArrowDown', () => {
    if (tempDataRef.current) {
      if (isActiveElementNotInput()) {
        const {
          activeComponent, activeComponentIndex, selected
        } = tempDataRef.current
        if (activeComponent && activeComponentIndex !== null && selected && activeComponent.type !== ComponentTypes.BACKGROUND) {
          const copy = { ...selected }
          let selComponent = copy.components[activeComponentIndex]
          if (selComponent.position) {
            selComponent.position.y += 1
          }
          setSelected({ ...copy })
        }
      }
    }
  })


  const handleBgUpload = async function (file?: File) {
    if (file) {
      setUploading(true)

      // Use FileReader to read the image file as a data URL
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string

        try {
          // Check the brightness of the image before uploading
          const brightness = await checkImageBrightness(imageUrl)

          // Optionally: Do something based on the brightness (e.g., alert or prevent upload

          console.log("Brightness of the uploaded image:", brightness)

          // Now proceed with uploading if brightness check is successful
          const formData = new FormData()
          const originalName = file.name
          const fileExtension = originalName.substring(originalName.lastIndexOf('.'))
          let timestamp = new Date().getTime()
          formData.append("file", file, `x${brightness}-${timestamp}${fileExtension}`)

          // Upload the file and update the team background URLs
          const { data } = await uploadFile(formData)
          if (data) {
            let urls = [...(team?.certificateBackgrounds || [])]
            urls.push(data)
            const res = await _updateTeamBackgrounds({ payload: { certificateBackgrounds: urls } })
            setTeam(res.data)
          }
        } catch (error) {
          console.error("Error checking image brightness:", error)
        } finally {
          setUploading(false)
        }
      }

      reader.onerror = (err) => {
        console.error("Error reading file:", err)
        setUploading(false)
      }
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
      case ComponentTypes.DATE:
        component = <TextContent text={data.properties.text} border={data.properties.border} height={"auto"} width={data.properties.width || 100} />
        break
      case ComponentTypes.TEXT:
      case ComponentTypes.COURSE:
        component = <TextContent text={data.properties.text} border={data.properties.border} height={"auto"} width={data.properties.width || 100} />
        break

      case ComponentTypes.NAME:
        component = <TextContent text={data.properties.text} border={data.properties.border} height={data.properties.height || 40} width={data.properties.width || 100} />
        break
      case ComponentTypes.SIGNATORY:
        component = <SignatureBox url={data.properties.url} border={data.properties.border} radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} />
        break
      case ComponentTypes.CIRCLE:
        component = <Circle size={data.properties.size || 100} color={data.properties.color || '#000'} />
        break

      case ComponentTypes.IMAGE:
        component = <ImageBox url={data.properties.url} radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} />
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
      case ComponentTypes.DATE:
        component = <div className='font-semibold'>Date</div>
        break
      case ComponentTypes.COURSE:
        component = <div className='font-semibold'>Course Title</div>
        break
      case ComponentTypes.NAME:
        component = <div className='font-semibold'>Recipient</div>
        break
      case ComponentTypes.SIGNATORY:
        component = <div className={`font-semibold`}>
          Signature
        </div>
        break
      case ComponentTypes.CIRCLE:
        component = <Circle size={80} color={'#000'} />
        break
      case ComponentTypes.TRAPEZOID:
        component = <Trapezoid leftSize={0} rightSize={50} bottomSize={80} width={80} color={'#000'} />
        break
      case ComponentTypes.TRIANGLE:
        component = <Triangle leftSize={60} rightSize={60} bottomSize={80} color={'#000'} />
        break
      case ComponentTypes.SQUARE:
        component = <Box radius={{ rt: 0, rb: 0, lb: 0, lt: 0 }} height={80} width={90} color={'#000'} />
        break
      case ComponentTypes.RECTANGLE:
        component = <Box radius={{ rt: 0, rb: 0, lb: 0, lt: 0 }} height={40} width={100} color={'#000'} />
        break

      case ComponentTypes.IMAGE:
        component = <ImageBox radius={{ rt: 0, rb: 0, lb: 0, lt: 0 }} height={70} width={70} />
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
            <div className='w-28'>
              <div className='h-8 relative'>
                <input type="text" onBlur={(e) => {
                  if (activeComponentIndex !== null) {
                    let color = e.target.value
                    let isValid = isValidHexColor(color)
                    if (!isValid) {
                      color = "#ffffff"
                    }

                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    copySel.components[activeComponentIndex].properties.color = color
                    copyActive.properties.color = color
                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }
                }} defaultValue={data.properties.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                <Popover>
                  <PopoverTrigger>
                    <div style={{
                      background: data.properties.color
                    }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                  </PopoverTrigger>
                  <PopoverContent className='w-52 p-0'>
                    <PopoverBody className='w-52 p-1'>
                      <HexColorPicker color={data.properties.color} onChange={(color) => {
                        if (activeComponentIndex !== null) {
                          let copySel = { ...elements }
                          let copyActive = { ...data }
                          copySel.components[activeComponentIndex].properties.color = color
                          copyActive.properties.color = color
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className='font-semibold text-xs mt-3'>Dimensions</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/2 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>D</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  let s = e.target.valueAsNumber || 0
                  if (s > 600) {
                    s = 600
                  }
                  copySel.components[activeComponentIndex].properties.size = s
                  copySel.components[activeComponentIndex].properties.size = s
                  copyActive.properties.size = s
                  copyActive.properties.size = s
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }} value={data.properties.size} max={600} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
          </div>
        </div>
        break
      case ComponentTypes.TRAPEZOID:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-28'>
              <div className='h-8 relative'>
                <input type="text" onBlur={(e) => {
                  if (activeComponentIndex !== null) {
                    let color = e.target.value
                    let isValid = isValidHexColor(color)
                    if (!isValid) {
                      color = "#ffffff"
                    }

                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    copySel.components[activeComponentIndex].properties.color = color
                    copyActive.properties.color = color
                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }
                }} defaultValue={data.properties.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                <Popover>
                  <PopoverTrigger>
                    <div style={{
                      background: data.properties.color
                    }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                  </PopoverTrigger>
                  <PopoverContent className='w-52 p-0'>
                    <PopoverBody className='w-52 p-1'>
                      <HexColorPicker color={data.properties.color} onChange={(color) => {
                        if (activeComponentIndex !== null) {
                          let copySel = { ...elements }
                          let copyActive = { ...data }
                          copySel.components[activeComponentIndex].properties.color = color
                          copyActive.properties.color = color
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
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
              <div className='w-28'>
                <div className='h-8 relative'>
                  <input type="text" onBlur={(e) => {
                    if (activeComponentIndex !== null) {
                      let color = e.target.value
                      let isValid = isValidHexColor(color)
                      if (!isValid) {
                        color = "#ffffff"
                      }

                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      copySel.components[activeComponentIndex].properties.color = color
                      copyActive.properties.color = color
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }} defaultValue={data.properties.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                  <Popover>
                    <PopoverTrigger>
                      <div style={{
                        background: data.properties.color
                      }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                    </PopoverTrigger>
                    <PopoverContent className='w-52 p-0'>
                      <PopoverBody className='w-52 p-1'>
                        <HexColorPicker color={data.properties.color} onChange={(color) => {
                          if (activeComponentIndex !== null) {
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            copySel.components[activeComponentIndex].properties.color = color
                            copyActive.properties.color = color
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }} />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
        break
      case ComponentTypes.SQUARE:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-28'>
              <div className='h-8 relative'>
                <input type="text" onBlur={(e) => {
                  if (activeComponentIndex !== null) {
                    let color = e.target.value
                    let isValid = isValidHexColor(color)
                    if (!isValid) {
                      color = "#ffffff"
                    }

                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    copySel.components[activeComponentIndex].properties.color = color
                    copyActive.properties.color = color
                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }
                }} defaultValue={data.properties.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                <Popover>
                  <PopoverTrigger>
                    <div style={{
                      background: data.properties.color
                    }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                  </PopoverTrigger>
                  <PopoverContent className='w-52 p-0'>
                    <PopoverBody className='w-52 p-1'>
                      <HexColorPicker color={data.properties.color} onChange={(color) => {
                        if (activeComponentIndex !== null) {
                          let copySel = { ...elements }
                          let copyActive = { ...data }
                          copySel.components[activeComponentIndex].properties.color = color
                          copyActive.properties.color = color
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
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
      case ComponentTypes.IMAGE:
      case ComponentTypes.SIGNATORY:
        component = <div className='mt-2'>
          {data.type === ComponentTypes.RECTANGLE && <>
            <div className='font-semibold text-sm'>Background</div>
            <div className='flex gap-2 items-center'>
              <label htmlFor="background-color">Color</label>
              <div className='w-28'>
                <div className='h-8 relative'>
                  <input type="text" onBlur={(e) => {
                    if (activeComponentIndex !== null) {
                      let color = e.target.value
                      let isValid = isValidHexColor(color)
                      if (!isValid) {
                        color = "#ffffff"
                      }

                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      copySel.components[activeComponentIndex].properties.color = color
                      copyActive.properties.color = color
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }} defaultValue={data.properties.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                  <Popover>
                    <PopoverTrigger>
                      <div style={{
                        background: data.properties.color
                      }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                    </PopoverTrigger>
                    <PopoverContent className='w-52 p-0'>
                      <PopoverBody className='w-52 p-1'>
                        <HexColorPicker color={data.properties.color} onChange={(color) => {
                          if (activeComponentIndex !== null) {
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            copySel.components[activeComponentIndex].properties.color = color
                            copyActive.properties.color = color
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }} />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </>}

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


          {data.type !== ComponentTypes.SIGNATORY && <>
            <div className='font-semibold text-xs mt-3'>Radius</div>
            <div className='flex gap-2 items-center'>
              <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
                <div className='h-full w-8 flex items-center font-semibold justify-center'>RT</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }

                    if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                      const selComponent = copySel.components[activeComponentIndex]

                      // Ensure properties exist before trying to access them
                      if (selComponent.properties?.radius && copyActive.properties?.radius) {
                        // Both radius objects exist
                        selComponent.properties.radius.rt = e.target.valueAsNumber
                        copyActive.properties.radius.rt = e.target.valueAsNumber
                      } else {
                        // If radius does not exist, define it
                        const radius = {
                          rt: e.target.valueAsNumber,
                          rb: 0,
                          lb: 0,
                          lt: 0
                        }

                        // Ensure properties objects exist and then assign radius
                        selComponent.properties = selComponent.properties || {}
                        selComponent.properties.radius = radius

                        copyActive.properties = copyActive.properties || {}
                        copyActive.properties.radius = radius
                      }

                      // Update state with modified copies
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }} value={data.properties.radius?.rt} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
                <div className='h-full w-8 flex items-center font-semibold justify-center'>RB</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }

                    if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                      const selComponent = copySel.components[activeComponentIndex]

                      // Ensure properties exist before trying to access them
                      if (selComponent.properties?.radius && copyActive.properties?.radius) {
                        // Both radius objects exist
                        selComponent.properties.radius.rb = e.target.valueAsNumber
                        copyActive.properties.radius.rb = e.target.valueAsNumber
                      } else {
                        // If radius does not exist, define it
                        const radius = {
                          rb: e.target.valueAsNumber,
                          rt: 0,
                          lb: 0,
                          lt: 0
                        }

                        // Ensure properties objects exist and then assign radius
                        selComponent.properties = selComponent.properties || {}
                        selComponent.properties.radius = radius

                        copyActive.properties = copyActive.properties || {}
                        copyActive.properties.radius = radius
                      }

                      // Update state with modified copies
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }

                  }} value={data.properties.radius?.rb} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
                <div className='h-full w-8 flex items-center font-semibold justify-center'>LB</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                      let selComponent = copySel.components[activeComponentIndex]
                      if (selComponent.properties?.radius && copyActive.properties?.radius) {
                        selComponent.properties.radius.lb = e.target.valueAsNumber
                        copyActive.properties.radius.lb = e.target.valueAsNumber
                      } else {
                        let radius = {
                          lb: e.target.valueAsNumber,
                          rb: 0,
                          rt: 0,
                          lt: 0
                        }
                        selComponent.properties = selComponent.properties || {}
                        selComponent.properties.radius = radius

                        copyActive.properties = copyActive.properties || {}
                        copyActive.properties.radius = radius
                      }

                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }} value={data.properties.radius?.lb} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='border rounded-lg text-xs h-8 w-1/4 flex gap-2'>
                <div className='h-full w-8 flex items-center font-semibold justify-center'>LT</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                      let selComponent = copySel.components[activeComponentIndex]
                      if (selComponent.properties.radius && copyActive.properties.radius) {
                        selComponent.properties.radius.lt = e.target.valueAsNumber
                        copyActive.properties.radius.lt = e.target.valueAsNumber
                      } else {
                        let radius = {
                          lt: e.target.valueAsNumber,
                          rb: 0,
                          lb: 0,
                          rt: 0
                        }
                        selComponent.properties.radius = radius
                        copyActive.properties.radius = radius
                      }

                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }} value={data.properties.radius?.lt} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>
            </div>
          </>}

          {(data.type === ComponentTypes.IMAGE || data.type === ComponentTypes.SIGNATORY) && <>
            <div className='font-semibold text-sm'>Source</div>
            <div className='flex gap-2 items-center'>
              <div className='px-3 h-8 rounded-md border w-full pr-8 relative'>
                <div className='truncate px-4 flex items-center absolute top-0 left-0 h-8 w-full'>
                  {data.properties.url}
                </div>
                <MediaSelectorCertificate type={CertificateMediaTypes.SIGNATURE} onSelect={(url) => {
                  if (activeComponentIndex !== null) {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                      copySel.components[activeComponentIndex].properties.url = url
                      copyActive.properties.url = url
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} />
              </div>
            </div>

            {data.type === ComponentTypes.SIGNATORY && <>
              <div className='font-semibold text-xs mt-3'>Border</div>
              <div className='flex gap-1 items-center'>
                <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                  <div className='h-full w-6 flex items-center font-semibold justify-center'>R</div>
                  <div className='flex-1 h-full'>
                    <input type="number" onChange={(e) => {
                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                        let selComponent = copySel.components[activeComponentIndex]
                        if (selComponent.properties.border && copyActive.properties.border) {
                          selComponent.properties.border.r = e.target.valueAsNumber
                          copyActive.properties.border.r = e.target.valueAsNumber
                        } else {
                          let border = {
                            r: e.target.valueAsNumber,
                            b: 0,
                            l: 0,
                            t: 0,
                            color: "#000"
                          }
                          selComponent.properties.border = border
                          copyActive.properties.border = border
                        }

                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} value={data.properties.border?.r} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                  </div>
                  <div className='w-2'></div>
                </div>

                <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                  <div className='h-full w-6 flex items-center font-semibold justify-center'>B</div>
                  <div className='flex-1 h-full'>
                    <input type="number" onChange={(e) => {
                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                        let selComponent = copySel.components[activeComponentIndex]
                        if (selComponent.properties.border && copyActive.properties.border) {
                          selComponent.properties.border.b = e.target.valueAsNumber
                          copyActive.properties.border.b = e.target.valueAsNumber
                        } else {
                          let border = {
                            b: e.target.valueAsNumber,
                            r: 0,
                            l: 0,
                            t: 0,
                            color: "#000"
                          }
                          selComponent.properties.border = border
                          copyActive.properties.border = border
                        }

                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} value={data.properties.border?.b} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                  </div>
                  <div className='w-2'></div>
                </div>

                <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                  <div className='h-full w-6 flex items-center font-semibold justify-center'>L</div>
                  <div className='flex-1 h-full'>
                    <input type="number" onChange={(e) => {
                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                        let selComponent = copySel.components[activeComponentIndex]
                        if (selComponent.properties.border && copyActive.properties.border) {
                          selComponent.properties.border.l = e.target.valueAsNumber
                          copyActive.properties.border.l = e.target.valueAsNumber
                        } else {
                          let border = {
                            l: e.target.valueAsNumber,
                            r: 0,
                            b: 0,
                            t: 0,
                            color: "#000"
                          }
                          selComponent.properties.border = border
                          copyActive.properties.border = border
                        }

                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} value={data.properties.border?.l} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                  </div>
                  <div className='w-2'></div>
                </div>
                <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                  <div className='h-full w-6 flex items-center font-semibold justify-center'>T</div>
                  <div className='flex-1 h-full'>
                    <input type="number" onChange={(e) => {
                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                        let selComponent = copySel.components[activeComponentIndex]
                        if (selComponent.properties.border && copyActive.properties.border) {
                          selComponent.properties.border.t = e.target.valueAsNumber
                          copyActive.properties.border.t = e.target.valueAsNumber
                        } else {
                          let border = {
                            t: e.target.valueAsNumber,
                            r: 0,
                            l: 0,
                            b: 0,
                            color: "#000"
                          }
                          selComponent.properties.border = border
                          copyActive.properties.border = border
                        }

                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} value={data.properties.border?.t} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                  </div>
                  <div className='w-2'></div>
                </div>

                <div className='w-1/6'>
                  <div className='h-8 relative'>
                    <input type="text" onBlur={(e) => {
                      if (activeComponentIndex !== null) {
                        let color = e.target.value
                        let isValid = isValidHexColor(color)
                        if (!isValid) {
                          color = "#ffffff"
                        }

                        let copySel = { ...elements }
                        let copyActive = { ...data }
                        if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                          let selComponent = copySel.components[activeComponentIndex]
                          if (selComponent.properties.border && copyActive.properties.border) {
                            selComponent.properties.border.color = color
                            copyActive.properties.border.color = color
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }
                      }
                    }} defaultValue={data.properties.border?.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                    <Popover>
                      <PopoverTrigger>
                        <div style={{
                          background: data.properties.border?.color
                        }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                      </PopoverTrigger>
                      <PopoverContent className='w-52 p-0'>
                        <PopoverBody className='w-52 p-1'>
                          <HexColorPicker color={data.properties.border?.color} onChange={(color) => {
                            if (activeComponentIndex !== null) {
                              let copySel = { ...elements }
                              let copyActive = { ...data }
                              if (copySel && copyActive && copySel.components[activeComponentIndex]) {
                                let selComponent = copySel.components[activeComponentIndex]
                                if (selComponent.properties.border && copyActive.properties.border) {
                                  selComponent.properties.border.color = color
                                  copyActive.properties.border.color = color
                                  setSelected(copySel)
                                  setActiveComponent(copyActive)
                                }
                              }
                            }
                          }} />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>



              </div>
            </>}
          </>}
        </div>
        break
      case ComponentTypes.BACKGROUND:
        component = <div className='mt-2'>
          <div className='font-semibold text-sm'>Background</div>
          <div className='flex gap-2 items-center'>
            <label htmlFor="background-color">Color</label>
            <div className='w-28'>
              <div className='h-8 relative'>
                <input type="text" onBlur={(e) => {
                  if (activeComponentIndex !== null) {
                    let color = e.target.value
                    let isValid = isValidHexColor(color)
                    if (!isValid) {
                      color = "#ffffff"
                    }

                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    copySel.components[activeComponentIndex].properties.color = color
                    copyActive.properties.color = color
                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }
                }} defaultValue={data.properties.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                <Popover>
                  <PopoverTrigger>
                    <div style={{
                      background: data.properties.color
                    }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                  </PopoverTrigger>
                  <PopoverContent className='w-52 p-0'>
                    <PopoverBody className='w-52 p-1'>
                      <HexColorPicker color={data.properties.color} onChange={(color) => {
                        if (activeComponentIndex !== null) {
                          let copySel = { ...elements }
                          let copyActive = { ...data }
                          copySel.components[0].properties.color = color
                          copyActive.properties.color = color
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        break

      case ComponentTypes.NAME:
      case ComponentTypes.TEXT:
      case ComponentTypes.DATE:
      case ComponentTypes.COURSE:
        component = <div className='mt-2'>
          <div className='font-semibold text-xs mt-3'>Typography</div>
          <div className='flex gap-1 items-center'>
            <div className='w-1/4'>
              <div className='font-semibold text-xs mt-3'>Fill</div>
              <div className='h-8 w-full relative'>
                <input type="text" onChange={(e) => {
                  if (activeComponentIndex !== null) {
                    let color = e.target.value
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.color = color
                      copyActive.properties.text.color = color
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} onBlur={(e) => {
                  if (activeComponentIndex !== null) {
                    let color = e.target.value
                    if (color.length === 6 || color.length === 3 || color.length === 8) {
                      let isValid = isValidHexColor(color)
                      if (!isValid) {
                        color = "#ffffff"
                      }
                    }

                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.color = color
                      copyActive.properties.text.color = color
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} value={data.properties.text?.color} className='h-8 pl-8 uppercase text-xs w-28 rounded-md border absolute top-0 left-0' />
                <Popover>
                  <PopoverTrigger>
                    <div style={{
                      background: data.properties.text?.color
                    }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                  </PopoverTrigger>
                  <PopoverContent className='w-52 p-0'>
                    <PopoverBody className='w-52 p-1'>
                      <HexColorPicker color={data.properties.text?.color} onChange={(color) => {
                        if (activeComponentIndex !== null) {
                          let copySel = { ...elements }
                          let copyActive = { ...data }
                          let selComponent = copySel.components[activeComponentIndex]
                          if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                            selComponent.properties.text.color = color
                            copyActive.properties.text.color = color
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }
                      }} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="w-1/4">
              <div className='font-semibold text-xs mt-3'>Font size</div>
              <div className='h-8 w-full relative'>
                <input type="number" onChange={(e) => {
                  if (activeComponentIndex !== null) {
                    let size = e.target.valueAsNumber
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.size = size
                      copyActive.properties.text.size = size
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} min={0} value={data.properties.text?.size} className='h-8 pl-3 pr-8 uppercase text-xs w-28 rounded-md border absolute top-0 left-0' />
                <Popover>
                  <PopoverTrigger>
                    <div className='h-8 w-8 absolute right-0 rounded-r-md'>
                      <div className='h-8 w-8 absolute flex justify-center border-l items-center right-2 rounded-r-md  hover:bg-gray-200 cursor-pointer'>
                        <FiChevronDown className='text-sm' />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className='w-20 p-0'>
                    <PopoverBody className='w-20 h-40 overflow-y-scroll p-1'>
                      {data.properties.text?.size && !defaultFontSizes.includes(data.properties.text?.size) && <div className='border-b h-8 w-full'>
                        <div className=' hover:bg-purple-600 hover:text-white cursor-pointer flex items-center justify-center text-sm font-medium h-7 rounded-md'>
                          {data.properties.text?.size}
                        </div>
                      </div>}
                      <div className='mt-2'>
                        {defaultFontSizes.map((e) => <div key={e} onClick={() => {
                          if (activeComponentIndex !== null) {
                            let size = e
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            let selComponent = copySel.components[activeComponentIndex]
                            if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                              selComponent.properties.text.size = size
                              copyActive.properties.text.size = size
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }
                        }} className=' hover:bg-purple-600 cursor-pointer hover:text-white flex items-center justify-center text-sm font-medium h-7 rounded-md'>{e}</div>)}
                      </div>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="w-1/4">
              <div className='font-semibold text-xs mt-3'>Font weight</div>
              <div className='h-8 w-full relative'>
                <div className='h-8 pl-3 pr-8 flex items-center w-28 rounded-md border text-xs absolute top-0 left-0'>
                  {data.properties.text?.weight ? defaultFontWeights.find(e => e.value === data.properties.text?.weight)?.title : ""}
                </div>
                <Popover>
                  <PopoverTrigger>
                    <div className='h-8 w-8 absolute right-0 rounded-r-md'>
                      <div className='h-8 w-8 absolute flex justify-center border-l items-center right-2 rounded-r-md  hover:bg-gray-200 cursor-pointer'>
                        <FiChevronDown className='text-sm' />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className='w-32 p-0'>
                    <PopoverBody className='w-32 h-40 overflow-y-scroll p-1'>
                      <div className='mt-2'>
                        {defaultFontWeights.map((e) => <div key={e.title} onClick={() => {
                          if (activeComponentIndex !== null) {
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            let selComponent = copySel.components[activeComponentIndex]
                            if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                              selComponent.properties.text.weight = e.value
                              copyActive.properties.text.weight = e.value
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }
                        }} className=' hover:bg-purple-600 cursor-pointer hover:text-white flex items-center justify-start px-3 text-sm font-semibold h-7 rounded-md'>{e.title}</div>)}
                      </div>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

          </div>

          <div className="flex gap-3">
            <div className="w-1/3">
              <div className='font-semibold text-xs mt-3'>Font family</div>
              <div className='h-8 w-full relative'>
                <div className='h-8 pl-3 pr-8 flex items-center w-full rounded-md border text-xs absolute top-0 left-0'>
                  {data.properties.text?.family}
                </div>
                <Popover>
                  <PopoverTrigger>
                    <div className='h-8 w-8 absolute right-0 rounded-r-md'>
                      <div className='h-8 w-8 absolute flex justify-center border-l items-center rounded-r-md  hover:bg-gray-200 cursor-pointer'>
                        <FiChevronDown className='text-sm' />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className='w-32 p-0'>
                    <PopoverBody className='w-32 h-40 overflow-y-scroll p-1'>
                      <div className='mt-2'>
                        {defaultFonts.map((e) => <div key={e.title} onClick={() => {
                          if (activeComponentIndex !== null) {
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            let selComponent = copySel.components[activeComponentIndex]
                            if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                              selComponent.properties.text.family = e.title
                              copyActive.properties.text.family = e.title
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }
                        }} style={e.font.style} className=' hover:bg-purple-600 cursor-pointer hover:text-white flex items-center justify-start px-3 text-sm font-semibold h-7 rounded-md'>{e.title}</div>)}
                      </div>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="w-1/4">
              <div className='font-semibold text-xs mt-3'>Text Align</div>
              <div className='h-8 rounded-md w-full border items-center bg-gray-100 flex'>
                <div onClick={() => {
                  if (activeComponentIndex !== null) {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.align = TextAlign.LEFT
                      copyActive.properties.text.align = TextAlign.LEFT
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} className={`h-7 cursor-pointer w-1/3 ${data.properties.text?.align === TextAlign.LEFT && 'border bg-gray-200 border-gray-100'} rounded-md flex items-center justify-center`}>
                  <FiAlignLeft />
                </div>
                <div onClick={() => {
                  if (activeComponentIndex !== null) {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.align = TextAlign.CENTER
                      copyActive.properties.text.align = TextAlign.CENTER
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} className={`h-7 cursor-pointer w-1/3 ${data.properties.text?.align === TextAlign.CENTER && 'border bg-gray-200 border-gray-100'} rounded-md flex items-center justify-center`}>
                  <FiAlignCenter />
                </div>
                <div onClick={() => {
                  if (activeComponentIndex !== null) {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.align = TextAlign.RIGHT
                      copyActive.properties.text.align = TextAlign.RIGHT
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} className={`h-7 cursor-pointer w-1/3 ${data.properties.text?.align === TextAlign.RIGHT && 'border bg-gray-200 border-gray-100'} rounded-md flex items-center justify-center`}>
                  <FiAlignRight />
                </div>
              </div>
            </div>
          </div>


          <div className='font-semibold text-xs mt-3'>Dimensions</div>
          <div className='flex gap-2 items-center'>
            <div className='border rounded-lg text-xs h-8 w-1/3 flex gap-2'>
              <div className='h-full w-6 flex items-center font-semibold justify-center'>W</div>
              <div className='flex-1 h-full'>
                <input type="number" onChange={(e) => {
                  let copySel = { ...elements }
                  let copyActive = { ...data }
                  let selComponent = copySel.components[activeComponentIndex]
                  if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                    selComponent.properties.width = e.target.valueAsNumber
                    copyActive.properties.width = e.target.valueAsNumber
                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }
                }} value={data.properties.width} max={800} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
              </div>
              <div className='w-2'></div>
            </div>
          </div>

          {(data.type === ComponentTypes.NAME || data.type === ComponentTypes.TEXT || data.type === ComponentTypes.DATE) && <>
            <div className='font-semibold text-xs mt-3'>Border</div>
            <div className='flex gap-1 items-center'>
              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>R</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.r = e.target.valueAsNumber
                      copyActive.properties.border.r = e.target.valueAsNumber
                    } else {
                      let border = {
                        r: e.target.valueAsNumber,
                        b: 0,
                        l: 0,
                        t: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.r} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>B</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.b = e.target.valueAsNumber
                      copyActive.properties.border.b = e.target.valueAsNumber
                    } else {
                      let border = {
                        b: e.target.valueAsNumber,
                        r: 0,
                        l: 0,
                        t: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.b} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>L</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.l = e.target.valueAsNumber
                      copyActive.properties.border.l = e.target.valueAsNumber
                    } else {
                      let border = {
                        l: e.target.valueAsNumber,
                        r: 0,
                        b: 0,
                        t: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.l} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>
              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>T</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.t = e.target.valueAsNumber
                      copyActive.properties.border.t = e.target.valueAsNumber
                    } else {
                      let border = {
                        t: e.target.valueAsNumber,
                        r: 0,
                        l: 0,
                        b: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.t} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='w-1/6'>
                <div className='h-8 relative'>
                  <input type="text" onBlur={(e) => {
                    if (activeComponentIndex !== null) {
                      let color = e.target.value
                      let isValid = isValidHexColor(color)
                      if (!isValid) {
                        color = "#ffffff"
                      }

                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      let selComponent = copySel.components[activeComponentIndex]
                      if (selComponent.properties.border && copyActive.properties.border) {
                        selComponent.properties.border.color = color
                        copyActive.properties.border.color = color
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }
                  }} defaultValue={data.properties.border?.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                  <Popover>
                    <PopoverTrigger>
                      <div style={{
                        background: data.properties.border?.color
                      }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                    </PopoverTrigger>
                    <PopoverContent className='w-52 p-0'>
                      <PopoverBody className='w-52 p-1'>
                        <HexColorPicker color={data.properties.border?.color} onChange={(color) => {
                          if (activeComponentIndex !== null) {
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            let selComponent = copySel.components[activeComponentIndex]
                            if (selComponent.properties.border && copyActive.properties.border) {
                              selComponent.properties.border.color = color
                              copyActive.properties.border.color = color
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }
                        }} />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>



            </div>
          </>}


          {data.type === ComponentTypes.DATE && <>
            <div className="w-1/2">
              <div className='font-semibold text-xs mt-3'>Date format</div>
              <div className='h-8 w-full relative'>
                <div className='h-8 pl-3 pr-8 flex items-center w-full rounded-md border text-xs absolute top-0 left-0'>
                  {data.properties.text?.value}
                </div>
                <Popover>
                  <PopoverTrigger>
                    <div className='h-8 w-8 absolute right-0 rounded-r-md'>
                      <div className='h-8 w-8 absolute flex justify-center border-l items-center rounded-r-md  hover:bg-gray-200 cursor-pointer'>
                        <FiChevronDown className='text-sm' />
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className='w-44 p-0'>
                    <PopoverBody className='w-44 h-40 overflow-y-scroll p-1'>
                      <div className='mt-2'>
                        {defaultDateFormats.map((e) => <div key={e} onClick={() => {
                          if (activeComponentIndex !== null) {
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            let selComponent = copySel.components[activeComponentIndex]
                            if (selComponent.properties.text && copyActive.properties.text) {
                              selComponent.properties.text.value = moment().format(e)
                              copyActive.properties.text.value = moment().format(e)
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }
                        }} className=' hover:bg-purple-600 cursor-pointer hover:text-white flex items-center justify-start px-3 text-sm font-semibold h-7 rounded-md'>{e}</div>)}
                      </div>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </>}

          {(data.type === ComponentTypes.COURSE) && <>
            <div className='w-full'>
              <div className='font-semibold text-xs mt-3'>Set a preview course title</div>
              <div className='h-8 w-full'>
                <input type="text" onChange={(e) => {
                  if (activeComponentIndex !== null) {
                    let course = e.target.value
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.value = course
                      copyActive.properties.text.value = course
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} value={data.properties.text?.value} className='h-8 px-3 uppercase text-xs w-full rounded-md border' />
              </div>
            </div>
          </>}

          {(data.type === ComponentTypes.TEXT) && <>
            <div className='w-full'>
              <div className='font-semibold text-xs mt-3'>Set text content</div>
              <div className='h-8 w-full'>
                <input type="text" onChange={(e) => {
                  if (activeComponentIndex !== null) {
                    let course = e.target.value
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.text && copyActive.properties.text) {
                      selComponent.properties.text.value = course
                      copyActive.properties.text.value = course
                      setSelected(copySel)
                      setActiveComponent(copyActive)
                    }
                  }
                }} value={data.properties.text?.value} className='h-8 px-3 text-xs w-full rounded-md border' />
              </div>
            </div>

            <div className='font-semibold text-xs mt-3'>Border</div>
            <div className='flex gap-1 items-center'>
              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>R</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.r = e.target.valueAsNumber
                      copyActive.properties.border.r = e.target.valueAsNumber
                    } else {
                      let border = {
                        r: e.target.valueAsNumber,
                        b: 0,
                        l: 0,
                        t: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.r} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>B</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.b = e.target.valueAsNumber
                      copyActive.properties.border.b = e.target.valueAsNumber
                    } else {
                      let border = {
                        b: e.target.valueAsNumber,
                        r: 0,
                        l: 0,
                        t: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.b} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>L</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.l = e.target.valueAsNumber
                      copyActive.properties.border.l = e.target.valueAsNumber
                    } else {
                      let border = {
                        l: e.target.valueAsNumber,
                        r: 0,
                        b: 0,
                        t: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.l} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>
              <div className='border rounded-lg text-xs h-8 w-1/6 flex gap-2'>
                <div className='h-full w-6 flex items-center font-semibold justify-center'>T</div>
                <div className='flex-1 h-full'>
                  <input type="number" onChange={(e) => {
                    let copySel = { ...elements }
                    let copyActive = { ...data }
                    let selComponent = copySel.components[activeComponentIndex]
                    if (selComponent.properties.border && copyActive.properties.border) {
                      selComponent.properties.border.t = e.target.valueAsNumber
                      copyActive.properties.border.t = e.target.valueAsNumber
                    } else {
                      let border = {
                        t: e.target.valueAsNumber,
                        r: 0,
                        l: 0,
                        b: 0,
                        color: "#000"
                      }
                      selComponent.properties.border = border
                      copyActive.properties.border = border
                    }

                    setSelected(copySel)
                    setActiveComponent(copyActive)
                  }} value={data.properties.border?.t} max={50} min={0} className='w-full h-full focus-visible:outline-none focus-visible:border-none font-semibold px-2 act' />
                </div>
                <div className='w-2'></div>
              </div>

              <div className='w-1/6'>
                <div className='h-8 relative'>
                  <input type="text" onBlur={(e) => {
                    if (activeComponentIndex !== null) {
                      let color = e.target.value
                      let isValid = isValidHexColor(color)
                      if (!isValid) {
                        color = "#ffffff"
                      }

                      let copySel = { ...elements }
                      let copyActive = { ...data }
                      let selComponent = copySel.components[activeComponentIndex]
                      if (selComponent.properties.border && copyActive.properties.border) {
                        selComponent.properties.border.color = color
                        copyActive.properties.border.color = color
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }
                  }} defaultValue={data.properties.border?.color} className='h-8 pl-8 uppercase text-sm w-28 rounded-md border absolute top-0 left-0' />
                  <Popover>
                    <PopoverTrigger>
                      <div style={{
                        background: data.properties.border?.color
                      }} className='h-6 w-6 absolute rounded-md left-1 top-1 border'></div>
                    </PopoverTrigger>
                    <PopoverContent className='w-52 p-0'>
                      <PopoverBody className='w-52 p-1'>
                        <HexColorPicker color={data.properties.border?.color} onChange={(color) => {
                          if (activeComponentIndex !== null) {
                            let copySel = { ...elements }
                            let copyActive = { ...data }
                            let selComponent = copySel.components[activeComponentIndex]
                            if (selComponent.properties.border && copyActive.properties.border) {
                              selComponent.properties.border.color = color
                              copyActive.properties.border.color = color
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }
                        }} />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>



            </div>
          </>}

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
                {defaultElements.map((element) => <div key={element.type} onClick={() => setSelectedElement(structuredClone(element))} className={`h-32 flex cursor-pointer justify-center items-center ${element.type === selectedElement?.type ? 'border-primary-dark border-2' : 'border'}`}>
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
            <AccordionPanel className='px-0 py-2 grid grid-cols-1 overflow-y-scroll h-[500px]'>
              {renderComponentProperties(activeComponent, selected)}
            </AccordionPanel>
          </AccordionItem>}

        </Accordion>
      </div>
      <div className='flex-1 px-10 gap-6 h-full flex flex-col justify-start overflow-y-scroll'>
        <div className=''></div>
        <div className='h-10 w-full flex justify-between items-center'>
          <div></div>
          <div className='flex gap-3'>
            {selected && <button disabled={updatePending} className='bg-primary-dark disabled:bg-primary-dark/30 text-white px-3 h-10 flex items-center gap-2' onClick={() => _updateCertificate({
              payload: {
                components: selected,
                name: certificateInfo?.name
              }, id
            })}>
              Save changes {updatePending && <Spinner size={'sm'} />}
            </button>}

            {certificateInfo && <PreviewCertificateButton template={!certificateInfo?.components || certificateInfo?.components.components.length === 0} id={certificateInfo.id} />}
          </div>
        </div>
        {/* <StyledContextMenu
          modal={false}
          menuGroups={contextMenuData}
          onOpenChange={(open) => {
            if (!open) {
              setContextMenuData([])
            }
          }}
          > */}
        {/* @ts-gnore */}
        {/* onContextMenu={handlePaneContextMenu} */}
        {selected &&
          <div className='h-[600px] w-[900px] relative'>

            {selected.bg === "plain" ? <div style={{
              background: selected.components[0].properties.color
            }} className='absolute border top-0 left-0 h-full w-[900px] rounded-2xl'></div> : <img className='absolute top-0 left-0 h-full w-[900px] rounded-md' src={selected.bg} />}
            {/* <div className='absolute border top-0 left-0 h-full w-[900px] grid-lines' style={{
              backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), 
                            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
            }} /> */}
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
        }
        {/* </StyledContextMenu> */}
      </div>
    </div >
  )
}
