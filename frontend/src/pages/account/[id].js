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
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
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
import {
  AddIcon,
  CheckCircleIcon,
  DeleteIcon,
  MinusIcon,
  RepeatClockIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
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
  const [intChartData, setIntChartData] = useState([]);
  const [intLabelData, setIntLabelData] = useState([]);
  const [chartLable, setChartLable] = useState([]);
  const [email, setEmail] = useState("");
  const [sampleAccData, setSampleAccData] = useState();
  const [intLoading, setIntLoading] = useState(true);
  const [limit, setLimit] = useState(15);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chartVisible, setChartVisibale] = useState(false);
  const toast = useToast();
  const [currentuserData, setCurrentuserData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setRowsPerPage(value);
  };
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
        setTransData(response.data);
        const newArr = response.data.data.map((element) => {
          return element.amount;
        });
        const newLablelArr = response.data.data.map((element) => {
          return element.text;
        });
        setChartData(newArr);
        setIntChartData(newArr.slice(0, limit));
        setChartLable(newLablelArr);
        setIntLabelData(newLablelArr.slice(0, limit));
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

  const handleLoadmore = () => {
    setLimit(limit + 15);
    setIntChartData(chartData.slice(0, limit));
    setIntLabelData(chartLable.slice(0, limit));
  };
  const handleLoadAllMore = () => {
    setIntChartData(chartData);
    setIntLabelData(chartLable);
  };

  const handleLoadLess = () => {
    setLimit(15);
    setIntChartData(chartData.slice(0, limit));
    setIntLabelData(chartLable.slice(0, limit));
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
    if (!localStorage.getItem("userInfo")) {
      window.location.href = "/";
    } else {
      setCurrentuserData(JSON.parse(localStorage.getItem("userInfo")));
      fetchSignleAcc();
      fetchAccData();
    }
  }, []);

  const handleClick = () => {
    if (
      currentPage < Math.ceil(transData && transData.data.length / rowsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(
        Math.ceil(transData && transData.data.length / rowsPerPage)
      );
    }
  };
  const handleDescreased = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(1);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows =
    transData && transData.data.slice(indexOfFirstRow, indexOfLastRow);

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
          {currentuserData &&
            sampleAccData.owner == currentuserData.user.id && (
              <Button
                onClick={handleShareAcc}
                colorScheme={useColorModeValue("blackAlpha", "blue")}
              >
                Share Account
              </Button>
            )}
          <AddTranjection accId={id} fetchSignleAcc={fetchSignleAcc} />
        </Stack>
        <Stack
          direction={{ lg: "row", sm: "column" }}
          spacing={5}
          my={3}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <Stat boxShadow={"md"} p={2}>
            <StatLabel>Income</StatLabel>
            <StatNumber color={useColorModeValue("green", "green.400")}>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(transData.income)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {transData.incomePercentageChange}%
            </StatHelpText>
          </Stat>
          <Stat
            boxShadow={"lg"}
            p={2}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <StatLabel>Total balance</StatLabel>
            <StatNumber color={useColorModeValue("blue.600", "blue.400")}>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(transData.balance)}
            </StatNumber>
          </Stat>
          <Stat boxShadow={"md"} p={2}>
            <StatLabel>Expense</StatLabel>
            <StatNumber color={"red"}>
              {" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(transData.expenses)}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              {transData.expensePercentageChange}%
            </StatHelpText>
          </Stat>
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
              flexDirection={"column"}
              justifyContent={"center"}
              my={3}
              alignItems={"center"}
              alignSelf={"center"}
              width={{ base: "90%", sm: "full", md: "75%", lg: "70%" }}
            >
              <TransactionChart
                chartLable={intLabelData}
                chartData={intChartData}
              />
              <Stack
                direction={"row"}
                my={2}
                spacing={4}
                justifyContent={"space-between"}
              >
                <Button onClick={handleLoadmore}>
                  <AddIcon />
                </Button>
                <Button onClick={handleLoadLess}>
                  <RepeatClockIcon />
                </Button>
                <Button onClick={handleLoadAllMore}>
                  <CheckCircleIcon />
                </Button>
              </Stack>
            </Flex>
          </Stack>
        )}
        <TableContainer
          width={"100%"}
          my={2}
          px={{ base: 1, md: 3 }}
          overflowX={"auto"}
        >
          <Heading size={"lg"} my={2}>
            Recent transactions
          </Heading>

          <Table
            textAlign={"center"}
            size={{ base: "sm", sm: "md", md: "lg" }}
            width={"100%"}
            overflowX={"auto"}
          >
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Text</Th>
                <Th>Transfer</Th>
                <Th>Category</Th>
                <Th isNumeric>Amount</Th>
                <Th width={"-moz-fit-content"} colSpan={2} textAlign={"center"}>
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentRows.map((trans, i) => {
                return (
                  <Tooltip
                    label={`last updated by ${trans.updatedBy.name}`}
                    key={trans.id}
                  >
                    <Tr>
                      <Td flexDirection={"row"} alignItems={"center"}>
                        {i + 1 + (currentPage - 1) * rowsPerPage}
                      </Td>
                      <Td>{trans.text}</Td>
                      <Td>{trans.transfer}</Td>
                      <Td>{trans.category.name}</Td>
                      <Td color={trans.amount < 0 ? "red" : "green"}>
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(trans.amount)}
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
                  </Tooltip>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Flex
            flexDirection={"row"}
            justifyContent={"flex-start"}
            alignItems={"center"}
          >
            <Button size={"sm"} onClick={handleClick}>
              <AddIcon />
            </Button>
            <Button
              rounded={"full"}
              justifyContent={"center"}
              alignItems={"center"}
              size={"sm"}
              backgroundColor={"azure"}
              boxShadow={"md"}
            >
              {currentPage}
            </Button>
            <Button size={"sm"} onClick={handleDescreased}>
              <MinusIcon />
            </Button>
          </Flex>
          <Stack>
            <Select
              placeholder="items per page"
              onChange={(e) => handleRowsPerPageChange(e)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value={transData.data.length}>All</option>
            </Select>
          </Stack>
        </Flex>
      </Flex>
    </MainTemplate>
  );
};

export default account;
