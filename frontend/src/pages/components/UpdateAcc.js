import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { dataState } from "../../../context";

const UpdateAcc = ({ accId }) => {
  const [name, setName] = useState();
  const [accData, setAccData] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchHomepageData } = dataState();
  const toast = useToast();
  const fetchSingleAcc = () => {
    onOpen();
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/editAccount/${accId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data.data);
        setAccData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateAccData = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "PUT",
      url: `http://localhost:1337/editAccount/${accId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: name,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response);
        fetchSingleAcc();
        fetchHomepageData();
        toast({
          title: "Account updated successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setName(accData.name);
        onClose();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          variant: "left-accent",
          status: "error",
          duration: 2000,
        });
      });
  };
  return (
    <>
      <EditIcon onClick={fetchSingleAcc} color={"blue.400"} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update account details</ModalHeader>
          <ModalCloseButton />

          {accData && (
            <ModalBody>
              <Stack direction={"column"}>
                <FormControl isRequired>
                  <FormLabel>account name text</FormLabel>
                  <Input
                    required
                    defaultValue={accData.name}
                    placeholder="enter account name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
              </Stack>
            </ModalBody>
          )}

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={updateAccData}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateAcc;
