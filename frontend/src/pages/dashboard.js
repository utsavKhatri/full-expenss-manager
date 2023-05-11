import React, { useEffect, useState } from "react";
import MainTemplate from "./components/maintemplate";
import Loader from "./components/Loader";
import axios from "axios";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";

const dashboard = () => {
  const [analytics, setAnalytics] = useState();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState();
  const [expenses, setExpenses] = useState();
  const [balance, setBalance] = useState();

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
        })
        console.log("Income, Expenses, Balance",tempIncome, tempExpenses, tempBalance);
        setIncome(tempIncome);
        setExpenses(tempExpenses);
        setBalance(tempBalance);
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

  return loading == true ? (
    <Loader />
  ) : (
    <MainTemplate>
      <Flex justifyContent={"center"}>
        <Stack spacing={4} direction={"row"}>
          <Box p={4} boxShadow={"lg"} rounded={"lg"}>
            Total Accounts: {
              analytics.listAccounts.length
            }
          </Box>
          <Box p={4} boxShadow={"lg"} rounded={"lg"}>
            Total Transactions: {
              analytics.listAllTransaction.length
            }</Box>
          <Box p={4} boxShadow={"lg"} rounded={"lg"}>
            <Stack>
              <Text>
                Total Income: {
                  income
                }
              </Text>
              <Text>
                Total Expense: {
                  expenses
                }
              </Text>
              <Text>
                Total balance: {
                  balance
                }
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </MainTemplate>
  );
};

export default dashboard;
