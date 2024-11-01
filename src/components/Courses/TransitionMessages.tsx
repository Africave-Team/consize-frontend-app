import { fetchCourseTransitionMessages } from '@/services/secure.courses.service'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import { stripHtmlTags } from '@/utils/string-formatters'
import he from "he"
import { MessageVariable, TransitionMessages } from '@/type-definitions/transitionMessages'
import {
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { FiArrowRight, FiChevronLeft, FiPlus } from 'react-icons/fi'
// import { useFormik } from 'formik'


interface ApiResponse {
  defaultTransitionMessages: { [type: string]: { variables: MessageVariable[], description: string, content: string } }
  customTransitionMessages: TransitionMessages[]
  message: string
}

export default function TransitionMessagesComponent ({ id }: { id: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [current, setCurrent] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<TransitionMessages | null>(null)
  const loadData = async function (payload: { course: string }) {
    const data = await fetchCourseTransitionMessages(payload.course)
    return data
  }
  const { data, isFetching } =
    useQuery<ApiResponse>({
      queryKey: ['transition-messages', id],
      enabled: isOpen,
      queryFn: () => loadData({ course: id })
    })
  useEffect(() => {
    if (current && data) {
      let item = data.customTransitionMessages.find(e => e.type === current)
      let content = item ? item.message : data?.defaultTransitionMessages[current].content
      setSelectedMessage({
        course: id,
        message: content,
        type: current
      })
    }
  }, [current, data])
  return (
    <div>
      <button onClick={() => onOpen()} className={`h-16 bg-white w-full text-primary-dark flex items-center border px-3 gap-2 font-semibold`}>
        Transition messages <FiArrowRight />
      </button>

      {isOpen && <Drawer
        isOpen={isOpen}
        placement='right'
        size={'fullscreen'}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className='flex p-0 items-center gap-1'>
            <button onClick={onClose} className='flex focus-visible:!outline-none text-base justify-center items-center h-12 px-4'>
              <FiChevronLeft className='text-2xl' /> Back
            </button>
            <div className='font-semibold text-lg'>
              Transition Messages
            </div>
          </DrawerHeader>
          <DrawerBody className='flex justify-start'>
            {data && <>
              <div className='w-96 h-full overflow-y-auto'>
                <div className='flex flex-col gap-3'>

                  {Object.entries(data.defaultTransitionMessages).map(([title, data]) => <button onClick={() => setCurrent(title)} key={title} className={`h-16 w-full ${title === current ? 'bg-primary-dark text-white shadow-lg' : 'bg-white text-primary-dark'} flex items-center justify-between border px-3 gap-2 font-semibold`}>
                    {title} <FiArrowRight />
                  </button>)}
                </div>
              </div>
              {current && selectedMessage && <div className='w-1/2 h-full px-3 overflow-y-auto'>
                <div className='h-12 w-full flex gap-3 justify-between items-center px-5'>
                  <div className='font-semibold text-lg'>{current}</div>
                  <div>
                    {data.defaultTransitionMessages[current].content !== selectedMessage.message && <button className='h-12 bg-primary-dark text-white font-medium px-3'>Revert to default</button>}
                  </div>
                </div>

                <div className='px-5'>
                  <Editor
                    value={selectedMessage.message}
                    toolbar={false}
                    init={{
                      menubar: false,
                      toolbar: false,
                      height: 200,
                      license_key: "gpl",
                      setup: function (editor) {
                        // Replace variables like [[CourseTitle]] with noneditable spans
                        editor.on('init', function () {
                          const content = editor.getContent()
                          const updatedContent = content.replace(/\[\[([a-zA-Z0-9_]+)\]\]/g, '<span class="noneditable">[[ $1 ]]</span>')
                          editor.setContent(updatedContent)
                        })

                        // editor.on('mousedown', function (e) {
                        //   const target = e.target
                        //   if (target.classList.contains('noneditable')) {
                        //     e.preventDefault() // Prevent default cursor behavior inside noneditable span
                        //     editor.selection.select(target, false) // Move selection outside the noneditable element
                        //   }
                        // })

                        // // Handle pasting to keep variables non-editable
                        // editor.on('BeforeSetContent', function (e) {
                        //   e.content = e.content.replace(/\[\[([a-zA-Z0-9_]+)\]\]/g,
                        //     '<span class="noneditable" contenteditable="false">[[ $1 ]]</span>')
                        // })

                        editor.on('keyup', function (e) {
                          // Get current content length
                          if (e.key == 'Backspace' || e.key == 'Delete') {
                            debugger
                            const selection = editor.selection
                            const node = selection.getNode() // Get the current node where the cursor is

                            // Check if the current node or its parent is a noneditable span
                            const isNonEditableSpan = node.classList.contains('noneditable')

                            if (isNonEditableSpan) {
                              // Get the noneditable span (either the node itself or its parent)
                              const spanNode = node

                              // Remove the entire span element
                              if (spanNode) {
                                spanNode.remove()
                              }

                              // Prevent further event handling (like deleting individual characters)
                              e.preventDefault()
                              e.stopPropagation()
                              return false
                            }
                          }
                          return true
                        })
                      },
                      content_style: `
                      .noneditable { background-color: #f0f0f0; padding: 0 3px; border-radius: 3px; } 
                      body {
                        font-size: 15px;
                      }
                      ` // Optional styling
                    }}
                  />
                </div>
              </div>}
              {current && <div className='flex-1 h-full px-3 overflow-y-auto'>
                <div className='h-12 w-full flex gap-3 justify-between items-center px-5'>
                  <div className='font-semibold text-lg'>Variables</div>
                  <div>

                  </div>
                </div>
              </div>}
            </>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>}
    </div>
  )
}
