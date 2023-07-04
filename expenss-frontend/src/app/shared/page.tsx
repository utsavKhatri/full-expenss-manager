'use client';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { dataState } from '@/context';
import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { FiEye } from 'react-icons/fi';

const SharedAccPage = () => {
  const {
    getRecievedAcc,
    shareAccList,
    signleUser,
    getUserName,
    setSignleUser,
  } = dataState();
  useEffect(() => {
    getRecievedAcc();
  }, []);
  if (shareAccList === undefined) return <Loader />;

  return (
    <SidebarWithHeader>
      <Flex direction="column" gap={2}>
        <Heading size="lg" my={4}>
          Welcome to the Shared Account List
        </Heading>
        <Stack>
          {shareAccList != null ? (
            shareAccList.map((account: any) => (
              <Flex
                p={6}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="md"
                boxShadow="md"
                alignItems="center"
                justifyContent="space-between"
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700'),
                  boxShadow: 'lg',
                }}
                key={account.id}
              >
                <Link href={`/account/${account.id}`}>
                  <Flex direction="column" alignItems="flex-start" flex={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      {account.name}
                    </Text>
                    <Text mt={2}>
                      Account Number:{' '}
                      <Text as="span" fontWeight="bold">
                        **** **** **** {account.id.toString().slice(-4)}
                      </Text>
                    </Text>
                  </Flex>
                </Link>
                {signleUser != null ? (
                  <Text>
                    <Button
                      color={useColorModeValue('gray.500', 'gray.300')}
                      fontSize="sm"
                      onClick={() => setSignleUser(null)}
                    >
                      Shared by : {signleUser.name}
                    </Button>
                  </Text>
                ) : (
                  <Button
                    color={useColorModeValue('gray.500', 'gray.300')}
                    fontSize="sm"
                    rightIcon={<FiEye />}
                    onClick={() => getUserName(account.owner)}
                  >
                    Shared by :
                  </Button>
                )}
              </Flex>
            ))
          ) : (
            <Heading size="md">No shared accounts found</Heading>
          )}
        </Stack>
      </Flex>
    </SidebarWithHeader>
  );
};

export default SharedAccPage;
