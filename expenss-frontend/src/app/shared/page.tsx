'use client';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { dataState } from '@/context';
import {
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';

const SharedAccPage = () => {
  const { data } = dataState();
  if (data == undefined) return <Loader />;

  return (
    <SidebarWithHeader>
      <Flex direction="column" gap={2}>
        <Heading size="lg" my={4}>
          Welcome to the Shared Account List
        </Heading>
        <Stack>
          {data ? (
            data?.sharedAccounts.map((account: any, index: number) => (
              <Flex
                key={account.id}
                p={4}
                bg={useColorModeValue('white', 'gray.800')}
                borderWidth={1}
                borderRadius="md"
                alignItems="center"
                justifyContent="space-between"
              >
                <Link href={`/account/${account.id}`}>
                  <Text fontSize="xl">{account.name}</Text>
                  <Text>Owner: {account.owner.name}</Text>
                </Link>
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
