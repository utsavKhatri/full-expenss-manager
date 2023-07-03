'use client';

import Loader from '@/components/Loader';
import { dataState } from '@/context';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Suspense } from 'react';

const page = () => {
  const { handleLogin, loginLoading } = dataState();

  return (
    <Suspense fallback={<Loader />}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.900')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'lg'}
            p={8}
          >
            <Stack spacing={4} as={'form'} onSubmit={(e) => handleLogin(e)}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" required/>
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" required/>
              </FormControl>
              <Stack spacing={4} my={3}>
                <Stack
                  direction={'row'}
                  align={{ base: 'start', md: 'center' }}
                  justify={'space-between'}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={'blue.400'} href="/auth/signup">
                    Signup
                  </Link>
                </Stack>
                <Button
                  bg={'blue.600'}
                  color={'white'}
                  type="submit"
                  _hover={{
                    bg: 'blue.700',
                  }}
                  isLoading={loginLoading}
                  loadingText={'performing blockchain transaction...'}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Suspense>
  );
};

export default page;
