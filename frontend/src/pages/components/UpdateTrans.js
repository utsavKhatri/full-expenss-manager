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
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { EditIcon } from "@chakra-ui/icons";

function UpdateTransactions({ transId, fetchSignleAcc }) {
  const [updateTransData, setUpdateTransData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState(updateTransData.text);
  const [amount, setAmount] = useState(updateTransData.amount);
  const [transfer, setTransfer] = useState(updateTransData.transfer);
  const [category, setCategory] = useState(updateTransData.category);

  const updateTransactionGet = () => {
    onOpen();
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/editTransaction/${transId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        setUpdateTransData(response.data.data);
        if (isOpen) {
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(updateTransData);
    onOpen();
  };
  const updateTransaction = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "PUT",
      url: `http://localhost:1337/editTransaction/${transId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        text: text,
        amount: amount,
        category: category,
        transfer: transfer,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log("log inside update--->", response);
        if (response.status == 200) {
          fetchSignleAcc();
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    onClose();
  };

  return (
    <>
      <Button
        onClick={updateTransactionGet}
        color={"blue.400"}
        leftIcon={<EditIcon />}
      >
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction={"column"}>
              <FormControl isRequired>
                <FormLabel>transaction text</FormLabel>
                <Input
                  required
                  defaultValue={updateTransData.text}
                  placeholder="enter transaction text"
                  onChange={(e) => setText(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  required
                  defaultValue={updateTransData.amount}
                  placeholder="enter amount in digit"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>transfer</FormLabel>
                <Input
                  defaultValue={updateTransData.transfer}
                  placeholder="enter name where tranfer"
                  onChange={(e) => setTransfer(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>category</FormLabel>
                <Input
                  defaultValue={updateTransData.category}
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
            <Button onClick={updateTransaction}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateTransactions;
