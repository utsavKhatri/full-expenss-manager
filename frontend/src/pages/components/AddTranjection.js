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
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { dataState } from "../../../context";
import axios from "axios";

function AddTranjection({accId, fetchSignleAcc}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState("");
  const [amount, setAmount] = useState();
  const [transfer, setTransfer] = useState("");
  const [category, setCategory] = useState("");
  const handleCreateTrans = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "POST",
      url: `http://localhost:1337/addTransaction/${accId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        text: text,
        amount: amount,
        transfer: transfer,
        category: category,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response);
        fetchSignleAcc();
        if(response.status ==201){
          fetchSignleAcc();
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Button colorScheme="whatsapp" onClick={onOpen}> + new transaction</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction={"column"}>
              <FormControl isRequired>
                <FormLabel>transaction text</FormLabel>
                <Input
                  required
                  placeholder="enter transaction text"
                  onChange={(e) => setText(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  required
                  placeholder="enter amount in digit"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>transfer</FormLabel>
                <Input
                  placeholder="enter name where tranfer"
                  onChange={(e) => setTransfer(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>category</FormLabel>
                <Input
                  placeholder="category"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleCreateTrans}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTranjection;
