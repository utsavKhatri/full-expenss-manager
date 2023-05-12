import React, { Suspense, useEffect, useState } from "react";
import MainTemplate from "./components/maintemplate";
import Loader from "./components/Loader";
import axios from "axios";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Skeleton,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import MainChart from "./components/MainChart";
import { AddIcon, CheckCircleIcon, RepeatClockIcon } from "@chakra-ui/icons";
import MainBalanceChart from "./components/MainBalanceChart";
import { BiDownArrow } from "react-icons/bi";

const dashboard = () => {
  const [analytics, setAnalytics] = useState();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState();
  const [expenses, setExpenses] = useState();
  const [balance, setBalance] = useState();
  const [chartLable, setChartLable] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [listIncome, setListIncome] = useState([]);
  const [listBalance, setListBalance] = useState([]);
  const [intChartData, setIntChartData] = useState([]);
  const [intLabelData, setIntLabelData] = useState([]);
  const [incomePercentageChange, setIncomePercentageChange] = useState();
  const [expensePercentageChange, setExpensePercentageChange] = useState();

  const [width, setWidth] = useState("100%");
  const [limit, setLimit] = useState(10);
  const [height, setHeight] = useState("50vh");
  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    axios
      .get("http://localhost:1337/dahsboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("this is analytics-> ", res.data);
        setAnalytics(res.data);
        setLoading(false);
        let tempIncome = 0;
        let tempExpenses = 0;
        let tempBalance = 0;
        res.data.analyticsData.map((account) => {
          tempIncome += account.income;
          tempExpenses += account.expense;
          tempBalance += account.balance;
        });
        setIncome(tempIncome);
        setExpenses(tempExpenses);
        setBalance(tempBalance);
        setChartLable(
          res.data.listAllTransaction.map((transaction) => {
            return new Date(transaction.createdAt).toDateString();
          })
        );
        setListBalance(
          res.data.analyticsData.map((account) => {
            return account.balance;
          })
        );
        setListIncome(
          res.data.analyticsData.map((account) => {
            return `Balance: ${account.balance.toFixed(
              2
            )}, Income: ${account.income.toFixed(2)}, Expense: ${account.expense
              }`;
          })
        );
        let tempArr = res.data.listAllTransaction.map((transaction) => {
          return new Date(transaction.createdAt).toDateString();
        });

        setIntLabelData(tempArr.slice(0, limit));

        setChartData(
          res.data.listAllTransaction.map((transaction) => {
            return transaction.amount;
          })
        );
        let tempArr1 = res.data.listAllTransaction.map((transaction) => {
          return transaction.amount;
        });
        setIntChartData(tempArr1.slice(0, limit));
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

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

  return loading == true ? (
    <Loader />
  ) : (
    <MainTemplate>
      <Flex
        justifyContent="center"
        gap={4}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Stack spacing={4} w={{ base: "full", md: "auto" }} direction={{ base: "column", md: "row" }} alignItems="stretch" >
          <VStack
            alignItems="stretch"
            spacing={4}
            justifyContent={"space-between"}
          >
            <Box
              p={8}
              bg={useColorModeValue("gray.50", "gray.700")}
              rounded="lg"
              shadow="lg"
              display="flex"
              alignItems="center"
              height={"full"}
              justifyContent="center"
              flexDirection="column"
            >
              <Text fontWeight="bold" fontSize="xl" mb={2}>
                Total Accounts
              </Text>
              <Text fontWeight="bold" fontSize="5xl">
                {analytics.listAccounts.length}
              </Text>
            </Box>
            <Box
              p={8}
              bg={useColorModeValue("gray.50", "gray.700")}
              rounded="lg"
              shadow="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Text fontWeight="bold" fontSize="xl" mb={2}>
                Total Transactions
              </Text>
              <Text fontSize="2xl">{analytics.listAllTransaction.length}</Text>
            </Box>
          </VStack>
          <Box
            p={8}
            bg={useColorModeValue("white", "gray.800")}
            rounded="lg"
            shadow="lg"
            display="flex"
            alignItems="stretch"
            flexDirection="column"
            borderWidth={1}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Flex flexDirection="column" alignItems="flex-start" mb={8}>
              <Text fontWeight="bold" fontSize="xl">
                Total Income
              </Text>
              <Stat>
                <Text fontSize="4xl" color={useColorModeValue("green.500", "green.200")}>
                  {income.toFixed(2)}
                </Text>
                <Suspense fallback={<Skeleton />}>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {getIncomePercentageChange(analytics)}%
                  </StatHelpText>
                </Suspense>
              </Stat>
            </Flex>
            <Flex flexDirection="column" alignItems="flex-start" mb={8}>
              <Text fontWeight="bold" fontSize="xl">
                Total Expense
              </Text>
              <Stat>
                <Text fontSize="4xl" color="red.500">
                  {expenses.toFixed(2)}
                </Text>
                <Suspense fallback={<Skeleton />}>
                  <StatHelpText>
                    <StatArrow type="increase" color={"red.500"} />
                    {getExpensePercentageChange(analytics)}%
                  </StatHelpText>
                </Suspense>
              </Stat>
            </Flex>
            <Flex flexDirection="column" alignItems="flex-start">
              <Text fontWeight="bold" fontSize="xl">
                Total Balance
              </Text>
              <Text fontSize="4xl">{balance.toFixed(2)}</Text>
            </Flex>
          </Box>
        </Stack>
        <Suspense fallback={<Loader />}>
          <Accordion w={"100%"} allowMultiple>
            <AccordionItem w={"100%"}>
              <AccordionButton
                p={5}
                bg={useColorModeValue("gray.50", "gray.900")}
                rounded="lg"
                roundedBottom={"none"}
                shadow="lg"
                display="flex"
                alignItems="center"
                height={"full"}
                justifyContent="center"
              >
                <Box as="span" flex="1" textAlign="left">
                  View Transactions achart
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack
                  w={"full"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={4}
                >
                  <Flex
                    w={"75%"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <MainChart
                      chartLable={intLabelData}
                      chartData={intChartData}
                    />
                  </Flex>
                  <Stack
                    direction={"row"}
                    my={2}
                    spacing={4}
                    justifyContent={"center"}
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
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem w={"100%"}>
              <AccordionButton
                p={5}
                bg={useColorModeValue("gray.50", "gray.900")}
                rounded="lg"
                roundedTop={"none"}
                shadow="lg"
                display="flex"
                alignItems="center"
                height={"full"}
                justifyContent="center"
              >
                <Box as="span" flex="1" textAlign="left">
                  View Income expense chart
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={4}
                >
                  <MainBalanceChart
                    chartLable={listIncome}
                    chartData={listBalance}
                  />
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Suspense>
      </Flex>
    </MainTemplate>
  );
};

export const getExpensePercentageChange = (data) => {
  let expensePercentageChange = 0;
  let length = data.analyticsData.length;
  data.analyticsData.map((account) => {
    expensePercentageChange += account.expensePercentageChange;
  });
  console.log(expensePercentageChange);
  return (expensePercentageChange / length).toFixed(2);
};
export const getIncomePercentageChange = (data) => {
  let incomePercentageChange = 0;
  let length = data.analyticsData.length;
  data.analyticsData.map((account) => {
    incomePercentageChange += account.incomePercentageChange;
  });
  return (incomePercentageChange / length).toFixed(2);
};

export default dashboard;
