import {
  Box,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import { lazy } from 'react';
const AccIncExpChart = lazy(() => import('@/components/charts/AccIncExpChart'));

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
        flex={1}
        py={2}
        textAlign="center"
        borderRadius={{ base: 'md' }}
      >
        <div className="main-one">
          <Box className="chart-stat-1" zIndex={4}>
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
          </Box>
          <AccIncExpChart
            className={'chart-1'}
            height={50}
            icomeType={true}
            key={'incomeAcc1'}
          />
        </div>
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
        py={2}
        flex={1}
        textAlign="center"
      >
        <div className="main-one">
          <Box className="chart-stat-1" zIndex={4}>
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
          </Box>

          <AccIncExpChart
            className={'chart-1'}
            height={50}
            icomeType={false}
            key={'expenssAcc2'}
          />
        </div>
      </Stat>
    </Stack>
  );
};
export default AccountPageStat;
