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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { dataState } from "../../context";
import MainTemplate from "./components/maintemplate";
import axios from "axios";
import Link from "next/link";
import UpdateAcc from "./components/UpdateAcc";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import Loader from "./components/Loader";

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
    refresh,
    setAccname,
    handleDeleteAcc,
    accname,
  } = dataState();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        } else {
          return console.log("error");
        }
      })
      .catch((error) => {
        return console.log(error);
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
            <Stack direction={"row"}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleCreateAccount}>Create</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box bg={useColorModeValue("gray.100", "gray.900")}>
        <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
          <Stack spacing={0} align={"center"}>
            <Heading>Your Accounts</Heading>
            <Button onClick={onOpen} leftIcon={<AddIcon />}>
              new account
            </Button>
          </Stack>

          <Wrap
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 10, md: 4, lg: 10 }}
            justify='center'
          >
            {data.accData.length ? (
              data.accData.map((v, i) => {
                return (
                  <WrapItem key={i} justifyContent={"center"}>
                    <Stack
                      bg={useColorModeValue("white", "gray.800")}
                      boxShadow={"lg"}
                      p={8}
                      rounded={"xl"}
                      align={"center"}
                      pos={"relative"}
                      key={i + 1}
                    >
                      <Link href={`/account/${v.id}`}>
                        <Heading as={"h3"} fontSize={"xl"} textAlign="center">
                          Name: {v.name}
                        </Heading>
                        <Text
                          textAlign={"center"}
                          color={useColorModeValue("gray.600", "gray.400")}
                          fontSize={"sm"}
                        >
                          Acc. No: {v.id}
                        </Text>
                      </Link>
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        w={"50%"}
                        px={5}
                      >
                        <DeleteIcon
                          color="red"
                          onClick={() => handleDeleteAcc(v.id)}
                        />
                        <UpdateAcc accId={v.id} />
                      </Stack>
                    </Stack>
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
