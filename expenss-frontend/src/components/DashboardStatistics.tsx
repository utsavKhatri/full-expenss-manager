import React, { Suspense, useEffect } from 'react';
import {
  Box,
  Flex,
  Stack,
  Text,
  Skeleton,
  useColorModeValue,
  VStack,
  Icon,
  Center,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import {
  currencyFormat,
  getExpensePercentageChange,
  getIncomePercentageChange,
} from '@/utils';
import { dataState } from '@/context';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
const CategoryChart = dynamic(() => import('./charts/CategoryChart'));
const MainChart = dynamic(() => import('./charts/MainChart'));
const MainBalanceChart = dynamic(() => import('./charts/MainBalanceChart'));
const IncomeExpChart = dynamic(() => import('./charts/IncomeChart'));

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
    <Flex
      justifyContent="center"
      gap={4}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <Stack
        spacing={4}
        w={'full'}
        height={'full'}
        direction={{ base: 'column-reverse', xl: 'row' }}
        alignItems={'stretch'}
        justifyContent={'stretch'}
      >
        <VStack
          bg={useColorModeValue('#f5faff', '#191919')}
          rounded="lg"
          shadow="lg"
          py={3}
          alignItems={{ base: 'stretch', xl: 'center' }}
          w={{ base: 'full', xl: '25%' }}
          spacing={4}
          justifyContent={{ base: 'space-between', xl: 'center' }}
        >
          <MainBalanceChart chartLable={listIncome} chartData={listBalance} />
        </VStack>
        <VStack
          alignItems="stretch"
          w={{ base: 'full', xl: '25%' }}
          spacing={4}
          justifyContent="space-between"
          textAlign={'center'}
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
          w={{ base: 'full', xl: '50%' }}
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
              <Box>
                <Text
                  fontSize="4xl"
                  padding={0}
                  color={useColorModeValue('green.600', '#62f065')}
                >
                  {currencyFormat(income?.toFixed(2))}
                </Text>
                <Suspense fallback={<Skeleton />}>
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <Icon as={TriangleUpIcon} color={'green.500'} />
                    {getIncomePercentageChange(analytics)}%
                  </Box>
                </Suspense>
              </Box>{' '}
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
              <Box>
                <Text fontSize="4xl" color="red.500">
                  {currencyFormat(expenses?.toFixed(2))}
                </Text>
                <Suspense fallback={<Skeleton />}>
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <Icon as={TriangleDownIcon} color={'red.500'} />
                    {getExpensePercentageChange(analytics)}%
                  </Box>
                </Suspense>
              </Box>
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
              <Text
                fontSize="4xl"
                color={useColorModeValue('blue.800', 'blue.100')}
              >
                {currencyFormat(balance?.toFixed(2))}
              </Text>
            </Box>
            <IncomeExpChart isBalance={true} key={'balance'} />
          </Flex>
        </VStack>
      </Stack>
      <Stack
        spacing={4}
        w={'full'}
        height={'full'}
        direction={{ base: 'column-reverse', xl: 'row' }}
        alignItems={'stretch'}
        justifyContent={'stretch'}
      >
        <Box
          bg={useColorModeValue('#fcffff', '#1c1c1b')}
          rounded="lg"
          shadow="lg"
          py={3}
          width={{ base: '100%', xl: '50%' }}
        >
          <Suspense fallback={<Skeleton />}>
            <CategoryChart />
          </Suspense>
        </Box>
        <Box
          bg={useColorModeValue('#f3f9ff', '#232730')}
          rounded="lg"
          shadow="lg"
          py={3}
          width={{ base: '100%', xl: '50%' }}
        >
          <MainChart chartLable={chartLableD} chartData={chartDataD} />
        </Box>
      </Stack>
    </Flex>
  );
};

export default DashboardStatistics;
