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
const IncomeExpChart = lazy(() => import('./charts/IncomeChart'));

const DashboardStatistics = ({
  analytics,
  income,
  expenses,
  balance,
}: {
  analytics: any;
  income: any;
  expenses: any;
  balance: any;
}) => {
  const isGreen = (a: any, b: any) => {
    if (parseFloat(a) > parseFloat(b)) {
      return '#2f3630';
    } else {
      return '#2e2627';
    }
  };
  return (
    <Stack
      spacing={4}
      w={{ base: 'full', md: 'auto' }}
      direction={{ base: 'column', md: 'row' }}
      alignItems="stretch"
    >
      <VStack alignItems="stretch" spacing={4} justifyContent="space-between">
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
          <Text fontWeight="bold" fontSize="5xl">
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
      <Box
        p={8}
        bg={useColorModeValue('white', isGreen(income, expenses))}
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
                color={useColorModeValue('green.500', 'green.300')}
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
        <Flex flexDirection="column" alignItems="flex-start" position={'relative'}>
         <Box position={'absolute'} zIndex={2}>
         <Text fontWeight="bold" fontSize="xl">
            Total Balance
          </Text>
          <Text fontSize="4xl">{balance?.toFixed(2)}</Text>
         </Box>
          <IncomeExpChart isBalance={true} key={'balance'} />
        </Flex>
      </Box>
    </Stack>
  );
};

export default DashboardStatistics;
