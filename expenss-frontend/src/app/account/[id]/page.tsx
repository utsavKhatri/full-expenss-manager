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
  Grid,
  GridItem,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  VStack,
  grid,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import ApexTransactionChart from '@/components/charts/ApexTransactionChart';
import BalanceChart from '@/components/charts/BalanceChart';
import AddBalance from '@/components/AddBalance';
import AccountShare from '@/components/AccountShare';
import AccIncExpChart from '@/components/charts/AccIncExpChart';

const page = ({ params }: { params: { id: string } }) => {
  const {
    fetchSignleAcc,
    accPageLoading,
    transData,
    chartLable,
    chartData,
    getCatData,
    currentuserData,
    chartVisible,
    setChartVisibale,
  } = dataState();
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  useEffect(() => {
    setTimeout(async () => {
      await fetchSignleAcc(params.id);
      getCatData();
    }, 1000);
  }, []);

  return accPageLoading && transData == undefined ? (
    <Loader />
  ) : (
    <SidebarWithHeader>
      <VStack>
        <Flex flexDirection="column" w={'full'}>
          <Stack
            direction="row"
            w="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            {currentuserData ? (
              transData.owner == currentuserData.user.id && (
                <AccountShare id={transData.accountId} />
              )
            ) : (
              <Loader />
            )}
            <AddBalance accID={transData.accountId} />
          </Stack>
          {isLargerThan800 ? (
            <AccountPageStat transData={transData} />
          ) : (
            <AccountPageStatMobile transData={transData} />
          )}
          {transData.data.length > 0 && (
            <Stack>
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
            </Stack>
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
      height={'fit-content'}
    >
      <Stat
        boxShadow="md"
        height="auto"
        width={{ base: '100%', md: 'auto' }}
        bg={useColorModeValue('white', '#1a1c1a')}
        p={2}
        flex={1}
        textAlign="center"
        borderRadius={{ base: 'md' }}
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
        height="-moz-max-content"
        p={2}
        bg={useColorModeValue('white', '#141417')}
        borderRadius={{ base: 'md' }}
        py={'22.5px'}
        justifySelf={'stretch'}
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
        bg={useColorModeValue('white', '#171313')}
        borderRadius={{ base: 'md' }}
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

const AccountPageStatMobile = ({ transData }: { transData: any }) => {
  return (
    <Grid
      templateAreas={`"income expense"
        "balance balance"
        `}
      gridTemplateRows={'auto auto'}
      gridTemplateColumns={'1fr 1fr'}
      mt={4}
      mb={2}
      gap={4}
    >
      <GridItem
        area={'income'}
        sx={{
          position: 'relative',
          display: 'grid',
          placeItems: 'left',
          borderRadius: 'md',
          boxShadow: 'md',
        }}
        bg={useColorModeValue('white', '#1a1c1a')}
      >
        <GridItem textAlign={'left'}>
          <Stat
            height="auto"
            width={'100%'}
            p={4}
            zIndex={3}
            bgGradient={'linear(to-t, #000000, trasnsparent)'}
          >
            <StatLabel fontSize="lg">Income</StatLabel>
            <StatNumber
              fontSize="2xl"
              color={useColorModeValue('green.500', 'green.200')}
            >
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
        </GridItem>
        <GridItem>
          <AccIncExpChart icomeType={true} key={'incomeAcc'} />
        </GridItem>
      </GridItem>
      <GridItem
        area={'expense'}
        sx={{
          position: 'relative',
          display: 'grid',
          placeItems: 'left',
          borderRadius: 'md',
          boxShadow: 'md',
        }}
        bg={useColorModeValue('white', '#171313')}
      >
        <GridItem textAlign={'left'}>
          <Stat
            height="auto"
            width={'100%'}
            p={4}
            zIndex={3}
            bgGradient={'linear(to-t, #000000, trasnsparent)'}
          >
            <StatLabel fontSize="lg">Expense</StatLabel>
            <StatNumber fontSize="2xl" color="red">
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
        </GridItem>
        <GridItem>
          <AccIncExpChart icomeType={false} key={'expenssAcc'} />
        </GridItem>
      </GridItem>
      <GridItem area={'balance'}>
        <Box
          bg={useColorModeValue('white', '#141417')}
          boxShadow="md"
          borderRadius="md"
          p={4}
          textAlign="center"
          height={'fit-content'}
        >
          <Stat>
            <StatLabel fontSize="lg">Total balance</StatLabel>
            <StatNumber
              fontSize="2xl"
              color={useColorModeValue('blue.600', 'blue.400')}
            >
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.balance)}
            </StatNumber>
          </Stat>
        </Box>
      </GridItem>
    </Grid>
  );
};
