import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Course, CreateCoursePayload, Lesson, LessonData, MediaType, UpdateLesson } from '@/type-definitions/secure.courses'
import he from "he"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react'
import { updateCourse } from '@/services/secure.courses.service'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/utils/react-query'
import { useFormik } from 'formik'
import LessonCard from '../LessonCard'
import { updateLesson } from '@/services/lessons.service'
import { FiEye, FiPlus } from 'react-icons/fi'
import EditBlockForm from '@/components/FormButtons/EditBlock'
import DeleteLessonBlockButton from '@/components/FormButtons/DeleteBlock'
import DeleteBlockQuizButton from '@/components/FormButtons/DeleteBlockQuiz'
import { useCourseMgtStore } from '@/store/course.management.store'
import { ContentTypeEnum } from '@/type-definitions/course.mgt'
import { PiDotsSixVerticalBold } from 'react-icons/pi'

export default function DraggableLessonsSectionCards ({ value }: { value: LessonData }) {
  const { initiateCreateContent, reloadLesson, setReloadLesson } = useCourseMgtStore()
  const form = useFormik({
    initialValues: {
      sections: value.blocks
    },
    onSubmit: () => { }
  })

  useEffect(() => {
    form.setFieldValue("sections", value.blocks)
  }, [value])


  const updateMutation = useMutation({
    mutationFn: (data: UpdateLesson) => updateLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson', { lessonId: value.id || value._id || "", courseId: value.course.id || value.course._id || "" }], })
    }
  })

  const onDragEnd = async ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    let blocks = [...form.values.sections]
    const item = blocks[source.index]
    blocks.splice(source.index, 1)
    blocks.splice(destination.index, 0, item)
    form.setFieldValue("sections", blocks)
    let payload: UpdateLesson = {
      lessonId: value._id || value.id || "",
      courseId: value.course.id || value.course._id || "",
      lesson: {
        title: value.title,
        blocks: blocks.map(e => e._id || e.id || ""),
        quizzes: value.quizzes.map(e => e._id || e.id || ""),
      }
    }

    await updateMutation.mutateAsync(payload)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={value.id || value._id || ""}>
        {(droppableProvided) => (
          <div className='px-1 min-h-16 w-full' ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            <div className='text-xs mb-2'>You can drag the sections to change their position</div>
            <Accordion className='flex flex-col gap-3 w-full' defaultIndex={[0]} allowMultiple>

              {form.values.sections.map((section, index) => {
                let block = section
                return <div className='w-full' key={section.id || section._id || ""}>
                  <Draggable index={index} draggableId={section.id || section._id || ""}>
                    {(draggableProvided) => (
                      <div ref={draggableProvided.innerRef} className='cursor-pointer bg-white items-center w-full flex justify-between' {...draggableProvided.draggableProps}>
                        <AccordionItem className='rounded-md border w-full'>
                          <div className='flex group'>
                            <AccordionButton className='hover:bg-white flex gap-2 items-center'>
                              <span {...draggableProvided.dragHandleProps}>
                                <PiDotsSixVerticalBold className='cursor-move' />
                              </span>
                              <Box className='font-semibold text-sm line-clamp-1' as="span" flex='1' textAlign='left'>
                                {block.title}
                              </Box>
                            </AccordionButton>
                            <div className='flex gap-2 items-center pr-3'>
                              <div className='flex gap-1 h-10 items-center'>
                                <button className='hover:bg-gray-100 rounded-lg h-10 w-10 flex justify-center items-center text-base'>
                                  <FiEye />
                                </button>
                                <EditBlockForm lessonId={value.id || value._id || ""} block={block} refetch={async () => { }} />
                                <DeleteLessonBlockButton lessonId={value.id || value._id || ""} blockId={block.id || block._id || ""} refetch={async () => {

                                }} />
                              </div>
                              <AccordionButton className='hover:bg-white px-0'>
                                <AccordionIcon />
                              </AccordionButton>
                            </div>
                          </div>
                          <AccordionPanel pb={4}>
                            {block.bodyMedia && block.bodyMedia.url && <div className='w-full'>
                              {
                                block.bodyMedia.mediaType === MediaType.AUDIO &&
                                <>
                                  <audio className='w-full' controls>
                                    <source src={block.bodyMedia.url} />
                                    Your browser does not support the audio tag.
                                  </audio>
                                </>
                              }
                              {
                                block.bodyMedia.mediaType === MediaType.VIDEO && <>
                                  <iframe
                                    className='h-52 w-full'
                                    src={`${location.origin}/embed/${block.bodyMedia.url.replace('https://storage.googleapis.com/kippa-cdn-public/microlearn-images/', '').replace('.mp4', '')}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  ></iframe>
                                </>
                              }
                              {block.bodyMedia.mediaType === MediaType.IMAGE && <img className='h-52 w-full' src={block.bodyMedia.url} />}
                            </div>}
                            <div className='mt-2'>
                              <label className='font-semibold text-sm' htmlFor="">{block.title}</label>
                              <div className='list pl-3'>
                                {block.content && <div className='text-sm list' dangerouslySetInnerHTML={{ __html: he.decode(block.content) }} />}
                              </div>
                            </div>
                            {block.quiz ? <div className='mt-3 flex flex-col gap-2'>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Question</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(block.quiz.question) }} />
                              </div>


                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Choices</label>
                                <div className='text-sm'>A: Yes</div>
                                <div className='text-sm'>B: No</div>
                              </div>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Correct answer</label>
                                <div className='text-sm'>{["Yes", "No"][block.quiz.correctAnswerIndex]}</div>
                              </div>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Message to send when they get it correctly</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(block.quiz.correctAnswerContext) }} />
                              </div>
                              <div>
                                <label className='font-semibold text-sm' htmlFor="">Message to send when they get it wrong</label>
                                <div className='text-sm' dangerouslySetInnerHTML={{ __html: he.decode(block.quiz.wrongAnswerContext) }} />
                              </div>

                              <div>
                                <DeleteBlockQuizButton blockId={block.id} quizId={block.quiz.id} refetch={async () => { }} />
                              </div>
                            </div> : <div>
                              <button onClick={() => initiateCreateContent(value.id || value._id || "", value.course.id || value.course._id || "", ContentTypeEnum.BLOCK_QUIZ, block.id)} className='hover:bg-gray-100 mt-3 rounded-lg h-8  gap-2 px-3 border text-sm flex justify-center items-center'>
                                <FiPlus /> Follow up quiz
                              </button>
                            </div>}
                          </AccordionPanel>
                        </AccordionItem>
                      </div>
                    )}
                  </Draggable>
                </div>
              })}
            </Accordion>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

