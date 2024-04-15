import 'react-phone-number-input/style.css'
import PhoneNumberInput from 'react-phone-number-input'
import React from 'react'

export default function PhoneInput ({ onChange, value, disabled }: { onChange: (value: string) => void, value: string, disabled?: boolean }) {

  return (
    <>
      <PhoneNumberInput
        placeholder="Enter phone number"
        className='bg-gray-50 w-full h-12 font-medium border px-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg'
        defaultCountry='NG'
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
    </>
  )
}
