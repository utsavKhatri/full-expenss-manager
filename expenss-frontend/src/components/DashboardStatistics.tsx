import React, { Suspense, lazy } from 'react';
import {
  Box,
  Flex,
  Stack,
  Text,
  Stat,
  StatHelpText,
  StatArrow,
  Skeleton,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { getExpensePercentageChange, getIncomePercentageChange } from '@/utils';
import { dataState } from '@/context';
const MainChart = lazy(() => import('./charts/MainChart'));
const MainBalanceChart = lazy(() => import('./charts/MainBalanceChart'));
const IncomeExpChart = lazy(() => import('./charts/IncomeChart'));

const DashboardStatistics = () => {
  const {
    listBalance,
    listIncome,
    chartDataD,
    chartLableD,
    balance,
    expenses,
    income,
    analytics,
  } = dataState();
  return (
    <Stack
      spacing={4}
      w={'full'}
      height={'full'}
      direction={{ base: 'column-reverse', xl: 'row' }}
      alignItems={'stretch'}
      justifyContent={'stretch'}
    >
      <VStack
        alignItems="stretch"
        w={{ base: 'full', xl: '35%' }}
        spacing={4}
        justifyContent="space-between"
      >
        <Box
          bg={useColorModeValue('#f5faff', '#232730')}
          rounded="lg"
          shadow="lg"
          py={3}
        >
          <MainChart chartLable={chartLableD} chartData={chartDataD} />
        </Box>
        <Box
          bg={useColorModeValue('#f5faff', '#2f3136')}
          rounded="lg"
          shadow="lg"
          py={3}
        >
          <MainBalanceChart chartLable={listIncome} chartData={listBalance} />
        </Box>
      </VStack>
      <VStack
        alignItems="stretch"
        w={{ base: 'full', xl: '25%' }}
        spacing={4}
        justifyContent="space-between"
      >
        <Box
          p={8}
          bg={useColorModeValue('#f5faff', '#2f3136')}
          rounded="lg"
          shadow="lg"
          display="flex"
          alignItems="center"
          height="full"
          justifyContent="center"
          flexDirection="column"
        >
          <Text fontWeight="bold" fontSize="xl" mb={2}>
            Total Accounts
          </Text>
          <Text fontWeight="bold" fontSize="8xl">
            {analytics?.listAccounts?.length}
          </Text>
        </Box>
        <Box
          p={8}
          bg={useColorModeValue('amazingLight.50', '#3b3b3b')}
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
          <Text fontSize="2xl">{analytics?.listAllTransaction.length}</Text>
        </Box>
      </VStack>
      <VStack
        py={8}
        px={6}
        w={'full'}
        bg={useColorModeValue('white', '#252830')}
        rounded="lg"
        shadow="lg"
        display="flex"
        alignItems="stretch"
        flexDirection="column"
      >
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          mb={8}
          position={'relative'}
        >
          <Box position={'absolute'} zIndex={2}>
            <Text fontWeight="bold" fontSize="xl">
              Total Income
            </Text>
            <Stat>
              <Text
                fontSize="4xl"
                padding={0}
                color={useColorModeValue('green.600', '#62f065')}
              >
                {income?.toFixed(2)}
              </Text>
              <Suspense fallback={<Skeleton />}>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {getIncomePercentageChange(analytics)}%
                </StatHelpText>
              </Suspense>
            </Stat>{' '}
          </Box>
          <IncomeExpChart icomeType={true} key={'income'} />
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          mb={8}
          position={'relative'}
        >
          <Box position={'absolute'} zIndex={2}>
            <Text fontWeight="bold" fontSize="xl">
              Total Expense
            </Text>
            <Stat>
              <Text fontSize="4xl" color="red.500">
                {expenses?.toFixed(2)}
              </Text>
              <Suspense fallback={<Skeleton />}>
                <StatHelpText>
                  <StatArrow type="increase" color="red.500" />
                  {getExpensePercentageChange(analytics)}%
                </StatHelpText>
              </Suspense>
            </Stat>
          </Box>
          <IncomeExpChart icomeType={false} key={'expense'} />
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          position={'relative'}
        >
          <Box position={'absolute'} zIndex={2}>
            <Text fontWeight="bold" fontSize="xl">
              Total Balance
            </Text>
            <Text fontSize="4xl">{balance?.toFixed(2)}</Text>
          </Box>
          <IncomeExpChart isBalance={true} key={'balance'} />
        </Flex>
      </VStack>
    </Stack>
  );
};

export default DashboardStatistics;
