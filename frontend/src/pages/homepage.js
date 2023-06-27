import {
  Box,
  Heading,
  Text,
  Stack,
  Container,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Wrap,
  WrapItem,
  useToast,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { dataState } from '../../context';
import MainTemplate from '../components/maintemplate';
import axios from 'axios';
import Link from 'next/link';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import Loader from '../components/Loader';

export const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

export const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {children}
    </Stack>
  );
};

export const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  );
};

export const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}
    >
      {children}
    </Text>
  );
};

const Homepage = () => {
  const {
    fetchHomepageData,
    loading,
    data,
    setRefresh,
    refresh,
    setAccname,
    handleDeleteAcc,
    accname,
    searchResult,
  } = dataState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleCreateAccount = async () => {
    const user = Cookies.get('userInfo');
    const { token } = JSON.parse(user);

    const options = {
      method: 'POST',
      url: 'http://localhost:1337/addAccount',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: accname,
      },
    };
    await axios
      .request(options)
      .then((response) => {
        // console.log(response);
        if (response.status == 201) {
          setRefresh(!refresh);
          setAccname('');
          onClose();
          toast({
            title: 'Account created successfully',
            variant: 'left-accent',
            status: 'success',
            duration: 2000,
          });
        } else {
          toast({
            title: 'Account creation failed',
            variant: 'left-accent',
            status: 'error',
            duration: 2000,
          });
        }
      })
      .catch((error) => {
        toast({
          title: error.response.data.message,
          variant: 'left-accent',
          status: 'error',
          duration: 2000,
        });
      });
    return onClose();
  };
  useEffect(() => {
    fetchHomepageData();
  }, [refresh]);

  return loading == true ? (
    <Loader />
  ) : (
    <MainTemplate>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>create new account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="account name"
              value={accname}
              onChange={(e) => setAccname(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Stack direction={'row'}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleCreateAccount}>Create</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box bg={useColorModeValue('gray.100', 'gray.900')}>
        <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
          {searchResult && (
            <Flex
              spacing={0}
              align={'center'}
              flexDirection={'column'}
              width={'100%'}
              gap={4}
            >
              <Heading size={'sm'}>Search result</Heading>
              {searchResult.map((result, i) => (
                <WrapItem key={i} justifyContent={'center'} width={'100%'}>
                  <Stack
                    bg={useColorModeValue('white', 'gray.800')}
                    boxShadow={'sm'}
                    px={5}
                    py={3}
                    rounded={'md'}
                    borderBlock={'HighlightText'}
                    borderWidth={'thin'}
                    borderColor={useColorModeValue('navy', 'lime')}
                    _hover={{
                      shadow: 'lg',
                      bg: useColorModeValue('white', 'gray.700'),
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
              ))}
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
            {data.accData.length ? (
              data.accData.map((v, i) => {
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
    </MainTemplate>
  );
};

export default Homepage;

const AccountCard = ({ account, handleDeleteAcc }) => {
  const textColor = useColorModeValue('black', 'white');
  const bgColor = useColorModeValue('gray.100', 'gray.700');
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
