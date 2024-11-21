"use client"
import { IoResize } from "react-icons/io5"
import { BsBorderStyle } from "react-icons/bs"
import { ImTextColor } from "react-icons/im"
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
import { CertificateComponent, CertificatesInterface, CertificateTemplate, ComponentTypes, TextAlign, TextDecoration, TextStyle, TextTransform } from '@/type-definitions/cert-builder'
import { certificateTemplates, defaultElements } from '@/utils/certificate-templates'
import { queryClient } from '@/utils/react-query'
import { Popover, PopoverBody, PopoverContent, PopoverTrigger, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Tooltip, useDisclosure } from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { MouseEvent, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { BiPaste } from 'react-icons/bi'
import { FiAlignCenter, FiAlignLeft, FiAlignRight, FiCheck, FiChevronDown, FiCloud, FiMessageCircle, FiMinus, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi'
import { Rnd } from 'react-rnd'
import { useKey } from "react-use"
import { isValidHexColor } from '@/utils/string-formatters'
import { defaultDateFormats, defaultFonts, defaultFontSizes, defaultFontWeights } from '@/utils/certificate-utils'
import moment from 'moment'
import Draggable from 'react-draggable'
import MediaSelectorCertificate from '@/components/MediaSelectorCertificate'
import { CertificateMediaTypes } from '@/type-definitions/auth'
import SignatureBox from '@/components/CertificateElements/SignatureBox'
import { useParams } from 'next/navigation'
import { fetchCertificateByID, updateCertificateByID } from '@/services/certificates.services'
import PreviewCertificateButton from '@/components/Dashboard/PreviewCertificate'
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from 'react-icons/md'
import { PiShapes, PiShapesFill } from 'react-icons/pi'
import { GoItalic } from 'react-icons/go'
import { LuUnderline } from 'react-icons/lu'
import { RxCornerTopLeft, RxLetterCaseCapitalize } from 'react-icons/rx'
import { RiText } from 'react-icons/ri'
import { FaRegImage } from 'react-icons/fa6'
import { debounce } from '@/utils/tools'
import Head from 'next/head'

const defaultColors = [
  "#000000",
  "#545454",
  "#737373",
  "#a6a6a6",
  "#d9d9d9",
  "#ffffff",
  "#ff3131",
  "#ff5757",
  "#ff66c4",
  "#cb6ce6",
  "#8c52ff",
  "#5e17eb",
  "#0097b2",
  "#0cc0df",
  "#5ce1e6",
  "#38b6ff",
  "#5271ff",
  "#004aad",
  "#00bf63",
  "#7ed957",
  "#c1ff72",
  "#ffde59",
  "#ffbd59",
  "#ff914d",
]

const defaultGradients = [
  ["#000000", "#737373"],
  ["#000000", "#c89116"],
  ["#000000", "#3533cd"],
  ["#a6a6a6", "#ffffff"],
  ["#fff7ad", "#ffa9f9"],
  ["#cdffd8", "#94b9ff"],
  ["#ff3131", "#ff914d"],
  ["#ff5757", "#8c52ff"],
  ["#5170ff", "#ff66c4"],
  ["#004aad", "#cb6ce6"],
  ["#8c52ff", "#5ce1e6"],
  ["#5de0e6", "#004aad"],
  ["#8c52ff", "#00bf63"],
  ["#0097b2", "#7ed957"],
  ["#0cc0df", "#ffde59"],
  ["#ffde59", "#ff914d"],
  ["#ff66c4", "#ffde59"],
  ["#8c52ff", "#ff914d"],
]

enum ContextMenuGroupEnum {
  MANAGE = "manage",
  CLIPBOARD = "clipboard",
  MORE = "more",
}

export default function CertBuilderContent () {
  const { id } = useParams()
  const { isOpen: isColorSelectorOpen, onOpen: openColorSelector, onClose: closeColorSelector } = useDisclosure()
  const { isOpen: isFontFamilySelectorOpen, onOpen: openFontFamilySelector, onClose: closeFontFamilySelector } = useDisclosure()
  const { isOpen: isTextEditorOpen, onOpen: openTextEditor, onClose: closeTextEditor } = useDisclosure()
  const { isOpen: isBorderEditorOpen, onOpen: openBorderEditor, onClose: closeBorderEditor } = useDisclosure()

  const { isOpen: isRoundedOpen, onOpen: openRoundedEditor, onClose: closeRoundedEditor } = useDisclosure()
  const { isOpen: isSizeEditorOpen, onOpen: openSizeEditor, onClose: closeSizeEditor } = useDisclosure()

  const { team, setTeam } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [openSection, setOpenSection] = useState<string>("design")
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

  const adjustForDPI = (position: { x: number, y: number }, sloop?: boolean) => {
    let dpiScale = Number((window.devicePixelRatio || 1).toFixed(1))
    let factor = 0
    if (sloop) {
      console.log(dpiScale)
      if (dpiScale === 1.0) {
        factor = -24
      } else if (dpiScale === 1.2) {
        factor = 15
      } else if (dpiScale === 1.5) {
        factor = 8
      }
    }
    return {
      x: position.x,
      y: position.y + factor,
    }
  }


  useEffect(() => {
    if (selected) {
      // console.log(selected)
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

  const handleMediaUpload = async function (file?: File) {
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
        let urls = [...(team?.certificateMedia || [])]
        urls.push({
          type: CertificateMediaTypes.IMAGE,
          url: data
        })
        const res = await _updateTeamBackgrounds({ payload: { certificateMedia: urls } })
        setTeam(res.data)
      }
      setUploading(false)
    }
  }


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
    mutationFn: (load: { payload: { certificateBackgrounds?: string[], certificateMedia?: { url: string, type: CertificateMediaTypes }[] } }) => {
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

  const handleSave = debounce(() => {
    if (tempDataRef.current && tempDataRef.current.selected) {
      _updateCertificate({
        payload: {
          components: tempDataRef.current.selected,
          name: certificateInfo?.name
        }, id
      })
    }
  }, 5000)

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (selectedElement) {
      if (selected && mousePosition) {
        setSelected({
          ...selected, components: [...selected.components, {
            ...selectedElement, position: mousePosition
          }]
        })
        setSelectedElement(null)
        handleSave()
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

  const handleDeleteElement = (data: {
    activeComponent: CertificateComponent | null,
    selectedElement: CertificateComponent | null,
    activeComponentIndex: number | null,
    selected: CertificateTemplate | null,
  }) => {
    const {
      activeComponent, activeComponentIndex, selected
    } = data
    if (activeComponent && activeComponentIndex !== null && selected && activeComponent.type !== ComponentTypes.BACKGROUND) {
      const copy = { ...selected }
      copy.components.splice(activeComponentIndex, 1)
      setSelected({ ...copy })
      setActiveComponent(null)
      setActiveComponentIndex(null)
      handleSave()
    }
  }
  useKey((e) => e.key === "Backspace" || e.key === "Delete", () => {
    if (tempDataRef.current) {
      if (isActiveElementNotInput()) {
        handleDeleteElement(tempDataRef.current)
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
          handleSave()
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
          handleSave()
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
          handleSave()
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
          handleSave()
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
        component = <Circle border={data.properties.border} size={data.properties.size || 100} color={data.properties.color || '#000'} />
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
        component = <Box border={data.properties.border} radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 100} width={data.properties.width || 100} color={data.properties.color || '#000'} />
        break
      case ComponentTypes.RECTANGLE:
        component = <Box border={data.properties.border} radius={data.properties.radius || { rt: 0, rb: 0, lb: 0, lt: 0 }} height={data.properties.height || 40} width={data.properties.width || 400} color={data.properties.color || '#000'} />
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
        component = <ImageBox radius={{ rt: 0, rb: 0, lb: 0, lt: 0 }} height={70} width={70} url={data.properties.url} />
        break
      default:
        break
    }

    return component
  }

  const renderElementProperties = function (data: CertificateComponent, elements: CertificateTemplate) {
    if (activeComponentIndex === null || !elements) return <></>
    let component = <div></div>
    switch (data.type) {
      case ComponentTypes.TEXT:
      case ComponentTypes.DATE:
      case ComponentTypes.NAME:
      case ComponentTypes.COURSE:
        component = <>
          <div className={`w-36 border rounded-l-2xl cursor-pointer text-xs flex justify-center items-center rounded-r-lg h-8 ${isFontFamilySelectorOpen ? 'bg-gray-200' : 'hover:bg-gray-100'}`} onClick={() => {
            if (isFontFamilySelectorOpen) {
              closeFontFamilySelector()
            } else {
              openFontFamilySelector()
            }
          }}>

            {data.properties.text?.family}
          </div>
          <div className='w-28 ml-2 rounded-lg h-8 relative'>
            <input value={data.properties.text?.size} onChange={(e) => {
              if (activeComponentIndex !== null) {
                let copySel = { ...elements }
                let copyActive = { ...data }
                let selComponent = copySel.components[activeComponentIndex]
                let value = e.target.valueAsNumber || 0
                if (selComponent && selComponent.properties.text && copyActive.properties.text && value < 150) {
                  selComponent.properties.text.size = value
                  copySel.components[activeComponentIndex] = selComponent
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }
              }
            }} type="number" className='w-full h-8 border focus-within:border-purple-500 px-6 text-center rounded-lg text-xs absolute top-0 left-0' />
            <button onClick={() => {
              if (activeComponentIndex !== null) {
                let copySel = { ...elements }
                let copyActive = { ...data }
                let selComponent = copySel.components[activeComponentIndex]
                let value = data.properties.text?.size || 0
                if (selComponent && selComponent.properties.text && copyActive.properties.text && value > 0) {
                  selComponent.properties.text.size = (value - 1)
                  copySel.components[activeComponentIndex] = selComponent
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }
              }
            }} className='h-8 w-8 absolute top-0 left-0 flex justify-center items-center'>
              <FiMinus />
            </button>
            <button onClick={() => {
              if (activeComponentIndex !== null) {
                let copySel = { ...elements }
                let copyActive = { ...data }
                let selComponent = copySel.components[activeComponentIndex]
                let value = data.properties.text?.size || 0
                if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                  selComponent.properties.text.size = (value + 1)
                  copySel.components[activeComponentIndex] = selComponent
                  setSelected(copySel)
                  setActiveComponent(copyActive)
                }
              }
            }} className='h-8 w-8 absolute top-0 right-0 flex justify-center items-center'>
              <FiPlus />
            </button>
          </div>
          <Popover>
            <PopoverTrigger>
              <div className='w-20 text-xs cursor-pointer flex items-center justify-center ml-2 border rounded-lg h-8'>
                {data.properties.text?.weight ? defaultFontWeights.find(e => e.value === data.properties.text?.weight)?.title : ""}
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
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }
                  }} className=' hover:bg-purple-600 cursor-pointer hover:text-white flex items-center justify-start px-3 text-sm font-semibold h-7 rounded-md'>{e.title}</div>)}
                </div>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <button className={`text-primary-dark px-3 ml-2 h-8 rounded-md flex flex-col justify-center ${isColorSelectorOpen ? 'bg-gray-200' : 'hover:bg-gray-100'} items-center`} onClick={() => {
            if (isColorSelectorOpen) {
              closeColorSelector()
            } else {
              openColorSelector()
            }
          }}>
            <ImTextColor />
            <div style={{
              backgroundColor: data.properties.text?.color
            }} className='h-1 rounded-lg w-full'></div>
          </button>
          <button className={`text-primary-dark px-3 ml-2 h-8 rounded-md flex justify-center ${isTextEditorOpen ? 'bg-gray-200' : 'hover:bg-gray-100'} items-center`} onClick={() => {
            if (isTextEditorOpen) {
              closeTextEditor()
            } else {
              openTextEditor()
            }
          }}>
            <RiText />
          </button>
          <button className={`text-primary-dark px-3 ml-2 h-8 rounded-md flex ${data.properties.text?.decoration === "underline" ? 'bg-gray-200' : 'hover:bg-gray-100'} items-center gap-2`} onClick={() => {
            if (activeComponentIndex !== null) {
              let copySel = { ...elements }
              let copyActive = { ...data }
              let selComponent = copySel.components[activeComponentIndex]
              if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                selComponent.properties.text.decoration = selComponent.properties.text.decoration === TextDecoration.UNDERLINE ? TextDecoration.NONE : TextDecoration.UNDERLINE
                copySel.components[activeComponentIndex] = selComponent
                setSelected(copySel)
                setActiveComponent(copyActive)
              }
            }
          }}>
            <LuUnderline />
          </button>
          <button className={`text-primary-dark px-3 ml-2 h-8 rounded-md flex ${data.properties.text?.style === "italic" ? 'bg-gray-200' : 'hover:bg-gray-100'} items-center gap-2`} onClick={() => {
            if (activeComponentIndex !== null) {
              let copySel = { ...elements }
              let copyActive = { ...data }
              let selComponent = copySel.components[activeComponentIndex]
              if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                selComponent.properties.text.style = selComponent.properties.text.style === TextStyle.ITALIC ? TextStyle.NORMAL : TextStyle.ITALIC
                copySel.components[activeComponentIndex] = selComponent
                setSelected(copySel)
                setActiveComponent(copyActive)
              }
            }
          }}>
            <GoItalic />
          </button>

          <button className={`text-primary-dark px-3 ml-2 h-8 rounded-md flex ${data.properties.text?.transform === "uppercase" ? 'bg-gray-200' : 'hover:bg-gray-100'} items-center gap-2`} onClick={() => {
            if (activeComponentIndex !== null) {
              let copySel = { ...elements }
              let copyActive = { ...data }
              let selComponent = copySel.components[activeComponentIndex]
              if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                selComponent.properties.text.transform = selComponent.properties.text.transform === TextTransform.UPPERCASE ? TextTransform.NONE : TextTransform.UPPERCASE
                copySel.components[activeComponentIndex] = selComponent
                setSelected(copySel)
                setActiveComponent(copyActive)
              }
            }
          }}>
            <RxLetterCaseCapitalize />
          </button>
          <Popover isOpen={isBorderEditorOpen}>
            <PopoverTrigger>
              <div onClick={() => {
                if (isBorderEditorOpen) {
                  closeBorderEditor()
                } else {
                  openBorderEditor()
                }
              }} className={`px-3 ${isBorderEditorOpen ? 'bg-gray-200' : 'hover:bg-gray-100'} text-xs cursor-pointer flex items-center justify-center ml-2 rounded-lg h-8`}>
                <BsBorderStyle className='text-lg font-semibold' />
              </div>
            </PopoverTrigger>
            <PopoverContent className='w-64 p-0'>
              <PopoverBody className='w-64 overflow-y-scroll py-1 px-2.5'>
                <div className='mt-2'>
                  <div className="flex justify-between items-center">
                    <div className='text-sm font-semibold'>Borders</div>
                    <button onClick={closeBorderEditor} className='h-8 w-8' >
                      <FiX />
                    </button>
                  </div>

                  <div className='mt-2'>Color</div>
                  {activeComponent && <div className='grid grid-cols-10 w-full gap-1'>
                    {[ComponentTypes.TEXT, ComponentTypes.NAME, ComponentTypes.DATE, ComponentTypes.COURSE].includes(activeComponent.type) && defaultColors.map((color) => <button onClick={() => {
                      if (activeComponentIndex !== null && selected) {
                        let copySel = { ...selected }
                        let selComponent = copySel.components[activeComponentIndex]
                        let copyActive = { ...selComponent }
                        if (selComponent && selComponent.properties.border) {
                          selComponent.properties.border.color = color
                        } else {
                          selComponent.properties.border = {
                            color,
                            r: 0, b: 0, l: 0, t: 0
                          }
                        }
                        copySel.components[activeComponentIndex] = selComponent
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} style={{ backgroundColor: color }} key={color} className={`h-6 w-6 hover:border-2 border rounded-full ${activeComponent.properties?.border?.color === color && 'border-black border-2'}`}></button>)}
                  </div>}

                  <div className='mt-2'>Border Top</div>
                  <div className='flex items-center gap-2 px-2'>
                    <Slider
                      value={activeComponent?.properties?.border?.t}
                      min={0}
                      className='flex-1'
                      max={10}
                      step={1}
                      onChange={(val) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.t = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: 0, b: 0, l: 0, t: val
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }}
                    >
                      <SliderTrack className='h-1 rounded-2xl'>
                        <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                      </SliderTrack>
                      <SliderThumb style={{
                        backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                      }} className={`h-4 w-4`} />
                    </Slider>
                    <input value={activeComponent?.properties?.border?.t} onChange={(e) => {
                      if (activeComponentIndex !== null && selected) {
                        let copySel = { ...selected }
                        let selComponent = copySel.components[activeComponentIndex]
                        let copyActive = { ...selComponent }
                        let val = e.target.valueAsNumber
                        if (selComponent && selComponent.properties.border) {
                          selComponent.properties.border.t = val
                        } else {
                          selComponent.properties.border = {
                            color: "#0d1f23",
                            r: 0, b: 0, l: 0, t: val
                          }
                        }
                        copySel.components[activeComponentIndex] = selComponent
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} type="number" className='h-10 w-10 border rounded-md text-center' />
                  </div>
                  <div className='mt-2'>Border Right</div>
                  <div className='flex items-center gap-2 px-2'>
                    <Slider
                      value={activeComponent?.properties?.border?.r}
                      min={0}
                      className='flex-1'
                      max={10}
                      step={1}
                      onChange={(val) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.r = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: val, b: 0, l: 0, t: 0
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }}
                    >
                      <SliderTrack className='h-1 rounded-2xl'>
                        <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                      </SliderTrack>
                      <SliderThumb style={{
                        backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                      }} className={`h-4 w-4`} />
                    </Slider>
                    <input value={activeComponent?.properties?.border?.r} onChange={(e) => {
                      if (activeComponentIndex !== null && selected) {
                        let copySel = { ...selected }
                        let selComponent = copySel.components[activeComponentIndex]
                        let copyActive = { ...selComponent }
                        let val = e.target.valueAsNumber
                        if (selComponent && selComponent.properties.border) {
                          selComponent.properties.border.r = val
                        } else {
                          selComponent.properties.border = {
                            color: "#0d1f23",
                            r: val, b: 0, l: 0, t: 0
                          }
                        }
                        copySel.components[activeComponentIndex] = selComponent
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} type="number" className='h-10 w-10 border rounded-md text-center' />
                  </div>
                  <div className='mt-2'>Border Bottom</div>
                  <div className='flex items-center gap-2 px-2'>
                    <Slider
                      value={activeComponent?.properties?.border?.b}
                      min={0}
                      className='flex-1'
                      max={10}
                      step={1}
                      onChange={(val) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.b = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: 0, b: val, l: 0, t: 0
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }}
                    >
                      <SliderTrack className='h-1 rounded-2xl'>
                        <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                      </SliderTrack>
                      <SliderThumb style={{
                        backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                      }} className={`h-4 w-4`} />
                    </Slider>
                    <input value={activeComponent?.properties?.border?.b} onChange={(e) => {
                      if (activeComponentIndex !== null && selected) {
                        let copySel = { ...selected }
                        let selComponent = copySel.components[activeComponentIndex]
                        let copyActive = { ...selComponent }
                        let val = e.target.valueAsNumber
                        if (selComponent && selComponent.properties.border) {
                          selComponent.properties.border.b = val
                        } else {
                          selComponent.properties.border = {
                            color: "#0d1f23",
                            r: 0, b: val, l: 0, t: 0
                          }
                        }
                        copySel.components[activeComponentIndex] = selComponent
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} type="number" className='h-10 w-10 border rounded-md text-center' />
                  </div>
                  <div className='mt-2'>Border Left</div>
                  <div className='flex items-center gap-2 px-2'>
                    <Slider
                      value={activeComponent?.properties?.border?.l}
                      min={0}
                      className='flex-1'
                      max={10}
                      step={1}
                      onChange={(val) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.l = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: 0, b: 0, l: val, t: 0
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }}
                    >
                      <SliderTrack className='h-1 rounded-2xl'>
                        <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                      </SliderTrack>
                      <SliderThumb style={{
                        backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                      }} className={`h-4 w-4`} />
                    </Slider>
                    <input value={activeComponent?.properties?.border?.l} onChange={(e) => {
                      if (activeComponentIndex !== null && selected) {
                        let copySel = { ...selected }
                        let selComponent = copySel.components[activeComponentIndex]
                        let copyActive = { ...selComponent }
                        let val = e.target.valueAsNumber
                        if (selComponent && selComponent.properties.border) {
                          selComponent.properties.border.l = val
                        } else {
                          selComponent.properties.border = {
                            color: "#0d1f23",
                            r: 0, b: 0, l: val, t: 0
                          }
                        }
                        copySel.components[activeComponentIndex] = selComponent
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }} type="number" className='h-10 w-10 border rounded-md text-center' />
                  </div>

                </div>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <div className='h-8 rounded-md w-36 items-center gap-2 ml-2 flex'>
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
            }} className={`h-8 cursor-pointer w-1/3 ${data.properties.text?.align === TextAlign.LEFT ? 'border bg-gray-200 border-gray-100' : 'hover:bg-gray-100'} rounded-md flex items-center justify-center`}>
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
            }} className={`h-8 cursor-pointer w-1/3 ${data.properties.text?.align === TextAlign.CENTER ? 'border bg-gray-200 border-gray-100' : 'hover:bg-gray-100'} rounded-md flex items-center justify-center`}>
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
            }} className={`h-8 cursor-pointer w-1/3 ${data.properties.text?.align === TextAlign.RIGHT ? 'border bg-gray-200 border-gray-100' : 'hover:bg-gray-100'} rounded-md flex items-center justify-center`}>
              <FiAlignRight />
            </div>
          </div>
        </>
        break

      case ComponentTypes.RECTANGLE:
      case ComponentTypes.SQUARE:
      case ComponentTypes.CIRCLE:
      case ComponentTypes.TRAPEZOID:
      case ComponentTypes.TRIANGLE:
      case ComponentTypes.IMAGE:
        component = <>
          {data.type !== ComponentTypes.IMAGE && <button style={{
            background: data.properties.color
          }} className={`ml-2 h-8 w-8 rounded-full`} onClick={() => {
            if (isColorSelectorOpen) {
              closeColorSelector()
            } else {
              openColorSelector()
            }
          }}>
          </button>}

          {[ComponentTypes.RECTANGLE, ComponentTypes.SQUARE, ComponentTypes.CIRCLE,].includes(data.type) && <>
            <Popover isOpen={isBorderEditorOpen}>
              <PopoverTrigger>
                <div onClick={() => {
                  if (isBorderEditorOpen) {
                    closeBorderEditor()
                  } else {
                    openBorderEditor()
                  }
                }} className={`px-3 ${isBorderEditorOpen ? 'bg-gray-200' : 'hover:bg-gray-100'} text-xs cursor-pointer flex items-center justify-center ml-2 rounded-lg h-8`}>
                  <BsBorderStyle className='text-lg font-semibold' />
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-64 p-0'>
                <PopoverBody className='w-64 overflow-y-scroll py-1 px-2.5'>
                  <div className='mt-2'>
                    <div className="flex justify-between items-center">
                      <div className='text-sm font-semibold'>Borders</div>
                      <button onClick={closeBorderEditor} className='h-8 w-8' >
                        <FiX />
                      </button>
                    </div>

                    <div className='mt-2'>Color</div>
                    {activeComponent && <div className='grid grid-cols-10 w-full gap-1'>
                      {[ComponentTypes.RECTANGLE, ComponentTypes.CIRCLE, ComponentTypes.SQUARE].includes(activeComponent.type) && defaultColors.map((color) => <button onClick={() => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.color = color
                          } else {
                            selComponent.properties.border = {
                              color,
                              r: 0, b: 0, l: 0, t: 0
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} style={{ backgroundColor: color }} key={color} className={`h-6 w-6 hover:border-2 border rounded-full ${activeComponent.properties?.border?.color === color && 'border-black border-2'}`}></button>)}
                    </div>}

                    <div className='mt-2'>Border Top</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.border?.t}
                        min={0}
                        className='flex-1'
                        max={10}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.border) {
                              selComponent.properties.border.t = val
                            } else {
                              selComponent.properties.border = {
                                color: "#0d1f23",
                                r: 0, b: 0, l: 0, t: val
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.border?.t} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.t = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: 0, b: 0, l: 0, t: val
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>
                    <div className='mt-2'>Border Right</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.border?.r}
                        min={0}
                        className='flex-1'
                        max={10}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.border) {
                              selComponent.properties.border.r = val
                            } else {
                              selComponent.properties.border = {
                                color: "#0d1f23",
                                r: val, b: 0, l: 0, t: 0
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.border?.r} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.r = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: val, b: 0, l: 0, t: 0
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>
                    <div className='mt-2'>Border Bottom</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.border?.b}
                        min={0}
                        className='flex-1'
                        max={10}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.border) {
                              selComponent.properties.border.b = val
                            } else {
                              selComponent.properties.border = {
                                color: "#0d1f23",
                                r: 0, b: val, l: 0, t: 0
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.border?.b} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.b = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: 0, b: val, l: 0, t: 0
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>
                    <div className='mt-2'>Border Left</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.border?.l}
                        min={0}
                        className='flex-1'
                        max={10}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.border) {
                              selComponent.properties.border.l = val
                            } else {
                              selComponent.properties.border = {
                                color: "#0d1f23",
                                r: 0, b: 0, l: val, t: 0
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: activeComponent?.properties?.border?.color || '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.border?.l} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.border) {
                            selComponent.properties.border.l = val
                          } else {
                            selComponent.properties.border = {
                              color: "#0d1f23",
                              r: 0, b: 0, l: val, t: 0
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>

                  </div>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>}

          {[ComponentTypes.RECTANGLE, ComponentTypes.SQUARE, ComponentTypes.IMAGE].includes(data.type) && <>
            <Popover isOpen={isRoundedOpen}>
              <PopoverTrigger>
                <div onClick={() => {
                  if (isRoundedOpen) {
                    closeRoundedEditor()
                  } else {
                    openRoundedEditor()
                  }
                }} className={`px-3 ${isRoundedOpen ? 'bg-gray-200' : 'hover:bg-gray-100'} text-xs cursor-pointer flex items-center justify-center ml-2 rounded-lg h-8`}>
                  <RxCornerTopLeft className='text-lg font-semibold' />
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-64 p-0'>
                <PopoverBody className='w-64 overflow-y-scroll py-1 px-2.5'>
                  <div className='mt-2'>
                    <div className="flex justify-between items-center">
                      <div className='text-sm font-semibold'>Corner Rounding</div>
                      <button onClick={closeRoundedEditor} className='h-8 w-8' >
                        <FiX />
                      </button>
                    </div>

                    <div className='mt-2'>Rounded Top Left</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.radius?.lt}
                        min={0}
                        className='flex-1'
                        max={30}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.radius) {
                              selComponent.properties.radius.lt = val
                            } else {
                              selComponent.properties.radius = {
                                rt: 0, rb: 0, lb: 0, lt: val
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.radius?.lt} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.radius) {
                            selComponent.properties.radius.lt = val
                          } else {
                            selComponent.properties.radius = {
                              rt: 0, rb: 0, lb: 0, lt: val
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>
                    <div className='mt-2'>Rounded Top Right</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.radius?.rt}
                        min={0}
                        className='flex-1'
                        max={30}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.radius) {
                              selComponent.properties.radius.rt = val
                            } else {
                              selComponent.properties.radius = {
                                lt: 0, rb: 0, lb: 0, rt: val
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.radius?.rt} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.radius) {
                            selComponent.properties.radius.rt = val
                          } else {
                            selComponent.properties.radius = {
                              lt: 0, rb: 0, lb: 0, rt: val
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>
                    <div className='mt-2'>Rounded Bottom Right</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.radius?.rb}
                        min={0}
                        className='flex-1'
                        max={30}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.radius) {
                              selComponent.properties.radius.rb = val
                            } else {
                              selComponent.properties.radius = {
                                rt: 0, lt: 0, lb: 0, rb: val
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.radius?.rb} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.radius) {
                            selComponent.properties.radius.rb = val
                          } else {
                            selComponent.properties.radius = {
                              rt: 0, lt: 0, lb: 0, rb: val
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>
                    <div className='mt-2'>Rounded Bottom Left</div>
                    <div className='flex items-center gap-2 px-2'>
                      <Slider
                        value={activeComponent?.properties?.radius?.lb}
                        min={0}
                        className='flex-1'
                        max={30}
                        step={1}
                        onChange={(val) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            if (selComponent && selComponent.properties.radius) {
                              selComponent.properties.radius.lb = val
                            } else {
                              selComponent.properties.radius = {
                                rt: 0, rb: 0, lt: 0, lb: val
                              }
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }}
                      >
                        <SliderTrack className='h-1 rounded-2xl'>
                          <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                        </SliderTrack>
                        <SliderThumb style={{
                          backgroundColor: '#0d1f23'
                        }} className={`h-4 w-4`} />
                      </Slider>
                      <input value={activeComponent?.properties?.radius?.lb} onChange={(e) => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          let val = e.target.valueAsNumber
                          if (selComponent && selComponent.properties.radius) {
                            selComponent.properties.radius.lb = val
                          } else {
                            selComponent.properties.radius = {
                              rt: 0, rb: 0, lt: 0, lb: val
                            }
                          }
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }} type="number" className='h-10 w-10 border rounded-md text-center' />
                    </div>

                  </div>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>}

          {[ComponentTypes.CIRCLE, ComponentTypes.SQUARE, ComponentTypes.RECTANGLE, ComponentTypes.TRAPEZOID, ComponentTypes.TRIANGLE, ComponentTypes.IMAGE].includes(data.type) && <>
            <Popover isOpen={isSizeEditorOpen}>
              <PopoverTrigger>
                <div onClick={() => {
                  if (isRoundedOpen) {
                    closeSizeEditor()
                  } else {
                    openSizeEditor()
                  }
                }} className={`px-3 ${isSizeEditorOpen ? 'bg-gray-200' : 'hover:bg-gray-100'} text-xs cursor-pointer flex items-center justify-center ml-2 rounded-lg h-8`}>
                  <IoResize className='text-lg font-semibold' />
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-64 p-0'>
                <PopoverBody className='w-64 overflow-y-scroll py-1 px-2.5'>
                  <div className='mt-2'>
                    <div className="flex justify-between items-center">
                      <div className='text-sm font-semibold'>Box Sizing</div>
                      <button onClick={closeSizeEditor} className='h-8 w-8' >
                        <FiX />
                      </button>
                    </div>

                    {data.type === ComponentTypes.CIRCLE && <>
                      <div className='mt-2'>Diameter</div>
                      <div className='flex items-center gap-2 px-2'>
                        <Slider
                          value={activeComponent?.properties?.size}
                          min={0}
                          className='flex-1'
                          max={400}
                          step={1}
                          onChange={(val) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              if (selComponent && selComponent.properties.size) {
                                selComponent.properties.size = val
                              } else {
                                selComponent.properties.size = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }}
                        >
                          <SliderTrack className='h-1 rounded-2xl'>
                            <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                          </SliderTrack>
                          <SliderThumb style={{
                            backgroundColor: '#0d1f23'
                          }} className={`h-4 w-4`} />
                        </Slider>
                        <input value={activeComponent?.properties?.size} onChange={(e) => {
                          if (activeComponentIndex !== null && selected) {
                            let copySel = { ...selected }
                            let selComponent = copySel.components[activeComponentIndex]
                            let copyActive = { ...selComponent }
                            let val = e.target.valueAsNumber
                            if (selComponent && selComponent.properties.size) {
                              selComponent.properties.size = val
                            } else {
                              selComponent.properties.size = val
                            }
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }} type="number" className='h-10 w-10 border rounded-md text-center' />
                      </div>
                    </>}

                    {data.type === ComponentTypes.SQUARE && <>
                      <div className='mt-2'>Size</div>
                      <div className='flex items-center gap-2 px-2'>
                        <Slider
                          value={activeComponent?.properties?.height === "auto" ? 0 : activeComponent?.properties?.height}
                          min={0}
                          className='flex-1'
                          max={400}
                          step={1}
                          onChange={(val) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.height = val
                                selComponent.properties.width = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }}
                        >
                          <SliderTrack className='h-1 rounded-2xl'>
                            <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                          </SliderTrack>
                          <SliderThumb style={{
                            backgroundColor: '#0d1f23'
                          }} className={`h-4 w-4`} />
                        </Slider>
                        <input
                          value={activeComponent?.properties?.height === "auto" ? 0 : activeComponent?.properties?.height}
                          onChange={(e) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              let val = e.target.valueAsNumber
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.height = val
                                selComponent.properties.width = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }} type="number" className='h-10 w-10 border rounded-md text-center' />
                      </div>
                    </>}


                    {(data.type === ComponentTypes.RECTANGLE || data.type === ComponentTypes.IMAGE) && <>
                      <div className='mt-2'>Height</div>
                      <div className='flex items-center gap-2 px-2'>
                        <Slider
                          value={activeComponent?.properties?.height === "auto" ? 0 : activeComponent?.properties?.height}
                          min={0}
                          className='flex-1'
                          max={600}
                          step={1}
                          onChange={(val) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.height = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }}
                        >
                          <SliderTrack className='h-1 rounded-2xl'>
                            <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                          </SliderTrack>
                          <SliderThumb style={{
                            backgroundColor: '#0d1f23'
                          }} className={`h-4 w-4`} />
                        </Slider>
                        <input
                          value={activeComponent?.properties?.height === "auto" ? 0 : activeComponent?.properties?.height}
                          onChange={(e) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              let val = e.target.valueAsNumber
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.height = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }} type="number" className='h-10 w-10 border rounded-md text-center' />
                      </div>
                    </>}


                    {(data.type === ComponentTypes.RECTANGLE || data.type === ComponentTypes.IMAGE) && <>
                      <div className='mt-2'>Width</div>
                      <div className='flex items-center gap-2 px-2'>
                        <Slider
                          value={activeComponent?.properties?.width === "auto" ? 0 : activeComponent?.properties?.width}
                          min={0}
                          className='flex-1'
                          max={850}
                          step={1}
                          onChange={(val) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.width = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }}
                        >
                          <SliderTrack className='h-1 rounded-2xl'>
                            <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                          </SliderTrack>
                          <SliderThumb style={{
                            backgroundColor: '#0d1f23'
                          }} className={`h-4 w-4`} />
                        </Slider>
                        <input
                          value={activeComponent?.properties?.width === "auto" ? 0 : activeComponent?.properties?.width}
                          onChange={(e) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              let val = e.target.valueAsNumber
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.width = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }} type="number" className='h-10 w-10 border rounded-md text-center' />
                      </div>
                    </>}

                    {(data.type === ComponentTypes.TRAPEZOID || data.type === ComponentTypes.TRIANGLE) && <>

                      <div className='mt-2'>Height</div>
                      <div className='flex items-center gap-2 px-2'>
                        <Slider
                          value={activeComponent?.properties?.bottomSize}
                          min={0}
                          className='flex-1'
                          max={850}
                          step={1}
                          onChange={(val) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.bottomSize = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }}
                        >
                          <SliderTrack className='h-1 rounded-2xl'>
                            <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                          </SliderTrack>
                          <SliderThumb style={{
                            backgroundColor: '#0d1f23'
                          }} className={`h-4 w-4`} />
                        </Slider>
                        <input
                          value={activeComponent?.properties?.bottomSize}
                          onChange={(e) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              let val = e.target.valueAsNumber
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.bottomSize = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }} type="number" className='h-10 w-10 border rounded-md text-center' />
                      </div>
                      {data.type === ComponentTypes.TRAPEZOID && <>
                        <div className='mt-2'>Width</div>
                        <div className='flex items-center gap-2 px-2'>
                          <Slider
                            value={activeComponent?.properties?.width === "auto" ? 0 : activeComponent?.properties?.width}
                            min={0}
                            className='flex-1'
                            max={850}
                            step={1}
                            onChange={(val) => {
                              if (activeComponentIndex !== null && selected) {
                                let copySel = { ...selected }
                                let selComponent = copySel.components[activeComponentIndex]
                                let copyActive = { ...selComponent }
                                if (selComponent && selComponent.properties) {
                                  selComponent.properties.width = val
                                }
                                copySel.components[activeComponentIndex] = selComponent
                                setSelected(copySel)
                                setActiveComponent(copyActive)
                              }
                            }}
                          >
                            <SliderTrack className='h-1 rounded-2xl'>
                              <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                            </SliderTrack>
                            <SliderThumb style={{
                              backgroundColor: '#0d1f23'
                            }} className={`h-4 w-4`} />
                          </Slider>
                          <input
                            value={activeComponent?.properties?.width === "auto" ? 0 : activeComponent?.properties?.width}
                            onChange={(e) => {
                              if (activeComponentIndex !== null && selected) {
                                let copySel = { ...selected }
                                let selComponent = copySel.components[activeComponentIndex]
                                let copyActive = { ...selComponent }
                                let val = e.target.valueAsNumber
                                if (selComponent && selComponent.properties) {
                                  selComponent.properties.width = val
                                }
                                copySel.components[activeComponentIndex] = selComponent
                                setSelected(copySel)
                                setActiveComponent(copyActive)
                              }
                            }} type="number" className='h-10 w-10 border rounded-md text-center' />
                        </div>
                      </>}

                      <div className='mt-2'>Left Angle</div>
                      <div className='flex items-center gap-2 px-2'>
                        <Slider
                          value={activeComponent?.properties?.leftSize}
                          min={1}
                          className='flex-1'
                          max={850}
                          step={1}
                          onChange={(val) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.leftSize = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }}
                        >
                          <SliderTrack className='h-1 rounded-2xl'>
                            <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                          </SliderTrack>
                          <SliderThumb style={{
                            backgroundColor: '#0d1f23'
                          }} className={`h-4 w-4`} />
                        </Slider>
                        <input
                          value={activeComponent?.properties?.leftSize}
                          min={1}
                          onChange={(e) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              let val = e.target.valueAsNumber
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.leftSize = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }} type="number" className='h-10 w-10 border rounded-md text-center' />
                      </div>


                      <div className='mt-2'>Right Angle</div>
                      <div className='flex items-center gap-2 px-2'>
                        <Slider
                          value={activeComponent?.properties?.rightSize}
                          min={1}
                          className='flex-1'
                          max={850}
                          step={1}
                          onChange={(val) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.rightSize = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }}
                        >
                          <SliderTrack className='h-1 rounded-2xl'>
                            <SliderFilledTrack className={`bg-[#25A8E0] rounded-2xl`} />
                          </SliderTrack>
                          <SliderThumb style={{
                            backgroundColor: '#0d1f23'
                          }} className={`h-4 w-4`} />
                        </Slider>
                        <input
                          value={activeComponent?.properties?.rightSize}
                          onChange={(e) => {
                            if (activeComponentIndex !== null && selected) {
                              let copySel = { ...selected }
                              let selComponent = copySel.components[activeComponentIndex]
                              let copyActive = { ...selComponent }
                              let val = e.target.valueAsNumber
                              if (selComponent && selComponent.properties) {
                                selComponent.properties.rightSize = val
                              }
                              copySel.components[activeComponentIndex] = selComponent
                              setSelected(copySel)
                              setActiveComponent(copyActive)
                            }
                          }} type="number" min="1" className='h-10 w-10 border rounded-md text-center' />
                      </div>
                    </>}
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>}


        </>
        break
      default:
        break
    }
    return component
  }
  const basicTools = [
    {
      title: "Design",
      activeIcon: <MdSpaceDashboard className='text-lg' />,
      icon: <MdOutlineSpaceDashboard className='text-lg' />,
      value: "design"
    },
    {
      title: "Elements",
      icon: <PiShapes className='text-lg' />,
      activeIcon: <PiShapesFill className='text-lg' />,
      value: "elements"
    },
    {
      title: "Uploads",
      icon: <FaRegImage className='text-lg' />,
      activeIcon: <FaRegImage className='text-lg' />,
      value: "images"
    }
  ]

  return (
    <>
      <Head>
        {/* Set viewport settings specific to this page */}
        <meta
          name="viewport"
          content="width=1280, height=800, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <div className='flex w-full justify-between gap-2 h-full'>
        <div className={`w-[550px] border-r h-full py-0 flex gap-1 ${isColorSelectorOpen && 'bg-gray-200'}`}>
          <div className='w-24 h-full flex py-5 flex-col gap-5'>
            {basicTools.map(e =>
              <Tooltip placement='end' label={e.title}>
                <div onClick={() => setOpenSection(e.value)} className='flex flex-col cursor-pointer group h-14 items-center justify-center'>
                  <div className={`h-10 rounded-lg w-10 flex items-center justify-center ${openSection === e.value ? 'bg-primary-dark text-white' : 'group-hover:bg-primary-dark/85 group-hover:text-white'}`}>
                    {openSection === e.value ? e.activeIcon : e.icon}
                  </div>
                  <div className='text-xs font-medium mt-0.5'>{e.title}</div>
                </div>
              </Tooltip>
            )}
          </div>
          <div className="flex-1 relative">
            <div className={`w-full absolute top-0 left-0 h-full overflow-y-scroll pt-3`}>
              {openSection === 'design' && <div className='px-0 py-2 grid grid-cols-2 gap-3 pb-14'>
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
              </div>}

              {openSection === "elements" && <div className="grid grid-cols-3 gap-5">
                {defaultElements.filter(e => e.type !== ComponentTypes.IMAGE).map((element) => <div key={element.type} onClick={() => {
                  if (selectedElement && selectedElement.type === element.type) {
                    setSelectedElement(null)
                  } else {
                    setSelectedElement(structuredClone(element))
                  }
                }} className={`h-32 flex cursor-pointer justify-center items-center ${element.type === selectedElement?.type ? 'border-primary-dark border-2' : 'border'}`}>
                  {renderPickableComponent(element)}
                </div>)}
              </div>}

              {openSection === "images" && <div className="grid grid-cols-3 gap-5">
                {team?.certificateMedia?.map((media) => {
                  let items = structuredClone(defaultElements)
                  let item = items.find(e => e.type === ComponentTypes.IMAGE)
                  if (item) {
                    item.properties = {
                      ...item.properties,
                      url: media.url
                    }
                    return item
                  }
                  return false
                }).map((element, index) => {
                  if (element !== false) {
                    return <div key={element.properties.url} onClick={() => {
                      if (selectedElement && selectedElement.properties.url === element.properties.url) {
                        setSelectedElement(null)
                      } else {
                        setSelectedElement(structuredClone(element))
                      }
                    }} className={`h-32 flex cursor-pointer justify-center items-center ${element.properties.url === selectedElement?.properties.url ? 'border-primary-dark border-2' : 'border'}`}>
                      {renderPickableComponent(element)}
                    </div>
                  } else {
                    return <></>
                  }
                })}

                <div className={` h-32 flex cursor-pointer justify-center items-center`}>
                  <>
                    <input className='hidden' onChange={(e => {
                      if (e.target.files) {
                        handleMediaUpload(e.target.files[0])
                      }
                    })} type="file" id="add-certificate-media" />
                    <button onClick={() => {
                      let ele = document.getElementById('add-certificate-media')
                      if (ele) {
                        ele.click()
                      }
                    }} disabled={uploading} className='flex rounded-md h-7 text-xs bg-white items-center justify-center px-3'>
                      {uploading ? <Spinner /> : <FiPlus className='font-bold text-5xl' />}
                    </button>
                  </>
                </div>
              </div>}
            </div>
            {isColorSelectorOpen && <div className='absolute top-0 left-0 h-full w-full flex justify-center'>
              <div className={`h-full bg-white shadow-xl p-5 w-11/12 mt-5 border rounded-xl transform transition-all duration-300 ease-in-out ${isColorSelectorOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <div className="flex justify-between items-center">
                  <div className='text-sm font-semibold'>Colors</div>
                  <button onClick={closeColorSelector} className='h-8 w-8' >
                    <FiX />
                  </button>
                </div>
                {activeComponent && <div className='grid grid-cols-6 w-full mt-3 gap-2'>
                  {[ComponentTypes.TEXT, ComponentTypes.NAME, ComponentTypes.DATE, ComponentTypes.COURSE].includes(activeComponent.type) && defaultColors.map((color) => <button onClick={() => {
                    if (activeComponentIndex !== null && selected) {
                      let copySel = { ...selected }
                      let selComponent = copySel.components[activeComponentIndex]
                      let copyActive = { ...selComponent }
                      if (selComponent && selComponent.properties.text) {
                        selComponent.properties.text.color = color
                        copySel.components[activeComponentIndex] = selComponent
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }
                  }} style={{ backgroundColor: color }} key={color} className={`h-16 w-16 hover:border-4 border rounded-full`}></button>)}

                </div>}
                {activeComponent && [ComponentTypes.CIRCLE, ComponentTypes.BACKGROUND, ComponentTypes.TRIANGLE, ComponentTypes.TRAPEZOID, ComponentTypes.RECTANGLE, ComponentTypes.SQUARE].includes(activeComponent.type) && <>
                  <div className='font-semibold text-sm'>Default Colors</div>
                  <div className='grid grid-cols-6 w-full mt-3 gap-2'>
                    {defaultColors.map((color) => <button onClick={() => {
                      if (activeComponentIndex !== null && selected) {
                        let copySel = { ...selected }
                        let selComponent = copySel.components[activeComponentIndex]
                        let copyActive = { ...selComponent }
                        if (selComponent && selComponent.properties.color) {
                          selComponent.properties.color = color
                          copySel.components[activeComponentIndex] = selComponent
                          setSelected(copySel)
                          setActiveComponent(copyActive)
                        }
                      }
                    }} style={{ backgroundColor: color }} key={color} className={`h-16 w-16 hover:border-4 border rounded-full`}></button>)}
                  </div>
                  {![ComponentTypes.TRIANGLE, ComponentTypes.TRAPEZOID].includes(activeComponent.type) && <>
                    <div className='font-semibold mt-10 text-sm'>Default Gradients</div>
                    <div className='grid grid-cols-6 w-full mt-3 gap-2'>
                      {defaultGradients.map((color) => <button onClick={() => {
                        if (activeComponentIndex !== null && selected) {
                          let copySel = { ...selected }
                          let selComponent = copySel.components[activeComponentIndex]
                          let copyActive = { ...selComponent }
                          if (selComponent && selComponent.properties.color) {
                            selComponent.properties.color = `linear-gradient(to right, ${color[0]}, ${color[1]})`
                            copySel.components[activeComponentIndex] = selComponent
                            setSelected(copySel)
                            setActiveComponent(copyActive)
                          }
                        }
                      }} style={{ background: `linear-gradient(to right, ${color[0]}, ${color[1]})` }} key={color.join()} className={`h-16 w-16 hover:border-4 border rounded-full`}>
                      </button>)}
                    </div>
                  </>}

                </>}
              </div>
            </div>}


            {isFontFamilySelectorOpen && <div className='absolute top-0 left-0 h-full w-full flex justify-center'>
              <div className={`h-full bg-white shadow-xl p-5 w-11/12 mt-5 border rounded-xl transform transition-all duration-300 ease-in-out ${isFontFamilySelectorOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <div className="flex justify-between items-center">
                  <div className='text-sm font-semibold'>Fonts</div>
                  <button onClick={closeFontFamilySelector} className='h-8 w-8' >
                    <FiX />
                  </button>
                </div>
                {activeComponent && <div className='flex flex-col gap-1 mt-3'>
                  {defaultFonts.map((font) => <div onClick={() => {
                    if (activeComponentIndex !== null && selected && activeComponent) {
                      let copySel = { ...selected }
                      let copyActive = { ...activeComponent }
                      let selComponent = copySel.components[activeComponentIndex]
                      if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                        selComponent.properties.text.family = font.title
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }
                  }} style={{ fontFamily: font.font.style.fontFamily }} className='h-8 cursor-pointer hover:bg-gray-100 px-4 rounded-md flex justify-between items-center'>
                    <div>{font.title}</div>
                    <div>{activeComponent?.properties?.text?.family === font.title && <FiCheck />}</div>
                  </div>)}
                </div>}
              </div>
            </div>}

            {isTextEditorOpen && <div className='absolute top-0 left-0 h-full w-full flex justify-center'>
              <div className={`h-52 bg-white shadow-xl p-5 w-11/12 mt-5 border rounded-xl transform transition-all duration-300 ease-in-out ${isTextEditorOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <div className="flex justify-between items-center">
                  <div className='text-sm font-semibold'>Text content</div>
                  <button onClick={closeTextEditor} className='h-8 w-8' >
                    <FiX />
                  </button>
                </div>
                <div className='flex flex-col gap-1 mt-3'>
                  <input value={activeComponent?.properties?.text?.value} onChange={(e) => {
                    if (activeComponentIndex !== null && selected && activeComponent) {
                      let copySel = { ...selected }
                      let copyActive = { ...activeComponent }
                      let selComponent = copySel.components[activeComponentIndex]
                      if (selComponent && selComponent.properties.text && copyActive.properties.text) {
                        selComponent.properties.text.value = e.target.value
                        setSelected(copySel)
                        setActiveComponent(copyActive)
                      }
                    }
                  }} className='h-8 cursor-pointer hover:bg-gray-100 px-4 border rounded-md flex justify-between items-center' />
                </div>
              </div>
            </div>}
          </div>

        </div>
        <div className='w-[1000px] px-10 gap-6 h-full flex flex-col justify-start items-center overflow-y-scroll'>
          <div className=''></div>
          <div className="h-10 w-full flex justify-center">
            {selected && <div className='h-10 w-auto flex justify-start items-center border px-1 gap-0 bg-white shadow-xl rounded-2xl'>
              {activeComponent && renderElementProperties(activeComponent, selected)}

              <button disabled={updatePending} className='text-primary-dark px-3 h-8 rounded-l-2xl rounded-r-md flex hover:bg-gray-100 items-center gap-2' id="save-button" onClick={() => _updateCertificate({
                payload: {
                  components: selected,
                  name: certificateInfo?.name
                }, id
              })}>
                {updatePending ? <Spinner size={'sm'} /> : <FiSave />}
              </button>

              {activeComponent && <button className='text-primary-dark px-3 h-8 rounded-l-md rounded-r-md flex hover:bg-gray-100 items-center gap-2' id="delete-button" onClick={() => tempDataRef.current && handleDeleteElement(tempDataRef.current)}>
                <FiTrash2 />
              </button>}

              {certificateInfo && <PreviewCertificateButton template={!certificateInfo?.components || certificateInfo?.components.components.length === 0} id={certificateInfo.id} />}
            </div>}
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
            <div className='h-[600px] w-[900px] relative select-none'>

              {selected.bg === "plain" ? <div style={{
                background: selected.components[0].properties.color
              }} className='absolute border top-0 left-0 h-full w-[900px] rounded-2xl'></div> : <img className='absolute top-0 left-0 h-full w-[900px] rounded-md' src={selected.bg} />}
              {showGrid && <>
                <div className='absolute top-0 left-0 h-full w-[900px] grid-lines' style={{
                  backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), 
                            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                }} />
                <div className='absolute top-0 left-0 h-full w-[900px] bg-black/30' />
              </>}
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
                    let sloop = comp.properties && comp.properties.text && comp.properties.text.family === "Sloop"
                    let pos = adjustForDPI({
                      x: comp.position.x || 100,
                      y: comp.position.y || 100,
                    }, sloop)
                    console.log(pos, comp.position, sloop)
                    if (comp.type === ComponentTypes.BACKGROUND) {
                      return <div key={`${comp.type}_${index}`} />
                    } else {
                      return <>
                        <Draggable
                          key={`${comp.type}_${index}`}
                          bounds="parent"
                          axis="both"
                          defaultPosition={{ x: 0, y: 0 }}
                          position={pos}
                          scale={1}
                          onDrag={(e, d) => {
                            let copySel = { ...selected }
                            let old = copySel.components[index].position
                            if (d.x > 0) {
                              old.x = d.x
                            }
                            if (d.y > 0) {
                              let y = d.y
                              if (sloop) {
                                let dpiScale = Number((window.devicePixelRatio || 1).toFixed(1))
                                let factor = 0
                                if (dpiScale === 1.0) {
                                  factor = -24
                                } else if (dpiScale === 1.2) {
                                  factor = 15
                                } else if (dpiScale === 1.5) {
                                  factor = 8
                                }
                                y = d.y - factor
                              }
                              old.y = y
                            }
                            copySel.components[index].position = old
                            setSelected(copySel)
                            handleSave()
                          }}
                          onStop={() => {
                            console.log("drag end")
                            setShowGrid(false)
                          }}
                          onStart={() => {
                            console.log("drag start")
                            setShowGrid(true)
                          }}
                          onMouseDown={(e) => {
                            setActiveComponent(comp)
                            setActiveComponentIndex(index)
                            e.stopPropagation()
                          }}
                        >
                          <div className={`absolute ${activeComponent && activeComponentIndex === index ? 'ring-2 ring-primary-dark' : ''}`}>
                            {renderComponent(comp)}
                          </div>
                        </Draggable>
                        {/* <Rnd
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
                          handleSave()

                        }}
                        onDragStop={() => {
                          console.log("drag end")
                          setShowGrid(false)
                        }}
                        onDragStart={() => {
                          console.log("drag start")
                          setShowGrid(true)
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
                      </Rnd> */}
                      </>
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

    </>
  )
}
