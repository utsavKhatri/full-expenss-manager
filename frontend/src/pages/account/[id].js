import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MainTemplate from "../components/maintemplate";
import { useRouter } from "next/router";
import { Testimonial, TestimonialContent, TestimonialText } from "../homepage";
import { DeleteIcon } from "@chakra-ui/icons";
import AddTranjection from "../components/AddTranjection";
import UpdateTransactions from "../components/UpdateTrans";
import { dataState } from "../../../context";
import BalanceChart from "../components/BalanceChart";
import Loader from "../components/Loader";
import TransactionChart from "../components/TransactionChart";

const account = () => {
  const router = useRouter();

  const { id } = router.query;
  const [shareList, setShareList] = useState();
  const [transData, setTransData] = useState();
  const [isShareModal, setIsShareModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartLable, setChartLable] = useState([]);
  const [email, setEmail] = useState("");
  const { user } = dataState();
  const [sampleAccData, setSampleAccData] = useState();
  const [intLoading, setIntLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chartVisible, setChartVisibale] = useState(false);
  const toast = useToast();

  const fetchAccData = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/editAccount/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data.data);
        setSampleAccData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "visit to homepage, something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        window.location.href = "/";
      });
  };
  const fetchSignleAcc = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/viewTransaction/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setTransData(response.data);
        const newArr = response.data.data.map((element) => {
          return element.amount;
        });
        const newLablelArr = response.data.data.map((element) => {
          return element.text;
        });
        setChartData(newArr);
        setChartLable(newLablelArr);
        setIntLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "visit to homepage, something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        window.location.href = "/";
      });
  };
  const handleShareAcc = () => {
    setIsShareModal(true);
    onOpen();
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/share/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response);
        setShareList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  const handleShareToUser = () => {
    console.log("email to send---> ", email);
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "POST",
      url: `http://localhost:1337/account/share/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        email: email,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          onClose();
          toast({
            title: "Share Successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchSignleAcc();
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const deleteTrans = (tId) => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);

    axios
      .delete(`http://localhost:1337/rmTransaction/${tId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast({
          title: "Transaction Deleted Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSignleAcc();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    fetchSignleAcc();
    fetchAccData();
  }, []);

  return intLoading == true ? (
    <Loader />
  ) : (
    <MainTemplate>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>
            {isShareModal == true
              ? "Share to following user"
              : "add transactions"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Heading size={"sm"} my={"2"} textAlign={"left"} fontSize={"sm"}>
              {" "}
              previosly you sahre account with{" "}
              {shareList &&
                shareList.sharedList.map((v) => {
                  return v.name + ",";
                })}
            </Heading>
            {loading == false && (
              <Select
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              >
                {shareList.users.map(
                  (user) =>
                    user.id !== sampleAccData.owner && (
                      <option value={user.email}>{user.name}</option>
                    )
                )}
              </Select>
            )}
          </ModalBody>
          <ModalFooter>
            <Stack direction={"row"}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleShareToUser}>Share</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex p={4} direction={"column"} gap={5}>
        <Stack
          direction={"row"}
          w={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {user && sampleAccData.owner == user.user.id && (
            <Button
              onClick={handleShareAcc}
              colorScheme={useColorModeValue("blackAlpha", "blue")}
            >
              Share Account
            </Button>
          )}
          <AddTranjection accId={id} fetchSignleAcc={fetchSignleAcc} />
        </Stack>

        <Stack direction={"row"} my={3} justifyContent={"space-evenly"}>
          <Testimonial>
            <TestimonialContent>
              <Heading
                textAlign="center"
                size={"lg"}
                color={useColorModeValue("green", "green.400")}
              >
                {transData.income}
              </Heading>
              <TestimonialText>Income</TestimonialText>
            </TestimonialContent>
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <Heading textAlign="center" size={"lg"} color={"red"}>
                {transData.expenses}
              </Heading>
              <TestimonialText>Expense</TestimonialText>
            </TestimonialContent>
          </Testimonial>
        </Stack>
        {transData.data.length > 0 && (
          <Stack spacing={"8"}>
            <Button
              textTransform={"capitalize"}
              textAlign={"center"}
              color={useColorModeValue("black", "black")}
              backgroundColor={"#ffe100"}
              _hover={{
                backgroundColor: "#ffeb57",
                color: "black",
                boxShadow: "lg",
              }}
              boxShadow="md"
              p="6"
              rounded="md"
              onClick={() => setChartVisibale(!chartVisible)}
            >
              view chart representation
            </Button>

            <Flex
              display={chartVisible ? "flex" : "none"}
              justifyContent={"center"}
              my={2}
              width={"100%"}
              alignItems={"center"}
              direction={"column"}
            >
              <Heading size={"md"} mb={3} textAlign={"center"}>
                previous income and expenss chart
              </Heading>
              <Box justifyContent={"center"} width={"80"}>
                <BalanceChart
                  income={transData.income}
                  expenses={transData.expenses}
                />
              </Box>
            </Flex>

            <Flex
              justifyContent={"center"}
              my={3}
              alignItems={"center"}
              alignSelf={"center"}
              width={{ base: "85%", sm: "100%", md: "75%", lg: "70%" }}
            >
              <TransactionChart chartLable={chartLable} chartData={chartData} />
            </Flex>
          </Stack>
        )}
        <TableContainer my={2} px={3}>
          <Heading size={"lg"} my={2}>
            Recent transactions
          </Heading>
          <Table textAlign={"center"}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Text</Th>
                <Th>Transfer</Th>
                <Th>category</Th>
                <Th isNumeric>Amount</Th>
                <Th width={"-moz-fit-content"} colSpan={2} textAlign={"center"}>
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {transData.data.length > 0 ? (
                transData.data.map((trans, i) => {
                  return (
                    <Tr key={trans.id}>
                      <Td>{i + 1}</Td>
                      <Td>{trans.text}</Td>
                      <Td>{trans.transfer}</Td>
                      <Td>{trans.category}</Td>
                      <Td color={trans.amount < 0 ? "red" : "green"}>
                        {trans.amount}
                      </Td>
                      <Td width={"-moz-fit-content"}>
                        <UpdateTransactions
                          transId={trans.id}
                          fetchSignleAcc={fetchSignleAcc}
                        />
                      </Td>
                      <Td width={"-moz-fit-content"}>
                        <Button
                          onClick={() => deleteTrans(trans.id)}
                          leftIcon={<DeleteIcon />}
                          color={"red.600"}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={6}>No data</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </MainTemplate>
  );
};

export default account;
