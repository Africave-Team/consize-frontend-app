import { Box, useRadio } from '@chakra-ui/react'

export default function RadioCard (props: any) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box className='w-1/2 h-10 flex justify-center items-center' as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='0px'
        borderRadius='md'
        className='flex capitalize border'
        justifyContent={"center"}
        alignItems={"center"}
        w={"100%"}
        boxShadow='sm'
        _checked={{
          bg: '#0D1F23',
          color: 'white',
          borderColor: '#0D1F23',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}