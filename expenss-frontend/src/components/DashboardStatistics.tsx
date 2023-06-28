import React, { Suspense } from 'react';
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
          bg={useColorModeValue('gray.50', 'gray.700')}
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
          bg={useColorModeValue('gray.50', 'gray.700')}
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
        bg={useColorModeValue('white', 'gray.800')}
        rounded="lg"
        shadow="lg"
        display="flex"
        alignItems="stretch"
        flexDirection="column"
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Flex flexDirection="column" alignItems="flex-start" mb={8}>
          <Text fontWeight="bold" fontSize="xl">
            Total Income
          </Text>
          <Stat>
            <Text
              fontSize="4xl"
              color={useColorModeValue('green.500', 'green.200')}
            >
              {income?.toFixed(2)}
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
              {expenses?.toFixed(2)}
            </Text>
            <Suspense fallback={<Skeleton />}>
              <StatHelpText>
                <StatArrow type="increase" color="red.500" />
                {getExpensePercentageChange(analytics)}%
              </StatHelpText>
            </Suspense>
          </Stat>
        </Flex>
        <Flex flexDirection="column" alignItems="flex-start">
          <Text fontWeight="bold" fontSize="xl">
            Total Balance
          </Text>
          <Text fontSize="4xl">{balance?.toFixed(2)}</Text>
        </Flex>
      </Box>
    </Stack>
  );
};

export default DashboardStatistics;
