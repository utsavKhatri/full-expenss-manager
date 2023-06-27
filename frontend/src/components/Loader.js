import { Flex, useColorMode } from '@chakra-ui/react'
import React from 'react'
import ScaleLoader from 'react-spinners/ScaleLoader'

const Loader = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex w={"100%"} justifyContent={"center"} alignItems={"center"} h={'100vh'}>
    <ScaleLoader color={colorMode==='light'?'#000000':'#ffffff'}/>
    </Flex>
  )
}

export default Loader