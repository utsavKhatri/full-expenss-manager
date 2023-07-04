import React, { Suspense } from 'react';
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
import { getExpensePercentageChange, getIncomePercentageChange } from '@/utils';
import { dataState } from '@/context';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
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
  
  return analytics ? (
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
        w={{ base: 'full', xl: '50%' }}
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
        w={{ base: 'full', xl: '35%' }}
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
            <Box>
              <Text
                fontSize="4xl"
                padding={0}
                color={useColorModeValue('green.600', '#62f065')}
              >
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(income?.toFixed(2))}
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
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(expenses?.toFixed(2))}
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
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(balance?.toFixed(2))}
            </Text>
          </Box>
          <IncomeExpChart isBalance={true} key={'balance'} />
        </Flex>
      </VStack>
    </Stack>
  ) : (
    <Center>
      <Text>Nothing to show</Text>
    </Center>
  );
};

export default DashboardStatistics;
