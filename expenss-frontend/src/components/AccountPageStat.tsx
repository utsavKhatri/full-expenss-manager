import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Box, Icon, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const AccIncExpChart = dynamic(
  () => import('@/components/charts/AccIncExpChart')
);

const AccountPageStat = ({ transData }: { transData: any }) => {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={5}
      my={3}
      justifyContent="space-evenly"
      alignItems="center"
      height={'fit-content'}
      w={'full'}
    >
      <Box
        boxShadow="md"
        height="auto"
        width={{ base: '100%', md: 'auto' }}
        bg={useColorModeValue('white', '#1a1c1a')}
        flex={1}
        py={2}
        textAlign="center"
        borderRadius={{ base: 'md' }}
        h={'100'}
      >
        <div className="main-one">
          <Box
            className="chart-stat-1"
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            zIndex={4}
          >
            <Text>Income</Text>
            <Text
              as={'b'}
              fontSize={'2xl'}
              color={useColorModeValue('green', '#5dff95')}
            >
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.income)}
            </Text>
            <Box
              display={'flex'}
              alignItems={'center'}
              gap={1}
              color={useColorModeValue('green.800', '#47d16f')}
              fontSize={'sm'}
            >
              <Icon as={TriangleUpIcon} color={'#00a630'} />
              {transData.incomePercentageChange}%
            </Box>
          </Box>
          <AccIncExpChart
            className={'chart-1'}
            height={50}
            icomeType={true}
            key={'incomeAcc1'}
          />
        </div>
      </Box>
      <Box
        width={{ base: '100%', md: '33%' }}
        boxShadow="md"
        height="-moz-max-content"
        p={2}
        bg={useColorModeValue('white', '#141417')}
        borderRadius={{ base: 'md' }}
        justifySelf={'stretch'}
        h={'100'}
        textAlign="center"
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Text>Total balance</Text>
        <Text
          as={'b'}
          fontSize={'2xl'}
          color={useColorModeValue('blue.600', 'blue.400')}
        >
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(transData.balance)}
        </Text>
      </Box>
      <Box
        width={{ base: '100%', md: 'auto' }}
        boxShadow="md"
        height="auto"
        bg={useColorModeValue('white', '#171313')}
        borderRadius={{ base: 'md' }}
        py={2}
        flex={1}
        textAlign="center"
        h={'100'}
      >
        <div className="main-one">
          <Box
            className="chart-stat-1"
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            zIndex={4}
          >
            <Text>Expense</Text>
            <Text as={'b'} fontSize={'2xl'} color="red">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.expenses)}
            </Text>
            <Box
              display={'flex'}
              fontSize={'sm'}
              color={useColorModeValue('red.800', '#c23838')}
              alignItems={'center'}
              gap={1}
            >
              <Icon as={TriangleDownIcon} color={'red'} />
              {transData.expensePercentageChange}%
            </Box>
          </Box>

          <AccIncExpChart
            className={'chart-1'}
            height={50}
            icomeType={false}
            key={'expenssAcc2'}
          />
        </div>
      </Box>
    </Stack>
  );
};
export default AccountPageStat;
