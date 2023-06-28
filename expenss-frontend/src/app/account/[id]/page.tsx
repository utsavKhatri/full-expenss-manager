'use client';
import { useEffect } from 'react';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { dataState } from '@/context';
import TableComp from '@/components/TableComp';
import {
  Box,
  Button,
  Flex,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import ApexTransactionChart from '@/components/charts/ApexTransactionChart';
import BalanceChart from '@/components/charts/BalanceChart';
import AddBalance from '@/components/AddBalance';
import AccountShare from '@/components/AccountShare';

const page = ({ params }: { params: { id: string } }) => {
  const {
    fetchSignleAcc,
    fetchAccData,
    accPageLoading,
    sampleAccData,
    transData,
    chartLable,
    chartData,
    getCatData,
    currentuserData,
    chartVisible,
    setChartVisibale,
  } = dataState();
  useEffect(() => {
    fetchSignleAcc(params.id);
    fetchAccData(params.id);
    getCatData();
  }, [params.id, fetchSignleAcc, fetchAccData, getCatData]);

  return accPageLoading ? (
    <Loader />
  ) : (
    <SidebarWithHeader>
      <VStack>
        <Flex flexDirection="column" w="100%">
          <Stack
            direction="row"
            w="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            {currentuserData &&
              sampleAccData.owner == currentuserData.user.id && (
                <AccountShare id={transData.accountId} />
              )}
            <AddBalance accID={transData.accountId} />
          </Stack>
          <AccountPageStat transData={transData} />
          {transData.data.length > 0 && (
            <>
              <Button
                textTransform={'capitalize'}
                textAlign={'center'}
                color={useColorModeValue('black', 'black')}
                backgroundColor={'#ffe100'}
                _hover={{
                  backgroundColor: '#ffeb57',
                  color: 'black',
                  boxShadow: 'lg',
                }}
                boxShadow="md"
                p="6"
                mb={5}
                rounded="md"
                onClick={() => setChartVisibale(!chartVisible)}
              >
                view chart representation
              </Button>
              {chartVisible && (
                <Flex
                  flexDirection={{ base: 'column', md: 'row' }}
                  justifyContent={{ base: 'center', md: 'space-evenly' }}
                  alignItems="center"
                  width="100%"
                  gap={3}
                >
                  <Box w={{ base: '100%', md: '45%' }} justifySelf={'center'}>
                    <BalanceChart
                      income={transData.income}
                      expenses={transData.expenses}
                    />
                  </Box>
                  <Box w={{ base: '100%', md: '55%' }}>
                    <ApexTransactionChart
                      chartLable={chartLable}
                      chartData={chartData}
                    />
                  </Box>
                </Flex>
              )}
            </>
          )}
        </Flex>
        <TableComp />
      </VStack>
    </SidebarWithHeader>
  );
};

export default page;

const AccountPageStat = ({ transData }: { transData: any }) => {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={5}
      my={3}
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Stat
        boxShadow="md"
        height="auto"
        width={{ base: '100%', md: 'auto' }}
        p={2}
        flex={1}
        textAlign="center"
      >
        <StatLabel>Income</StatLabel>
        <StatNumber color={useColorModeValue('green', 'green.400')}>
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(transData.income)}
        </StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          {transData.incomePercentageChange}%
        </StatHelpText>
      </Stat>
      <Stat
        width={{ base: '100%', md: 'auto' }}
        boxShadow="md"
        height="full"
        p={2}
        flex={1}
        textAlign="center"
      >
        <StatLabel>Total balance</StatLabel>
        <StatNumber color={useColorModeValue('blue.600', 'blue.400')}>
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(transData.balance)}
        </StatNumber>
      </Stat>
      <Stat
        width={{ base: '100%', md: 'auto' }}
        boxShadow="md"
        height="auto"
        p={2}
        flex={1}
        textAlign="center"
      >
        <StatLabel>Expense</StatLabel>
        <StatNumber color="red">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(transData.expenses)}
        </StatNumber>
        <StatHelpText>
          <StatArrow type="decrease" />
          {transData.expensePercentageChange}%
        </StatHelpText>
      </Stat>
    </Stack>
  );
};
