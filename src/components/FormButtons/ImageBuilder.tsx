import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  Select,
  Tooltip,
  Input,
} from '@chakra-ui/react'
import html2canvas from 'html2canvas'
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import uploadFile from '@/services/upload.service'
interface Props {
  imageText: string
  onFileUploaded: (url: string) => void
  label?: string
  title?: string
}
export default function ImageBuilder ({ onFileUploaded, label = "Build image", title = "Build your course header image", imageText }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [bgImageUrls] = useState<{ url: string; name: string }[]>([
    {
      name: "Spiral lines I",
      url: 'default-bg-spiral-1'
    },
    {
      name: "Spiral lines II",
      url: 'default-bg-spiral-2'
    },
    {
      name: "Spiral lines III",
      url: 'default-bg-spiral-3'
    }
  ])
  const [data, setData] = useState({
    bgColor: "black",
    bgImage: "",
    bgPattern: "default-bg-spiral-3"
  })
  function getContrastColor (hexColor: string) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Choose white or black based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  const saveBuiltImage = async function () {
    const divToCapture = document.getElementById('customHeaderImage')

    if (divToCapture) {
      const formData = new FormData()
      // get file url
      const canvas = await html2canvas(divToCapture, {
        scale: 5
      })

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], imageText.toLowerCase() + '-header-image.jpeg', { type: 'image/jpeg' })
          formData.append("file", file)
          const { data } = await uploadFile(formData)
          debugger
          if (data) {
            onFileUploaded(data)
            onClose()
          }
        }
      })

    } else {
      throw new Error("No template image selected.")
    }
  }
  return (
    <div>
      <button disabled={imageText.length === 0} onClick={() => onOpen()} type='button' className='text-sm w-32 h-10  px-3 border text-white disabled:bg-[#0D1F23]/60 bg-[#0D1F23] rounded-none'>{label}</button>

      {isOpen && <Drawer
        isOpen={isOpen}
        placement='bottom'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent className='h-[80%]'>
          <DrawerCloseButton />
          <DrawerBody>
            <h2 className='font-bold text-lg'>
              {title}
            </h2>
            <p className='text-sm'>Provide the following details so we can invite your team members</p>

            <div className='w-full h-[450px] mt-2 flex gap-2'>
              <div className='w-3/12 h-full flex flex-col gap-2'>
                <div className='w-full'>
                  <Tooltip label="Select background pattern">
                    <Select onChange={(e) => {
                      setData((dt) => ({ ...dt, bgPattern: e.target.value }))
                    }} size={'md'} className='rounded-md' value={data.bgPattern}>
                      {bgImageUrls.map((item, key) => {
                        return <option key={`pattern_${key}`} value={item.url}>{item.name}</option>
                      })}
                    </Select>
                  </Tooltip>
                </div>
                <div className='w-full'>
                  <Tooltip label="Select background color">
                    <Input type='color' className='w-full rounded-md' value={data.bgColor} onChange={(e) => setData((dt) => ({ ...dt, bgColor: e.target.value }))} size={'md'} />
                  </Tooltip>
                </div>
              </div>
              <div className='w-9/12 h-full'>
                <div id="customHeaderImage" style={{ backgroundColor: data.bgColor }} className={`h-full w-full flex justify-start items-start p-4 border rounded-none ${data.bgPattern} bg-cover`}>
                  <div style={{ color: getContrastColor(data.bgColor) }} className='w-2/3 mt-5'>
                    <h3 className='font-bold text-3xl'>{imageText}</h3>
                  </div>
                </div>
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className='gap-5'>
            <button onClick={onClose}>
              Cancel
            </button>
            <button onClick={saveBuiltImage} className='bg-[#0D1F23] h-11 w-auto px-8 text-white' >Save</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>}
    </div>
  )
}
