'use client';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { dataState } from '@/context';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Key, useEffect } from 'react';

export default function Home() {
  const {
    handleCreateAccount,
    data,
    fetchHomepageData,
    handleDeleteAcc,
    searchResult,
  } = dataState();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (Cookies.get('userInfo')) {
      fetchHomepageData();
    } else {
      router.push('/auth/login');
    }
  }, []);

  return (
    <SidebarWithHeader isShow={true}>
      <Modal onClose={onClose} isOpen={isOpen} isCentered >
        <ModalOverlay />
        <ModalContent bg={useColorModeValue('gray.100', 'gray.900')}>
          <ModalHeader>create new account</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            as={'form'}
            onSubmit={(e) => handleCreateAccount(e, onClose)}
            display={'flex'}
            flexDirection={'column'}
            gap={3}
            bg={useColorModeValue('gray.100', 'gray.900')}
          >
            <Input placeholder="account name" name="accName" />
            <Button type="submit">Create</Button>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        bg={useColorModeValue('gray.100', 'gray.900')}
        suppressHydrationWarning
      >
        <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
          {searchResult && (
            <Flex
              align={'center'}
              flexDirection={'column'}
              width={'100%'}
              gap={4}
            >
              <Heading size={'sm'}>Search result</Heading>
              {searchResult.map(
                (
                  result: {
                    account: any;
                    text: string | number | boolean | null | undefined;
                    transfer: string | number | boolean | null | undefined;
                    category: string | number | boolean | null | undefined;
                  },
                  i: number
                ) => (
                  <WrapItem key={i} justifyContent={'center'} width={'100%'}>
                    <Stack
                      bg={useColorModeValue('white', '#1c1c1c')}
                      boxShadow={'sm'}
                      px={5}
                      py={3}
                      rounded={'md'}
                      borderBlock={'HighlightText'}
                      borderWidth={'thin'}
                      borderColor={useColorModeValue('navy', 'lime')}
                      _hover={{
                        shadow: 'lg',
                        bg: useColorModeValue('white', 'gray.800'),
                        color: useColorModeValue('black', 'white'),
                        borderWidth: 1,
                        borderBlockColor: useColorModeValue('black', 'white'),
                      }}
                      align={'center'}
                      pos={'relative'}
                      width={'75%'}
                      key={i + 1}
                    >
                      <Link href={`/account/${result.account}`}>
                        <Flex
                          flexDirection={{ base: 'column', md: 'row' }}
                          gap={3}
                          alignItems={'center'}
                          justifyContent={'space-evenly'}
                        >
                          <Text as={'h3'} fontSize={'md'} textAlign="center">
                            Text: {result.text}
                          </Text>
                          <Text
                            textAlign={'center'}
                            color={useColorModeValue('gray.600', 'gray.400')}
                            fontSize={'sm'}
                          >
                            Tranfer: {result.transfer}
                          </Text>
                          <Text
                            textAlign={'center'}
                            color={useColorModeValue('gray.600', 'gray.400')}
                            fontSize={'sm'}
                          >
                            Category: {result.category}
                          </Text>
                        </Flex>
                      </Link>
                    </Stack>
                  </WrapItem>
                )
              )}
            </Flex>
          )}
          <Stack spacing={0} align={'center'}>
            <Heading>Your Accounts</Heading>
            <Button onClick={onOpen} leftIcon={<AddIcon />}>
              new account
            </Button>
          </Stack>

          <Wrap
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 10, md: 4, lg: 10 }}
            py={{ base: 5, md: 3 }}
            justify="center"
          >
            {data && data.accData.length ? (
              data.accData.map((v: any, i: Key | null | undefined) => {
                return (
                  <AccountCard
                    key={i}
                    account={v}
                    handleDeleteAcc={handleDeleteAcc}
                  />
                );
              })
            ) : (
              <Loader />
            )}
          </Wrap>
        </Container>
      </Box>
    </SidebarWithHeader>
  );
}

const AccountCard = ({
  account,
  handleDeleteAcc,
}: {
  account: any;
  handleDeleteAcc: any;
}) => {
  const textColor = useColorModeValue('black', 'white');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('gray.300', 'gray.600');
  const cardInfoColor = useColorModeValue('gray.500', 'gray.300');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.800');

  return (
    <WrapItem justifyContent="center">
      <Box
        width="100%"
        maxWidth="400px"
        height="auto"
        bg={bgColor}
        boxShadow="md"
        borderRadius="lg"
        overflow="hidden"
        _hover={{
          boxShadow: 'lg',
        }}
      >
        <Link
          href={`/account/${account.id}`}
          style={{ textDecoration: 'none' }}
        >
          <Box width="100%" height="40px" bg={cardBgColor} />
          <Box p={4}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={cardInfoColor}
              textTransform="uppercase"
            >
              CARD NUMBER
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mt={1}
              letterSpacing="0.01em"
              textTransform="uppercase"
              color={textColor}
            >
              **** **** **** {account.id.slice(-4)}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={cardInfoColor}
              textTransform="uppercase"
              mt={4}
            >
              CARD HOLDER
            </Text>
            <Text
              fontSize="xs"
              fontWeight="bold"
              mt={1}
              textTransform="uppercase"
              color={textColor}
            >
              {account.name}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={cardInfoColor}
              textTransform="uppercase"
              mt={4}
            >
              BALANCE
            </Text>
            <Text
              fontSize="xs"
              fontWeight="bold"
              mt={1}
              textTransform="uppercase"
              color={textColor}
            >
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(account.balance.toFixed(2))}
            </Text>
          </Box>
        </Link>

        <Box
          width="100%"
          height="40px"
          px={4}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          opacity={0}
          transition="opacity 0.2s ease-in-out"
          _hover={{
            opacity: 1,
            bg: hoverBgColor,
          }}
        >
          <IconButton
            icon={<DeleteIcon />}
            color="red"
            background="none"
            aria-label="Delete account"
            onClick={() => handleDeleteAcc(account.id)}
          />
        </Box>
      </Box>
    </WrapItem>
  );
};
