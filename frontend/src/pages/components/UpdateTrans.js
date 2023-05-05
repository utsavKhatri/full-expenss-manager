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
  Select,
  Stack,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditIcon } from "@chakra-ui/icons";

function UpdateTransactions({ transId, fetchSignleAcc }) {
  const [updateTransData, setUpdateTransData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState(updateTransData.text);
  const [amount, setAmount] = useState(updateTransData.amount);
  const [transfer, setTransfer] = useState(updateTransData.transfer);
  const [category, setCategory] = useState(updateTransData.category);
  const toast = useToast();
  const [isIncome, setIsIncome] = useState(true)

  const [catlist, setCatlist] = useState();

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
        console.log("&^$*&^---> ", response.data.data);
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
        isIncome: isIncome
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log("log inside update--->", response);
        if (response.status == 200) {
          fetchSignleAcc();
          toast({
            title: "Transaction Updated",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `Transaction Not Updated, ${error.response.data.message}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
    onClose();
  };
  useEffect(() => {
    axios
      .get("http://localhost:1337/category")
      .then((res) => {
        setCatlist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

                <Select
                  placeholder="category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option
                    value={updateTransData.category && updateTransData.category.id}
                    selected
                  >
                    {updateTransData.category && updateTransData.category.name}
                  </option>
                  {catlist &&
                    catlist.map((v) => {
                      return <option value={v.id}>{v.name}</option>;
                    })}
                </Select>
              </FormControl>
              <FormControl isRequired>
              <FormLabel>Type</FormLabel>

                <Select
                  placeholder="type"
                  onChange={(e) => setIsIncome(e.target.value)}
                >
                  <option value={true}>Income</option>
                  <option value={false}>Expenses</option>
                </Select>
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
