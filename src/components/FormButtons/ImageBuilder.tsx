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
  Spinner,
} from '@chakra-ui/react'
import html2canvas from 'html2canvas'
import { toPng } from "html-to-image"
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import uploadFile from '@/services/upload.service'
import CustomHeaderImage from '../CustomHeaderImage'
import { useAuthStore } from '@/store/auth.store'
interface Props {
  imageText: string
  onFileUploaded: (url: string) => void
  label?: string
  title?: string
  description?: string
}
export default function ImageBuilder ({ onFileUploaded, label = "Build image", title = "Build your course header image", imageText, description }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [progress, setProgress] = useState(false)
  const { team } = useAuthStore()
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

  const saveBuiltImage = async function () {
    const divToCapture = document.getElementById('customHeaderImage')

    if (divToCapture) {
      const formData = new FormData()
      // get file url
      setProgress(true)
      const data = await toPng(divToCapture)
      const blob = await (await fetch(data)).blob()
      let timestamp = new Date().getTime()
      const file = new File([blob], timestamp + '-header-image.png', { type: 'image/png' })
      formData.append("file", file)
      const { data: uploadData } = await uploadFile(formData)
      if (uploadData) {
        onFileUploaded(uploadData)
        onClose()
      }
      setProgress(false)
    } else {
      throw new Error("No template image selected.")
    }
  }
  return (
    <div>
      <button disabled={imageText.length === 0} onClick={() => onOpen()} type='button' className='text-sm w-36 h-10 mb-2 px-3 border text-white disabled:bg-[#0D1F23]/60 bg-[#0D1F23] rounded-lg'>{label}</button>

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
              <div className='w-8/12 h-full'>
                <CustomHeaderImage teamName={team?.name} description={description} bgPattern={data.bgPattern} imageText={imageText} bgColor={data.bgColor} />
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className='gap-5'>
            <button onClick={onClose}>
              Cancel
            </button>
            <button disabled={progress} onClick={saveBuiltImage} className='bg-[#0D1F23] disabled:bg-[#0D1F23]/80 h-11 w-auto px-8 flex items-center gap-2 text-white' >Save
              {progress && <Spinner size={'sm'} />}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>}
    </div>
  )
}
