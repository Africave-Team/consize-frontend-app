import { EnrollmentField, LearnerGroup, Student } from '@/type-definitions/secure.courses'
import { FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import FileUploader from '../FileUploader'
import { RowData, exportSampleData } from '@/utils/generateExcelSheet'


function IndividualMember ({ student, className }: { student: Student, className?: string }) {
  return (
    <div className={className}>{student ? student.firstName.slice(0, 1) : 'T'}</div>
  )
}

export default function LearnerGroups ({ groups, id, refetch, fields }: { groups: LearnerGroup[], fields: EnrollmentField[], id: string, refetch: () => Promise<any> }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const downloadSampleSheet = async function () {
    const tableData: RowData[][] = [
      [
        ...fields.map((field) => {
          return {
            v: field.fieldName,
            t: "s",
            s: {
              font: {
                sz: 15,
                bold: true
              },
            }
          }
        })
      ],
      ...Array(10).fill(0).map((v, index) => {
        return [
          ...fields.map((field) => {
            let value = ''
            if (field.fieldName.toLowerCase().includes('other')) {
              value = 'Robinson'
            } else if (field.fieldName.toLowerCase().includes('first')) {
              value = 'Jack'
            } else if (field.fieldName.toLowerCase().includes('phone')) {
              value = `23481${(new Date().getTime() + index).toString().slice(-8)}'`
            } else if (field.fieldName.toLowerCase().includes('email')) {
              value = 'jack.robinson@mailinator.com'
            } else[
              value = `Example ${field.fieldName}`
            ]
            return {
              v: value,
              t: "s",
            }
          })
        ]
      })
    ]

    exportSampleData({ name: 'sample-learner-groups-consize.com', tableData })
  }

  return (
    <div>
      <div className='rounded-lg w-full h-full'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='font-medium text-sm'>Learner groups</h1>
            <div className='text-[#64748B] text-sm'>Lists of students enroled for this course</div>
          </div>
          <div className='flex items-center'>
          </div>
        </div>
        <div className='flex flex-col gap-3 mt-3'>
          {groups.map((group, i) => (
            <div key={`group_${i}`} className='h-16 w-full hover:bg-gray-100 select-none px-3 items-center flex gap-4'>
              <div className='w-24 relative -mt-12'>
                {group.members.length > 2 ? group.members.slice(0, 2).map((student, index) => {
                  return <IndividualMember key={student.email} className={`${index === 0 ? 'left-0 bg-green-300' : 'left-7 bg-gray-700'} top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-semibold text-lg text-white`} student={student} />
                }) : group.members.map((student, index) => {
                  return <IndividualMember key={student.email} className={`${index === 0 ? 'left-0 bg-green-300' : 'left-7 bg-gray-700'} top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-semibold text-lg text-white`} student={student} />
                })}
                <div className='left-14 top-0 h-12 w-12 absolute rounded-full flex justify-center items-center border font-bold text-sm bg-white'>+{group.members.length - 2}</div>
              </div>
              <div className='flex flex-col gap-1 flex-1 justify-center'>
                <div className='text-sm font-bold'>{group.name}</div>
                <div className='text-sm font-medium text-[#64748B] -mt-1'>{group.members.length} members</div>
              </div>
              <div className='w-32 h-full flex gap-1 items-center'>
                {/* <GroupEnrollmentSchedule isBundle={isBundle} id={group.id} courseId={courseId} />
                <ViewMembers ids={group.contactIds} /> */}
                {/* <button disabled={loading[group.id]} onClick={() => handleDeleteItem(group.id)} className='h-12 w-10 flex justify-center items-center'>
                  {loading[group.id] ? <Spinner size={'sm'} /> : <FiTrash2 />}
                </button> */}
              </div>
            </div>
          ))}
        </div>

        <button className='border w-full rounded-md py-2 mt-4 justify-center items-center text-primary-500 font-medium flex gap-2'>
          <AiOutlinePlus className='font-semibold' />
          <span className='text-sm'>Add learner group</span>
        </button>
      </div>


      {isOpen && <Modal size={'md'} onClose={onClose} isOpen={isOpen}>

        <ModalOverlay />
        <ModalContent className='-mt-0'>
          <ModalHeader className='border-b !py-3 text-base'>Create learner group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel className='text-sm' htmlFor='groupName' requiredIndicator={true}>Group name <span className='text-red-500 text-xs'>*</span></FormLabel>
              <Input id='groupName' placeholder='Enter a name for this group' />
            </FormControl>

            <FormControl className='mt-4'>
              <FormLabel className='text-sm'>Upload learner list file <span className='text-red-500 text-xs'>*</span></FormLabel>
              <div className='mb-2'>
                <p className='text-xs'>Take a look at a <a className='text-primary-500 hover:text-primary-300' href="#" onClick={(e) => {
                  e.preventDefault()
                  downloadSampleSheet()
                }} target="_blank" rel="noopener noreferrer">sample spreadsheet</a> to see how you are expected to format your spreadsheet</p>
              </div>
              <FileUploader mimeTypes={[]} onUploadComplete={() => { }} originalUrl='' droppable={true} previewable={false} />
            </FormControl>
            {/* {allowScheduling && <div>
              <FormControl>
                <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Schedule launch time <span className='text-red-500 text-xs'>*</span></FormLabel>
                <Datetime value={scheduledTime} onChange={(f) => { setScheduledTime(new Date(f.valueOf())) }} />
              </FormControl>
              <FormControl>
                <FormLabel className='text-sm mt-3' htmlFor='scheduledTime' requiredIndicator={true}>Timezone <span className='text-red-500 text-xs'>*</span></FormLabel>
                <Select value={scheduledTimezone} onChange={(e) => {
                  console.log(e.target)
                  setScheduledTimezone(e.target.value)
                }}>
                  <option>Select timezone</option>
                  {Timezones.map((zone, i) => {
                    return (
                      <option key={zone.value} value={zone.value}>{zone.text}</option>
                    )
                  })}
                </Select>
              </FormControl>
            </div>
            } */}
            {/* <div className='flex mt-3 text-xs gap-1'>
              Do you want to schedule a launch time?
              <button onClick={() => setAllowScheduling(!allowScheduling)} className='px-3 bg-primary-500 rounded-2xl text-white'>{!allowScheduling ? 'Yes' : 'No'}</button>
            </div>
            <div className='h-2 w-full mt-3'>
              {parsing && <Progress className='' size='xs' isIndeterminate />}
            </div> */}
          </ModalBody>
          <ModalFooter className='!justify-between pt-0'>
            <button className='px-4 py-2 border rounded-lg font-semibold' onClick={onClose}>Cancel</button>
            {/* <button onClick={handleParseFile} disabled={groupName.length === 0 || filePreview === null || parsing} className='px-4 py-2 border rounded-lg font-semibold flex justify-center items-center gap-1 disabled:bg-primary-300 bg-primary-500 text-white'>Save
              {parsing && <Spinner size={'sm'} />}
            </button> */}
          </ModalFooter>
        </ModalContent></Modal>}
    </div>
  )
}
