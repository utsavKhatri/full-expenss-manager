import React, { Suspense, useEffect, useState } from "react";
import MainTemplate from "./components/maintemplate";
import Loader from "./components/Loader";
import axios from "axios";
import { Box, Button, Flex, Stack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import MainChart from "./components/MainChart";
import { AddIcon, CheckCircleIcon, RepeatClockIcon } from "@chakra-ui/icons";
import MainBalanceChart from "./components/MainBalanceChart";

const dashboard = () => {
  const [analytics, setAnalytics] = useState();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState();
  const [expenses, setExpenses] = useState();
  const [balance, setBalance] = useState();
  const [chartLable, setChartLable] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [intChartData, setIntChartData] = useState([]);
  const [intLabelData, setIntLabelData] = useState([]);
  const [limit, setLimit] = useState(10)
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
        // console.log("this is analytics-> ", res.data);
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
        setChartLable(res.data.listAllTransaction.map((transaction) => {
          return new Date(transaction.createdAt).toDateString();
        }));
        let tempArr = res.data.listAllTransaction.map((transaction) => {
          return new Date(transaction.createdAt).toDateString();
        });
        setIntLabelData(tempArr.slice(0, limit));

        setChartData(res.data.listAllTransaction.map((transaction) => {
          return transaction.amount;
        }));
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
      <Flex justifyContent="center" gap={4} flexDirection={"column"} alignItems={"center"}>
        <Stack spacing={4} direction="row" alignItems="stretch">
          <VStack alignItems="stretch" spacing={4} justifyContent={"space-between"}>
            <Box
              p={8}
              bg={useColorModeValue("gray.50", "gray.900")}
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
              <Text fontWeight="bold" fontSize="5xl">{analytics.listAccounts.length}</Text>
            </Box>
            <Box
              p={8}
              bg={useColorModeValue("gray.50", "gray.900")}
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
            bg={useColorModeValue("white", "gray.700")}
            rounded="lg"
            shadow="lg"
            display="flex"
            alignItems="stretch"
            flexDirection="column"
            borderWidth={1}
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <Flex flexDirection="column" alignItems="flex-start" mb={8}>
              <Text fontWeight="bold" fontSize="xl">
                Total Income
              </Text>
              <Text fontSize="4xl" color="green.500">
                {income}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="flex-start" mb={8}>
              <Text fontWeight="bold" fontSize="xl">
                Total Expense
              </Text>
              <Text fontSize="4xl" color="red.500">
                {expenses}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="flex-start">
              <Text fontWeight="bold" fontSize="xl">
                Total Balance
              </Text>
              <Text fontSize="4xl">{balance}</Text>
            </Flex>
          </Box>
        </Stack>
        <Suspense fallback={<Loader />}>
          <Stack w={"full"} justifyContent={"center"} alignItems={"center"} spacing={4}>
            <Flex w={"75%"} justifyContent={"center"} alignItems={"center"}>
              <MainChart chartLable={intLabelData} chartData={intChartData} />
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
          <Stack w={"full"} justifyContent={"center"} alignItems={"center"} spacing={4}>
              <MainBalanceChart expenses={expenses} income={income} />
          </Stack>
        </Suspense>
      </Flex>
    </MainTemplate>
  );
};

export default dashboard;
