import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Editor as TinyMCEEditor } from 'tinymce'
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Spinner, Tooltip, useDisclosure } from '@chakra-ui/react'
import { stripHtmlTags } from '@/utils/string-formatters'
import he from "he"
import { OptionButtons } from '@/type-definitions/course.mgt'
import AIIcon from './icons/AI'
import { PiArrowsClockwiseBold, PiCheckBold } from 'react-icons/pi'
import { QuizUnformed } from '@/type-definitions/secure.courses'


interface TinyMCEEditorProps {
  field: string
  value: string
  placeholder: string
  maxLength: number,
  aiOptionButtons?: OptionButtons[]
  onChange: (plain: string) => void
  aiProgress?: boolean
  onAIQueryButtonClick?: (action: OptionButtons) => Promise<void>
  improvement?: boolean
  improvementResult?: string
  closeImprovement?: () => void
  quiz?: QuizUnformed | null
  acceptQuiz?: (quiz: QuizUnformed) => void
  isFollowup?: boolean
}

const CustomTinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ aiOptionButtons = [], acceptQuiz, value, onAIQueryButtonClick, improvement, closeImprovement, improvementResult, onChange, placeholder, maxLength, aiProgress, quiz, isFollowup }) => {
  const [count, setCount] = useState<number>(0)
  const { isOpen, onToggle, onClose } = useDisclosure()
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

  useEffect(() => {
    const sentences = stripHtmlTags(he.decode(value)).split(/[.!?]+/)
    const filteredSentences = sentences.filter(sentence => sentence.trim() !== '')
    setSentences(filteredSentences.length)
  }, [value])



  const getButtonContent = (type: OptionButtons) => {
    if (type === 'aiimprove') {
      return isMobile ? 'AI Improve' : 'Improve with AI'
    } else if (type === "aisuggest") {
      return isMobile ? 'AI Generate' : 'Generate text with AI'
    } else if (type === "aisuggest-quiz") {
      return isMobile ? 'AI Generate' : 'Generate quiz with AI'
    } else if (type === "aiimprove-quiz") {
      return isMobile ? 'AI Improve' : 'Improve quiz with AI'
    }
  }
  const getButtonTooltip = (type: OptionButtons) => {
    if (type === 'aiimprove') {
      return "Improve content with AI"
    } else if (type === "aisuggest") {
      return "Generate content with AI"
    } else if (type === "aisuggest-quiz") {
      return 'Generate quiz with AI'
    } else if (type === "aiimprove-quiz") {
      return 'Improve quiz with AI'
    }
  }

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
                license_key: "gpl",
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
              value={value.replace(/&lt;p>/, "").replace(/&lt;\/p>/g, (match, offset, original) => {
                const isLastOccurrence = original.lastIndexOf(match) === offset
                return isLastOccurrence ? "" : match
              })}
            />
          </div>
          {editorRef && aiOptionButtons.length > 0 && <div className='absolute px-3 -bottom-1 gap-5 flex items-center left-[190px] h-9 bg-[#F8FAFC] w-[260px] z-50'>
            {aiOptionButtons.map((type: OptionButtons, index) => {
              if (type === OptionButtons.IMPROVE) {
                if (sentences >= 2) {
                  return <div className='' key={`button-ai-${index}`}>
                    <Popover closeOnEsc={false} closeOnBlur={false} isOpen={improvement} onClose={() => closeImprovement && closeImprovement()} placement='bottom'>
                      <PopoverTrigger>
                        <span>
                          <Tooltip label={getButtonTooltip(OptionButtons.IMPROVE)}>
                            <button disabled={aiProgress || improvement} onClick={() => {
                              setCurrentAIAction(OptionButtons.IMPROVE)
                              if (onAIQueryButtonClick) {
                                onAIQueryButtonClick(OptionButtons.IMPROVE)
                              }
                            }} type='button' className='text-[#0CDA50] py-2 px-2 items-center text-sm flex gap-2 font-semibold'>
                              <AIIcon className='fill-[#0CDA50] w-5 h-5' />
                              {getButtonContent(OptionButtons.IMPROVE)}
                            </button>
                          </Tooltip>
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className='!rounded-xl w-[520px] !left-0'>
                        <PopoverArrow />
                        <PopoverBody className='flex flex-col p-0'>
                          <div className='h-8 border-b px-4 flex gap-1 text-sm text-[#64748B] justify-start items-center'>
                            <AIIcon className='fill-[#64748B] h-5 w-5' /> {aiProgress ? <div className='flex gap-2 items-center'><span className='italic'>Generating text...</span><Spinner size={'xs'} /></div> : <span>Text generated.</span>}
                          </div>
                          <div className='min-h-10 px-4 text-sm py-1' dangerouslySetInnerHTML={{ __html: improvementResult || "" }} />
                          <div className='h-12 px-4 border-t flex justify-between items-center'>
                            <button type='button' onClick={() => closeImprovement && closeImprovement()} className='px-4 h-8 rounded-2xl border'>Cancel</button>
                            <div className='h-full flex gap-2 items-center'>
                              <button type='button' disabled={aiProgress} onClick={() => onAIQueryButtonClick && onAIQueryButtonClick(OptionButtons.IMPROVE)} className='h-8 px-4 flex items-center justify-center gap-2 font-medium bg-[#EAECF0] rounded-3xl text-sm'>
                                <PiArrowsClockwiseBold />
                                Regenerate
                              </button>

                              <button type='button' disabled={aiProgress} onClick={() => { closeImprovement && closeImprovement(); onChange(improvementResult || value) }} className='h-8 px-4 flex items-center text-white justify-center gap-2 font-medium bg-[#334155] rounded-3xl text-sm'>
                                <PiCheckBold />
                                Accept changes
                              </button>
                            </div>
                          </div>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>

                  </div>
                }
                return <div key={`button-ai-${index}`}></div>
              } else if (type === OptionButtons.SUGGEST) {
                if (sentences < 2) {
                  return <div key={`button-ai-${index}`}>
                    <Tooltip label={getButtonTooltip(OptionButtons.SUGGEST)}>
                      <button disabled={aiProgress && currentAIAction === OptionButtons.SUGGEST} onClick={() => {
                        setCurrentAIAction(OptionButtons.SUGGEST)
                        if (onAIQueryButtonClick) {
                          onAIQueryButtonClick(OptionButtons.SUGGEST)
                        }
                      }} type='button' className='text-[#0CDA50] py-2 px-2 items-center text-sm flex gap-2 font-semibold'>
                        <AIIcon className='fill-[#0CDA50] w-5 h-5' />
                        {getButtonContent(OptionButtons.SUGGEST)}
                        {aiProgress && <Spinner size={'xs'} />}
                      </button>

                    </Tooltip>
                  </div>
                }
                return <div key={`button-ai-${index}`}></div>
              } else if (type === OptionButtons.IMPROVEQUIZ) {
                if (value.length > 10) {
                  return <div className='' key={`button-ai-${index}`}>
                    <Popover closeOnEsc={false} closeOnBlur={false} isOpen={improvement} onClose={() => closeImprovement && closeImprovement()} placement='bottom'>
                      <PopoverTrigger>
                        <span>
                          <Tooltip label={getButtonTooltip(OptionButtons.IMPROVEQUIZ)}>
                            <button disabled={aiProgress || improvement} onClick={() => {
                              setCurrentAIAction(OptionButtons.IMPROVEQUIZ)
                              if (onAIQueryButtonClick) {
                                onAIQueryButtonClick(OptionButtons.IMPROVEQUIZ)
                              }
                            }} type='button' className='text-[#0CDA50] py-2 px-2 items-center text-sm flex gap-2 font-semibold'>
                              <AIIcon className='fill-[#0CDA50] w-5 h-5' />
                              {getButtonContent(OptionButtons.IMPROVEQUIZ)}
                            </button>
                          </Tooltip>
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className='!rounded-xl w-[520px] !left-0'>
                        <PopoverArrow />
                        <PopoverBody className='flex flex-col p-0'>
                          <div className='h-8 border-b px-4 flex gap-1 text-sm text-[#64748B] justify-start items-center'>
                            <AIIcon className='fill-[#64748B] h-5 w-5' /> {aiProgress ? <div className='flex gap-2 items-center'><span className='italic'>Generating quiz...</span><Spinner size={'xs'} /></div> : <span>Quiz generated.</span>}
                          </div>
                          <div className='min-h-10 px-4 text-sm py-1'>
                            {quiz && <>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Question</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.question) }} />
                              </div>


                              {!isFollowup ? <>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Choices</label>
                                  {quiz.options.map((e, i) => <div key={e} className='text-sm'>{['A', 'B', 'C'][i]}: {e}</div>)}
                                </div>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Correct answer</label>
                                  <div className='text-sm'>{quiz.options[Number(quiz.correct_answer)]}</div>
                                </div>
                              </> : <>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Choices</label>
                                  <div className='text-sm'>A: Yes 00000</div>
                                  <div className='text-sm'>B: No</div>
                                </div>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Correct answer</label>
                                  <div className='text-sm'>{quiz.correct_answer}</div>
                                </div>
                              </>}
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Message to send when they get it correctly</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.explanation) }} />
                              </div>
                            </>}
                          </div>
                          <div className='h-12 px-4 border-t flex justify-between items-center'>
                            <button type='button' onClick={() => closeImprovement && closeImprovement()} className='px-4 h-8 rounded-2xl border'>Cancel</button>
                            <div className='h-full flex gap-2 items-center'>
                              <button type='button' disabled={aiProgress} onClick={() => onAIQueryButtonClick && onAIQueryButtonClick(OptionButtons.IMPROVEQUIZ)} className='h-8 px-4 flex items-center justify-center gap-2 font-medium bg-[#EAECF0] rounded-3xl text-sm'>
                                <PiArrowsClockwiseBold />
                                Regenerate
                              </button>

                              <button type='button' disabled={aiProgress} onClick={() => { acceptQuiz && quiz && acceptQuiz(quiz) }} className='h-8 px-4 flex items-center text-white justify-center gap-2 font-medium bg-[#334155] rounded-3xl text-sm'>
                                <PiCheckBold />
                                Accept changes
                              </button>
                            </div>
                          </div>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>

                  </div>
                }
                return <div key={`button-ai-${index}`}></div>
              } else if (type === OptionButtons.SUGGESTQUIZ) {
                if (value.length < 10) {
                  return <div key={`button-ai-${index}`}>
                    <Popover closeOnEsc={false} closeOnBlur={false} isOpen={improvement} onClose={() => closeImprovement && closeImprovement()} placement='bottom'>
                      <PopoverTrigger>
                        <span>
                          <Tooltip label={getButtonTooltip(OptionButtons.SUGGESTQUIZ)}>
                            <button disabled={aiProgress || improvement} onClick={() => {
                              setCurrentAIAction(OptionButtons.SUGGESTQUIZ)
                              if (onAIQueryButtonClick) {
                                onAIQueryButtonClick(OptionButtons.SUGGESTQUIZ)
                              }
                            }} type='button' className='text-[#0CDA50] py-2 px-2 items-center text-sm flex gap-2 font-semibold'>
                              <AIIcon className='fill-[#0CDA50] w-5 h-5' />
                              {getButtonContent(OptionButtons.SUGGESTQUIZ)}
                            </button>
                          </Tooltip>
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className='!rounded-xl w-[520px] !left-0'>
                        <PopoverArrow />
                        <PopoverBody className='flex flex-col p-0'>
                          <div className='h-8 border-b px-4 flex gap-1 text-sm text-[#64748B] justify-start items-center'>
                            <AIIcon className='fill-[#64748B] h-5 w-5' /> {aiProgress ? <div className='flex gap-2 items-center'><span className='italic'>Generating quiz...</span><Spinner size={'xs'} /></div> : <span>Quiz generated.</span>}
                          </div>
                          <div className='min-h-10 px-4 text-sm py-1'>
                            {quiz && <>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Question</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.question) }} />
                              </div>


                              {!isFollowup ? <>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Choices</label>
                                  {quiz.options.map((e, i) => <div key={e} className='text-sm'>{['A', 'B', 'C'][i]}: {e}</div>)}
                                </div>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Correct answer</label>
                                  <div className='text-sm'>{quiz.options[Number(quiz.correct_answer)]}</div>
                                </div>
                              </> : <>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Choices</label>
                                  <div className='text-sm'>A: Yes oooo</div>
                                  <div className='text-sm'>B: No</div>
                                </div>
                                <div>
                                  <label className='font-semibold text-sm' htmlFor="">Correct answer</label>
                                  <div className='text-sm'>{quiz.correct_answer}</div>
                                </div>
                              </>}
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Message to send when they get it correctly</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(quiz.explanation) }} />
                              </div>
                            </>}
                          </div>
                          <div className='h-12 px-4 border-t flex justify-between items-center'>
                            <button type='button' onClick={() => closeImprovement && closeImprovement()} className='px-4 h-8 rounded-2xl border'>Cancel</button>
                            <div className='h-full flex gap-2 items-center'>
                              <button type='button' disabled={aiProgress} onClick={() => onAIQueryButtonClick && onAIQueryButtonClick(OptionButtons.SUGGESTQUIZ)} className='h-8 px-4 flex items-center justify-center gap-2 font-medium bg-[#EAECF0] rounded-3xl text-sm'>
                                <PiArrowsClockwiseBold />
                                Regenerate
                              </button>

                              <button type='button' disabled={aiProgress} onClick={() => { acceptQuiz && quiz && acceptQuiz(quiz) }} className='h-8 px-4 flex items-center text-white justify-center gap-2 font-medium bg-[#334155] rounded-3xl text-sm'>
                                <PiCheckBold />
                                Accept changes
                              </button>
                            </div>
                          </div>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </div>
                }
                return <div key={`button-ai-${index}`}></div>
              }
            })
            }
          </div>}
        </div>
        <div className='flex justify-end items-center text-xs mt-1.5 gap-1'>
          <span>{count}/{maxLength}</span>
        </div>
      </div>
    </div>
  )
}

export default CustomTinyMCEEditor
