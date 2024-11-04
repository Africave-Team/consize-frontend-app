import { updateMyTeamInfo } from '@/services/teams'
import uploadFile from '@/services/upload.service'
import { useAuthStore } from '@/store/auth.store'
import { CertificateMediaTypes } from '@/type-definitions/auth'
import { queryClient } from '@/utils/react-query'
import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { FiCloud, FiPlus } from 'react-icons/fi'

export default function MediaSelectorCertificate ({ type, onSelect }: { type: CertificateMediaTypes, onSelect: (url: string) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selected, setSelected] = useState("")
  const [uploading, setUploading] = useState(false)
  const { team, setTeam } = useAuthStore()
  const { mutateAsync: _updateTeamBackgrounds } = useMutation({
    mutationFn: (load: { payload: { certificateMedia: { url: string, type: CertificateMediaTypes }[] } }) => {
      return updateMyTeamInfo(load.payload)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    }
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
        let urls = [...(team?.certificateMedia || [])]
        urls.push({
          type,
          url: data
        })
        const res = await _updateTeamBackgrounds({ payload: { certificateMedia: urls } })
        setTeam(res.data)
      }
      setUploading(false)
    }
  }
  return (
    <>
      <button onClick={onOpen} className='h-8 absolute bg-white top-0 right-0 w-8 flex justify-center items-center'>
        <FiCloud />
      </button>


      {isOpen && <Modal isCentered isOpen={isOpen} size={{ md: '3xl', base: 'full' }} onClose={() => {
        onClose()
      }}>
        <ModalOverlay />
        <ModalContent className='h-[560px]'>
          <ModalBody className='h-[560px]'>
            <div className='w-full font-semibold h-10 flex items-center justify-between text-xl'>
              <div>
                Select Image
              </div>
              <div>
                <button onClick={() => {
                  let ele = document.getElementById('add-certificate-media')
                  if (ele) {
                    ele.click()
                  }
                }} className='h-10 px-4 flex text-sm bg-primary-dark text-white rounded-md items-center justify-center gap-2'>

                  {uploading ? <Spinner /> : <>
                    <FiPlus />
                    New image
                  </>}
                </button>
                <input className='hidden' accept='image/*' onChange={(e => {
                  if (e.target.files) {
                    handleBgUpload(e.target.files[0])
                  }
                })} type="file" id="add-certificate-media" />
              </div>
            </div>
            <div className='h-[460px] overflow-y-auto grid py-5 grid-cols-4 gap-x-5 gap-y-0'>
              {team?.certificateMedia?.filter(e => e.type === type).map((item) => <div key={item.url} onClick={() => setSelected(item.url)} className={`h-40 border flex rounded-md justify-center items-center ${item.url === selected && 'border-primary-dark border-2'}`}>
                <img src={item.url} className='h-32' />
              </div>)}
            </div>
            <div className='w-full font-semibold h-10 flex items-center justify-between text-xl'>
              <div>

              </div>
              <div>
                <button onClick={() => {
                  onSelect(selected)
                  onClose()
                }} disabled={!selected || selected.length === 0} className='h-10 rounded-md bg-primary-dark disabled:bg-primary-dark/30 text-white px-5 text-sm'>Select</button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>}
    </>
  )
}
