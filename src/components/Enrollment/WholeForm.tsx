import { useFormik } from 'formik'
import React, { ReactNode, useEffect, useState } from 'react'

import * as Yup from 'yup'
import PhoneInput from '../PhoneInput'
import { Checkbox, FormControl, FormLabel, HStack, Icon, PinInput, PinInputField, Spinner, Switch, useToast } from '@chakra-ui/react'
import { enrollStudent, registerStudent, verifyStudentPhone, verifyWHatsappCode } from '@/services/public.courses.service'
import { RequestError } from '@/type-definitions/IAxios'
import { useMutation } from '@tanstack/react-query'
import { isMobile } from 'react-device-detect'
import { RiWhatsappLine } from 'react-icons/ri'
import { testCourseWhatsapp } from '@/services/secure.courses.service'
import { EnrollmentField } from '@/type-definitions/secure.courses'
import { Team } from '@/type-definitions/auth'

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

const generateInitialValues = (fields: EnrollmentField[]) => {
  if (fields.length === 0) {
    return {
      firstName: '',
      otherNames: '',
      email: '',
      phoneNumber: '',
      agree: false,
      custom: {}
    }
  }
  const initialValues: { [key: string]: any } = {
  }
  fields.forEach(field => {
    let fieldName = field.variableName
    if (!field.defaultField) {
      if (field.dataType === 'number') {
        initialValues[fieldName] = 0
      } else if (field.dataType === 'boolean') {
        initialValues[fieldName] = "no"
      } else {
        initialValues[fieldName] = ''
      }
    } else {
      initialValues[fieldName] = ''
    }
  })
  initialValues['agree'] = false
  return initialValues
}

const generateValidationSchema = (fields: EnrollmentField[]) => {
  if (fields.length === 0) {
    return validateRegisteration
  }
  const validationObject: { [key: string]: any } = {}
  fields.forEach(field => {
    let fieldName = field.variableName
    if (fieldName !== "phoneNumber") {
      if (fieldName === 'email') {
        validationObject[fieldName] = Yup.string().email('Invalid email address')
      } else if (field.dataType === 'number') {
        validationObject[fieldName] = Yup.number().typeError(`${field.fieldName} must be a number`)
      } else if (field.dataType === 'boolean') {
        validationObject[fieldName] = Yup.string().oneOf(["yes", "no"])
      } else {
        validationObject[fieldName] = Yup.string()
      }

      if (field.required) {
        validationObject[fieldName] = validationObject[fieldName].required(`${field.fieldName} is required`)
      } else {
        validationObject[fieldName] = validationObject[fieldName].optional()
      }
    }


  })
  validationObject['agree'] = Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('Required')
  return Yup.object().shape(validationObject)
}

export default function WholeForm (params: { id: string, tryout?: boolean, fields: EnrollmentField[], cohortId?: string, team?: Team }) {
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
      custom: {}
    },
    validateOnChange: true,
    onSubmit: async function (values, { setFieldValue }) {
      try {
        const result = await verifyWHatsappCode(values.code, params.team?.id || "")
        if (result && result.data) {
          const { id } = result.data
          enrollMutation.mutate({ userId: id, courseId: params.id, data: values.custom })
        }
      } catch (error) {

      }
    },
  })

  const registerStudentForm = useFormik({
    validationSchema: generateValidationSchema(params.fields),
    initialValues: generateInitialValues(params.fields),
    validateOnChange: true,
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit: async function (values, { setFieldValue }) {

      try {
        const { email, firstName, otherNames, phoneNumber, agree, ...custom } = values
        registerMutation.mutate({
          email,
          firstName,
          otherNames,
          phoneNumber: verifyPhoneForm.values.phoneNumber.replace('+', ''),
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          custom: custom,
          teamId: params.team?.id || ""
        })
      } catch (error) {
        console.log(error)
      }
    },
  })


  const enrollMutation = useMutation({
    mutationFn: async ({ userId, courseId, data, cohortId }: { userId: string, courseId: string, data: any, cohortId?: string }) => {
      return enrollStudent(userId, courseId, data, cohortId)
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
    mutationFn: (payload: { email: string, firstName: string, otherNames: string, phoneNumber: string, tz: string, custom: any, teamId: string }) => {
      const { custom, ...rest } = payload
      return registerStudent(rest)
    },
    onSuccess: async (_, { custom }) => {
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
      completeVerifyPhoneForm.setFieldValue("custom", custom)
    }
  })

  const enrollStudentHandler = async function () {
    if (verifyPhoneForm.values.userFound) {
      const { id } = verifyPhoneForm.values.user
      const { email, firstName, otherNames, phoneNumber, agree, ...custom } = registerStudentForm.values
      enrollMutation.mutate({ userId: id, courseId: params.id, data: custom, cohortId: params.cohortId })
    }
  }

  const generateEnrollForm = function (fieldItems: EnrollmentField[], onlyAdditional?: boolean) {
    const felds: { id: string, field: ReactNode }[] = []
    // generate default fields
    if (!onlyAdditional) {
      const defautlFields = fieldItems.filter(e => e.defaultField).sort((a, b) => a.position - b.position)
      let dfFieldNames = [...defautlFields].map(e => e.variableName)
      if (dfFieldNames.includes('firstName') && dfFieldNames.includes('otherNames')) {
        let fg = defautlFields.find(e => e.fieldName === 'firstName')
        felds.push({
          id: fg ? fg.id : 'field_name',
          field: <div className='flex gap-2'>
            <div className='w-1/2'>
              <label className='text-sm' htmlFor="firstName">First name</label>
              <input type="text" id='firstName' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.firstName} placeholder='First name' className='h-11 px-3 rounded-lg w-full border font-medium text-sm' />
            </div>
            <div className='w-1/2'>
              <label className='text-sm' htmlFor="otherNames">Last name</label>
              <input type="text" id='otherNames' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.otherNames} placeholder='Last name' className='h-11 px-3 w-full rounded-lg border font-medium text-sm' />
            </div>
          </div>
        })
      }
      if (dfFieldNames.includes('email')) {
        const field = defautlFields.find(e => e.variableName === 'email')
        if (field) {
          felds.push({
            id: field.id,
            field: <div className='w-full mt-2'>
              <label className='text-sm' htmlFor="email">Email address</label>
              <input type="email" id='email' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.email} placeholder='Email address' className='h-11 px-3 w-full rounded-lg border font-medium text-sm' />
            </div>
          })
        }
      }
    }
    // generate additional fields
    const additional = fieldItems.filter(e => !e.defaultField).sort((a, b) => a.position - b.position)

    for (let ft of additional) {
      let fieldName = ft.variableName
      if (ft.dataType === 'boolean') {
        felds.push({
          id: ft.id,
          field: <FormControl className='my-2' gap={3} display='flex' alignItems='center'>
            <Switch size={'md'} id={fieldName} isChecked={registerStudentForm.values[fieldName] === "yes"} onChange={(e) => {
              registerStudentForm.setFieldValue(fieldName, e.target.checked ? "yes" : "no")
            }} name={fieldName} />
            <label className='text-sm' htmlFor={fieldName}>{ft.fieldName}</label>
          </FormControl>
        })
      } else if (ft.dataType === 'number') {

        felds.push({
          id: ft.id,
          field: <div>
            <label className='text-sm' htmlFor={fieldName}>{ft.fieldName}{ft.required && <span className='text-red-500 text-xs'>*</span>}</label>
            <input type="number" id={fieldName} name={fieldName} className="bg-gray-50 h-11 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={ft.fieldName} onChange={registerStudentForm.handleChange}
              onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values[fieldName]} />
          </div>
        })
      } else {
        felds.push({
          id: ft.id,
          field: <div className='w-full mt-2'>
            <label className='text-sm' htmlFor={fieldName}>{ft.fieldName}{ft.required && <span className='text-red-500 text-xs'>*</span>}</label>
            <input type="text" id={fieldName} onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values[fieldName]} placeholder={ft.fieldName} className='h-11 px-3 w-full rounded-lg border font-medium text-sm' />
          </div>
        })
      }
    }

    return (<>
      {felds.map((field) => <div key={field.id}>
        {field.field}
      </div>)}
    </>)
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

  const keysToRemove = ["firstName", "otherNames", "email", "agree"]

  // Remove the specified keys
  const additionFieldsValidation = registerStudentForm.errors
  keysToRemove.forEach(key => {
    delete additionFieldsValidation[key]
  })

  const phoneNumber = (params.team?.facebookData?.phoneNumber ? params.team.facebookData.phoneNumber : process.env.NEXT_PUBLIC_WHATSAPP_PHONENUMBER) || ""


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
                I agree to receive this course from {params.team?.name || "Consize"} on WhatsApp
              </span>
            </Checkbox>
          </div>}
          {!verifyPhoneForm.values.completed && <button disabled={!verifyPhoneForm.isValid || verifyPhoneForm.isSubmitting || (!verifyPhoneForm.values.agree && params.tryout)} type='submit' className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-semibold gap-1 disabled:bg-[#1FFF69]/40'>Continue
            {verifyPhoneForm.isSubmitting && <Spinner size={'sm'} />}
          </button>}
        </form>


        <div className={`${verifyPhoneForm.values.completed ? 'min-h-10' : 'h-0 hidden'} transition-all duration-500`}>
          {verifyPhoneForm.values.userFound && verifyPhoneForm.values.user.verified && <div>
            <div className='h-6 mt-3 text-sm'>
              Enrolling as <span className='font-semibold uppercase'>{verifyPhoneForm.values.user.firstName} {verifyPhoneForm.values.user.otherNames}?</span>
            </div>
            <div>
              {params.fields.filter(e => !e.defaultField).length !== 0 ? <div>
                <div className="text-sm font-semibold my-2">The following information are requested by the course managers.</div>
                {generateEnrollForm(params.fields, true)}
              </div> : <></>}
            </div>
            <button onClick={enrollStudentHandler} type='button' disabled={enrollMutation.isPending || Object.keys(additionFieldsValidation).length > 0} className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-medium gap-1 disabled:bg-[#1FFF69]/40'>
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
            <button type='submit' disabled={!completeVerifyPhoneForm.isValid || completeVerifyPhoneForm.isSubmitting || enrollMutation.isPending} className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-medium gap-1 disabled:bg-[#1FFF69]/40'>
              Verify & enroll {(enrollMutation.isPending || completeVerifyPhoneForm.isSubmitting) && <Spinner size={'sm'} />}
            </button>
          </form>}

          {verifyPhoneForm.values.registerationForm && <form className='mt-2' onSubmit={registerStudentForm.handleSubmit}>

            {params.fields.length !== 0 ? generateEnrollForm(params.fields) : <>
              <div className='flex w-full text-sm gap-2'>
                <div className='w-1/2'>
                  <label htmlFor="firstName">First name</label>
                  <input type="text" id='firstName' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.firstName} placeholder='First name' className='h-12 px-3 rounded-lg w-full border font-medium text-sm' />
                </div>
                <div className='w-1/2'>
                  <label htmlFor="otherNames">Last name</label>
                  <input type="text" id='otherNames' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.otherNames} placeholder='Last name' className='h-12 px-3 w-full rounded-lg border font-medium text-sm' />
                </div>
              </div>
              <div className='w-full mt-2'>
                <label htmlFor="email">Email address</label>
                <input type="email" id='email' onChange={registerStudentForm.handleChange} onBlur={registerStudentForm.handleBlur} value={registerStudentForm.values.email} placeholder='Email address' className='h-12 px-3 w-full rounded-lg border font-medium text-sm' />
              </div>
            </>}
            <hr />
            <div className='w-full mt-2'>
              <Checkbox size="md" name='agree' id='agree' onChange={(e) => {
                registerStudentForm.setFieldValue('agree', e.target.checked)
              }} isChecked={registerStudentForm.values.agree}>
                <span className='text-sm'>
                  I agree to receive this course from {params.team?.name || "Consize"} on WhatsApp
                </span>
              </Checkbox>
            </div>
            <button type='submit' disabled={!registerStudentForm.isValid || registerStudentForm.isSubmitting || registerMutation.isPending} className='text-sm rounded-3xl px-10 w-full h-12 mt-2 border items-center justify-center text-black bg-[#1FFF69] flex font-medium gap-1 disabled:bg-[#1FFF69]/40'>
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
              <a href={`https://wa.me/+${phoneNumber}`} target='__blank' className='w-full bg-[#14B8A6] flex gap-1 py-2 rounded-md justify-center text-white items-center'>
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
