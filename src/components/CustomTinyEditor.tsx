import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import { Spinner, Tooltip } from '@chakra-ui/react'
import { stripHtmlTags } from '@/utils/string-formatters'
import he from "he"


interface TinyMCEEditorProps {
  field: string
  value: string
  placeholder: string
  maxLength: number,
  aiOptionButtons?: string[]
  onChange: (plain: string) => void
  aiProgress?: boolean
}

const CustomTinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ aiOptionButtons = [], value, field, onChange, placeholder, maxLength, aiProgress }) => {
  const [count, setCount] = useState<number>(0)
  const [sentences, setSentences] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)
  const [currentAIAction, setCurrentAIAction] = useState<string | null>(null)
  const [editorRef, setEditorRef] = useState<TinyMCEEditor | null>(null)

  useEffect(() => {
    // Function to be executed after the component has mounted

    const checkIsMobile = () => {
      const userAgent = navigator.userAgent
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent)
      setIsMobile(isMobileDevice)
      console.log(userAgent, isMobileDevice)

    }

    // Initial check when the component mounts
    checkIsMobile()

    // Event listener for window resize to update isMobile state
    const handleResize = () => {
      checkIsMobile()
    }

    // Attach the event listener
    window.addEventListener('resize', handleResize)

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }

  }, [])



  // const getButtonContent = (type: OptionButtons) => {
  //   if (type === 'aiimprove') {
  //     return isMobile ? 'AI Improve' : 'Improve with AI'
  //   } else {
  //     return isMobile ? 'AI Generate' : 'Generate with AI'
  //   }
  // }
  // const getButtonTooltip = (type: OptionButtons) => {
  //   if (type === 'aiimprove') {
  //     return "Improve content with AI"
  //   } else {
  //     return "Generate content with AI"
  //   }
  // }

  const getToolbarButtons = () => {
    // Return the generated toolbar string
    return `bold italic emoticons numlist bullist`
  }

  return (
    <div className=''>
      <div className=''>
        <div className='relative w-full'>
          <div className='h-36 relative'>
            <div className='h-full absolute w-full flex justify-center items-center'>
              <Spinner size={'xs'} />
            </div>
            <Editor
              onInit={(evt, editor) => {
                setEditorRef(editor)
              }}
              onEditorChange={(newVal, editor) => {
                onChange(he.decode(newVal))
                setCount(editor.getContent({ format: 'text' }).trim().length)
                const sentences = editor.getContent({ format: 'text' }).split(/[.!?]+/)
                const filteredSentences = sentences.filter(sentence => sentence.trim() !== '')
                setSentences(filteredSentences.length)
              }}

              init={{
                placeholder,
                menubar: '',
                height: 150,
                plugins: 'emoticons lists',
                toolbar: getToolbarButtons(),
                content_style: `
                body {
                  font-size: 15px;
                }`,
                setup: function (editor) {
                  editor.on('keyup', function (e) {
                    // Get current content length
                    var contentLength = editor.getContent({ format: 'text' }).length
                    if (e.key !== 'Backspace' && e.key !== 'Delete' && contentLength === maxLength) {
                      console.log("Dont allow")
                      e.preventDefault()
                      e.stopPropagation()
                      return false
                    }
                    return true
                  })

                  // editor.on('PastePreProcess', function (e) {
                  //   var contentLength = editor.getContent({ format: 'text' }).length
                  //   // Calculate the remaining space
                  //   var remainingLength = maxLength - contentLength
                  //   let pastedContent = he.decode(e.content)
                  //   console.log(remainingLength)
                  //   // If pasted content exceeds the remaining space
                  //   if (pastedContent.length > remainingLength) {
                  //     // Truncate the pasted content
                  //     let truncatedText = pastedContent.substring(0, remainingLength)
                  //     e.content = e.content.replace(pastedContent, truncatedText)
                  //   }
                  // })
                }
              }}
              value={value}
            />
          </div>
          {/* {editorRef && <div className='absolute px-3 -bottom-1 gap-5 flex items-center left-[120px] h-9 bg-[#F8FAFC] w-[400px] z-50'>
            {aiOptionButtons.map((type: OptionButtons, index) => {
              if (type === OptionButtons.IMPROVE) {
                if (sentences >= 2) {
                  return <div key={`button-ai-${index}`}>
                    <Tooltip label={getButtonTooltip(OptionButtons.IMPROVE)}>
                      <button disabled={aiProgress && currentAIAction === OptionButtons.IMPROVE} onClick={() => {
                        setCurrentAIAction(OptionButtons.IMPROVE)
                        onAIQueryButtonClick(OptionButtons.IMPROVE)
                      }} type='button' className='text-primary-500 disabled:bg-primary-50 py-2 px-2 items-center text-sm flex gap-2 font-semibold'>
                        <img loading="lazy" src="/ai-icon-dark.svg" alt="" />
                        {getButtonContent(OptionButtons.IMPROVE)}
                        {aiProgress && currentAIAction === OptionButtons.IMPROVE && <Spinner size={'xs'} />}
                      </button>

                    </Tooltip>
                  </div>
                }
                return <div key={`button-ai-${index}`}></div>
              } else {
                if (sentences < 2) {
                  return <div key={`button-ai-${index}`}>
                    <Tooltip label={getButtonTooltip(OptionButtons.SUGGEST)}>
                      <button disabled={aiProgress && currentAIAction === OptionButtons.SUGGEST} onClick={() => {
                        setCurrentAIAction(OptionButtons.SUGGEST)
                        onAIQueryButtonClick(OptionButtons.SUGGEST)
                      }} type='button' className='text-primary-500 disabled:bg-primary-50 py-2 px-2 items-center text-sm flex gap-2 font-semibold'>
                        <img loading="lazy" src="/ai-icon-dark.svg" alt="" />
                        {getButtonContent(OptionButtons.SUGGEST)}
                        {aiProgress && currentAIAction === OptionButtons.SUGGEST && <Spinner size={'xs'} />}
                      </button>

                    </Tooltip>
                  </div>
                }
                return <div key={`button-ai-${index}`}></div>
              }
            })
            }
          </div>} */}
        </div>
        <div className='flex justify-end items-center text-xs mt-1.5 gap-1'>
          <span>{count}/{maxLength}</span>
        </div>
      </div>
    </div>
  )
}

export default CustomTinyMCEEditor
