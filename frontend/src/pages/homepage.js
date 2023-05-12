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
  Highlight,
  IconButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { dataState } from "../../context";
import MainTemplate from "./components/maintemplate";
import axios from "axios";
import Link from "next/link";
import UpdateAcc from "./components/UpdateAcc";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import Loader from "./components/Loader";
import AddBalanceModal from "./components/AddBalanceModal";

export const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

export const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  );
};

export const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={"h3"} fontSize={"xl"}>
      {children}
    </Heading>
  );
};

export const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("gray.600", "gray.400")}
      fontSize={"sm"}
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
    setSearchResult,
  } = dataState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleCreateAccount = async () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);

    const options = {
      method: "POST",
      url: "http://localhost:1337/addAccount",
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
        console.log(response);
        if (response.status == 201) {
          setRefresh(!refresh);
          setAccname("");
          onClose();
          toast({
            title: "Account created successfully",
            variant: "left-accent",
            status: "success",
            duration: 2000,
          });
        } else {
          toast({
            title: "Account creation failed",
            variant: "left-accent",
            status: "error",
            duration: 2000,
          });
        }
      })
      .catch((error) => {
        toast({
          title: error.response.data.message,
          variant: "left-accent",
          status: "error",
          duration: 2000,
        });
      });
    return onClose();
  };
  useEffect(() => {
    fetchHomepageData();
  }, [refresh]);

  const generateRandomGradient = () => {
    const schemes = [
      ['#d9d9d9', '#b3b3b3'],
      ['#E9E9E9', '#F6F6F6'],
      ['#bcc6cc', '#eee'],
    ];
    const randomScheme = schemes[Math.floor(Math.random() * schemes.length)];
    const gradient = `linear-gradient(to right bottom, ${randomScheme[0]}, ${randomScheme[1]})`;
    return gradient;
  };





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
            <Stack direction={"row"}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleCreateAccount}>Create</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box bg={useColorModeValue("gray.100", "gray.900")}>
        <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
          {searchResult && (
            <Flex
              spacing={0}
              align={"center"}
              flexDirection={"column"}
              width={"100%"}
              gap={4}
            >
              <Heading size={"sm"}>Search result</Heading>

              {searchResult.map((result, i) => (
                <WrapItem key={i} justifyContent={"center"} width={"100%"}>
                  <Stack
                    bg={useColorModeValue("white", "gray.800")}
                    boxShadow={"sm"}
                    px={5}
                    py={3}
                    rounded={"md"}
                    borderBlock={"HighlightText"}
                    borderWidth={"thin"}
                    borderColor={useColorModeValue("navy", "lime")}
                    _hover={{
                      shadow: "lg",
                      bg: useColorModeValue("white", "gray.700"),
                      color: useColorModeValue("black", "white"),
                      borderWidth: 1,
                      borderBlockColor: useColorModeValue("black", "white"),
                    }}
                    align={"center"}
                    pos={"relative"}
                    width={"75%"}
                    key={i + 1}
                  >
                    <Link href={`/account/${result.account}`}>
                      <Flex
                        flexDirection={"row"}
                        gap={3}
                        alignItems={"center"}
                        justifyContent={"space-evenly"}
                      >
                        <Text as={"h3"} fontSize={"md"} textAlign="center">
                          Text: {result.text}
                        </Text>
                        <Text
                          textAlign={"center"}
                          color={useColorModeValue("gray.600", "gray.400")}
                          fontSize={"sm"}
                        >
                          Tranfer: {result.transfer}
                        </Text>
                        <Text
                          textAlign={"center"}
                          color={useColorModeValue("gray.600", "gray.400")}
                          fontSize={"sm"}
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
          <Stack spacing={0} align={"center"}>
            <Heading>Your Accounts</Heading>
            <Button onClick={onOpen} leftIcon={<AddIcon />}>
              new account
            </Button>
          </Stack>

          <Wrap
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 10, md: 4, lg: 10 }}
            justify="center"
          >
            {data.accData.length ? (
              data.accData.map((v, i) => {
                return (
                  <WrapItem key={i} justifyContent={"center"}>
                    <Box
                      width={"400px"}
                      height={"250px"}
                      bg={generateRandomGradient}
                      boxShadow={"xl"}
                      borderRadius={"xl"}
                      borderColor={useColorModeValue("navy", "lime")}
                      pos={"relative"}
                      color={useColorModeValue("black", "white")}
                      key={i + 1}
                      overflow="hidden"
                      _hover={{
                        boxShadow: "dark-lg",
                      }}
                    >
                      <Link
                        href={`/account/${v.id}`}
                      >
                        <Box
                          width={"100%"}
                          height={"40px"}
                          bg={"linear-gradient(to right bottom, #7d7d7d, #555555)"}
                          pos={"absolute"}
                          top={0}
                          left={0}
                          zIndex={-1}
                          borderBottomLeftRadius={"xl"}
                          borderBottomRightRadius={"xl"}
                        />
                        <Box pos="absolute" bottom={8} left={8}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="wider"
                            color={useColorModeValue("black", "white")}
                            textTransform="uppercase"
                          >
                            Card Number
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            mt={1}
                            color={useColorModeValue("black", "white")}
                            fontFamily="OCR A Std, monospace"
                            letterSpacing="0.01em"
                            textTransform="uppercase"
                          >
                            **** **** **** {v.id.slice(-4)}
                          </Text>
                        </Box>

                        <Box pos="absolute" bottom={8} right={8}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            letterSpacing="wider"
                            color={useColorModeValue("black", "white")}
                            textTransform="uppercase"
                          >
                            Valid Thru
                          </Text>
                          <Text
                            fontSize="18px"
                            fontWeight="bold"
                            mt={1}
                            color={useColorModeValue("black", "white")}
                            textTransform="uppercase"
                          >
                            12/23
                          </Text>
                        </Box>
                        <Box pos="absolute" top={4} left={4}>
                          <Text
                            fontSize="12px"
                            fontWeight="bold"
                            mt={1}
                            color={useColorModeValue("black", "white")}
                            textTransform="uppercase"
                          >
                            CARD HOLDER
                          </Text>
                          <Text
                            fontSize="12px"
                            fontWeight="bold"
                            mt={1}
                            color={useColorModeValue("black", "white")}
                            textTransform="uppercase"
                          >
                            {v.name}
                          </Text>
                        </Box>
                        <Box pos="absolute" top={4} right={4}>
                          <Text
                            fontSize="12px"
                            fontWeight="bold"
                            mt={1}
                            color={useColorModeValue("black", "white")}
                            textTransform="uppercase"
                          >
                            BALANCE
                          </Text>
                          <Text
                            fontSize="12px"
                            fontWeight="bold"
                            mt={1}
                            color={useColorModeValue("black", "white")}
                            textTransform="uppercase"
                          >
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(v.balance.toFixed(2))}
                          </Text>
                        </Box>
                      </Link>
                      <Box
                        pos="absolute"
                        bottom={0}
                        left={0}
                        width="100%"
                        height="40px"
                        px={6}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        opacity={0}
                        transition="opacity 0.2s ease-in-out"
                        _hover={{
                          opacity: 1,
                          bg: useColorModeValue("gray.150", "gray.800"),
                          borderTopLeftRadius: "0",
                          borderTopRightRadius: "0",
                          borderBottomLeftRadius: "xl",
                          borderBottomRightRadius: "xl",
                        }}
                      >
                        <IconButton
                          icon={<DeleteIcon />}
                          color={"red"}
                          background={"none"} aria-label="Delete account"
                          onClick={() => handleDeleteAcc(v.id)}
                        />
                        <UpdateAcc accId={v.id} />
                        <AddBalanceModal accId={v.id} />
                      </Box>
                    </Box>
                  </WrapItem>

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





