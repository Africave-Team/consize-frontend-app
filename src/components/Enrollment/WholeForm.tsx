import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'

import * as Yup from 'yup'
import PhoneInput from '../PhoneInput'
import { Checkbox, HStack, Icon, PinInput, PinInputField, Spinner, useToast } from '@chakra-ui/react'
import { enrollStudent, registerStudent, verifyStudentPhone, verifyWHatsappCode } from '@/services/public.courses.service'
import { RequestError } from '@/type-definitions/IAxios'
import { useMutation } from '@tanstack/react-query'
import { isMobile } from 'react-device-detect'
import { RiWhatsappLine } from 'react-icons/ri'
import { testCourseWhatsapp } from '@/services/secure.courses.service'

const phoneRegExp = /^\+[1-9]\d{1,14}$/
const validatePhoneVerification = Yup.object({
  phoneNumber: Yup.string().matches(phoneRegExp, 'Invalid phone number'),
})

const validateCompleteVerification = Yup.object({
  code: Yup.string().min(6).max(6),
})

const validateRegisteration = Yup.object({
  firstName: Yup.string().required(),
  otherNames: Yup.string().required(),
  email: Yup.string().email().required(),
  agree: Yup.boolean().oneOf([true])
})

export default function WholeForm (params: { id: string, tryout?: boolean }) {
  const [enrolled, setEnrolled] = useState(false)
  const toast = useToast()
  const verifyPhoneForm = useFormik({
    validationSchema: validatePhoneVerification,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      phoneNumber: "",
      completed: false,
      userFound: false,
      otpField: false,
      agree: false,
      registerationForm: false,
      user: {
        verified: null,
        id: "",
        firstName: "",
        otherNames: ""
      }
    },
    onSubmit: async function (values, { setFieldValue }) {
      try {
        if (params.tryout) {
          await testCourseWhatsapp({
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            phoneNumber: values.phoneNumber.replace('+', ''),
            course: params.id
          })
          toast({
            title: 'Enrollment complete.',
            description: "You have successfully enrolled for  this course",
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          verifyPhoneForm.resetForm()
          setEnrolled(true)
        } else {
          const result = await verifyStudentPhone(values.phoneNumber.replace('+', ''))
          setFieldValue("completed", true)
          if (result.data && result.data.verified) {
            setFieldValue("user", result.data)
            setFieldValue("userFound", true)
          }
        }
      } catch (error) {
        let { code } = error as RequestError
        console.log(error)
        if (code === 404) {
          setFieldValue("completed", true)
          setFieldValue("registerationForm", true)
        }

        if (code === 400) {
          setFieldValue("completed", true)
          setFieldValue("otpField", true)
        }
      }
    },
  })

  const completeVerifyPhoneForm = useFormik({
    validationSchema: validateCompleteVerification,
    initialValues: {
      code: "",
    },
    validateOnChange: true,
    onSubmit: async function (values, { setFieldValue }) {
      try {
        const result = await verifyWHatsappCode(values.code)
        if (result && result.data) {
          const { id } = result.data
          enrollMutation.mutate({ userId: id, courseId: params.id })
        }
      } catch (error) {

      }
    },
  })

  const registerStudentForm = useFormik({
    validationSchema: validateRegisteration,
    initialValues: {
      firstName: "",
      otherNames: "",
      email: "",
      agree: false
    },
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit: async function (values, { setFieldValue }) {
      try {
        registerMutation.mutate({
          email: values.email,
          firstName: values.firstName,
          otherNames: values.otherNames,
          phoneNumber: verifyPhoneForm.values.phoneNumber.replace('+', ''),
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      } catch (error) {

      }
    },
  })


  const enrollMutation = useMutation({
    mutationFn: async ({ userId, courseId }: { userId: string, courseId: string }) => {
      return enrollStudent(userId, courseId)
    },
    onSuccess: async () => {
      toast({
        title: 'Enrollment complete.',
        description: "You have successfully enrolled for  this course",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      verifyPhoneForm.resetForm()
      completeVerifyPhoneForm.resetForm()
      setEnrolled(true)
    },
    onError: (error) => {
      toast({
        title: 'Enrollment failed.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  })

  const registerMutation = useMutation({
    mutationFn: (payload: { email: string, firstName: string, otherNames: string, phoneNumber: string, tz: string }) => {
      return registerStudent(payload)
    },
    onSuccess: async () => {
      toast({
        title: 'Registeration complete.',
        description: "We have sent you a verification code to the phone number provided",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      verifyPhoneForm.setFieldValue('registerationForm', false)
      verifyPhoneForm.setFieldValue("completed", true)
      verifyPhoneForm.setFieldValue("otpField", true)
    }
  })

  const enrollStudentHandler = async function () {
    if (verifyPhoneForm.values.userFound) {
      const { id } = verifyPhoneForm.values.user
      enrollMutation.mutate({ userId: id, courseId: params.id })
    }
  }


  const [isMobileScreen, setIsMobile] = useState(isMobile)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobile)
    }

    // Attach the event listener
    window.addEventListener('resize', handleResize)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])


  return (
    <div className='mt-4'>
      {!enrolled ? <div>
        <form onSubmit={verifyPhoneForm.handleSubmit}>
          <div className='text-sm mb-1'>What's your phone number</div>
          <PhoneInput disabled={verifyPhoneForm.values.completed} value={verifyPhoneForm.values.phoneNumber} onChange={(val) => {
            if (val) {
              verifyPhoneForm.handleChange("phoneNumber")(val)
            }
          }} />
          {params.tryout && <div className='w-full mt-2'>
            <Checkbox className='flex items-center' size="md" name='agree' id='agree' onChange={(e) => {
              verifyPhoneForm.setFieldValue('agree', e.target.checked)
            }} isChecked={verifyPhoneForm.values.agree}>
              <span className='text-xs'>
                I agree to receive this course from Consize on WhatsApp
              </span>
            </Checkbox>
          </div>}
          {!verifyPhoneForm.values.completed && <button disabled={!verifyPhoneForm.isValid || verifyPhoneForm.isSubmitting || (!verifyPhoneForm.values.agree && params.tryout)} type='submit' className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-semibold gap-1 disabled:bg-[#1FFF69]/40'>Continue
            {verifyPhoneForm.isSubmitting && <Spinner size={'sm'} />}
          </button>}
        </form>

        <div className={`${verifyPhoneForm.values.completed ? 'min-h-10' : 'h-0 hidden'} transition-all duration-500`}>
          {verifyPhoneForm.values.userFound && verifyPhoneForm.values.user.verified && <div>
            <div className='h-6 mt-3 text-base'>
              Enroll as <span className='font-semibold uppercase'>{verifyPhoneForm.values.user.firstName} {verifyPhoneForm.values.user.otherNames}?</span>
            </div>
            <button onClick={enrollStudentHandler} type='button' disabled={enrollMutation.isPending} className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-medium gap-1 disabled:bg-[#1FFF69]/40'>
              Enroll for free {enrollMutation.isPending && <Spinner size={'sm'} />}
            </button>
          </div>}

          {verifyPhoneForm.values.otpField && <form className='mt-3' onSubmit={completeVerifyPhoneForm.handleSubmit}>
            <p className='text-sm text-[#23173E99]/60'>We sent an OTP to the whatsapp number.</p>
            <HStack className='mt-1'>
              <PinInput id="code" placeholder='' size='md' onChange={(value) => completeVerifyPhoneForm.setFieldValue("code", value)}>
                <PinInputField className='text-base font-semibold h-12' />
                <PinInputField className='text-base font-semibold h-12' />
                <PinInputField className='text-base font-semibold h-12' />
                <PinInputField className='text-base font-semibold h-12' />
                <PinInputField className='text-base font-semibold h-12' />
                <PinInputField className='text-base font-semibold h-12' />
              </PinInput>
            </HStack>
            {/* <input name="code" id="code" onChange={completeVerifyPhoneForm.handleChange} value={completeVerifyPhoneForm.values.code} type="text" className='text-base font-semibold h-12 px-3 w-full mt-2 rounded-md border' placeholder='Enter your one-time-passcode' /> */}
            <button onClick={enrollStudentHandler} type='submit' disabled={!completeVerifyPhoneForm.isValid || completeVerifyPhoneForm.isSubmitting || enrollMutation.isPending} className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-medium gap-1 disabled:bg-[#1FFF69]/40'>
              Verify & enroll {(enrollMutation.isPending || completeVerifyPhoneForm.isSubmitting) && <Spinner size={'sm'} />}
            </button>
          </form>}

          {verifyPhoneForm.values.registerationForm && <form className='mt-2' onSubmit={registerStudentForm.handleSubmit}>
            <div className='flex w-full text-sm gap-2'>
              <div className='w-1/2'>
                <label htmlFor="firstName">First name</label>
                <input type="text" id='firstName' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.firstName} placeholder='First name' className='h-12 px-3 rounded-lg w-full border font-medium text-sm' />
              </div>
              <div className='w-1/2'>
                <label htmlFor="otherNames">Other names</label>
                <input type="text" id='otherNames' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.otherNames} placeholder='Other names' className='h-12 px-3 w-full rounded-lg border font-medium text-sm' />
              </div>
            </div>
            <div className='w-full mt-2'>
              <label htmlFor="email">Email address</label>
              <input type="email" id='email' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.email} placeholder='Email address' className='h-12 px-3 w-full rounded-lg border font-medium text-sm' />
            </div>
            <div className='w-full mt-2'>
              <Checkbox size="md" name='agree' id='agree' onChange={(e) => {
                registerStudentForm.setFieldValue('agree', e.target.checked)
              }} isChecked={registerStudentForm.values.agree}>
                <span className='text-sm'>
                  I agree to receive this course from Consize on WhatsApp
                </span>
              </Checkbox>
            </div>
            <button onClick={enrollStudentHandler} type='submit' disabled={!registerStudentForm.isValid || registerStudentForm.isSubmitting || registerMutation.isPending} className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-medium gap-1 disabled:bg-[#1FFF69]/40'>
              Register for free {(registerMutation.isPending || registerStudentForm.isSubmitting) && <Spinner size={'sm'} />}
            </button>
          </form>}
        </div>
      </div> : <div className='h-[250px] w-full flex justify-center items-center'>
        <div className='flex flex-col items-center w-full'>
          <img loading="lazy" src="/success-icon.svg" />
          <div className='text-center'>
            <h1 className='text-md font-bold'>
              Congratulations!<br />
              You are enrolled for the course.
            </h1>
          </div>
          <div className='w-full mt-2 text-center'>
            {isMobileScreen ? <div className='w-full text-center'>
              <a href={`https://wa.me/+${process.env.NEXT_PUBLIC_WHATSAPP_PHONENUMBER}`} target='__blank' className='w-full bg-[#14B8A6] flex gap-1 py-2 rounded-md justify-center text-white items-center'>
                <Icon as={RiWhatsappLine} color={'white'} className='text-2xl' />
                Continue in WhatsApp</a>
            </div> : <p className='text-sm'>
              Open WhatsApp to start the course
            </p>}
          </div>
        </div>
      </div>}
    </div>
  )
}
