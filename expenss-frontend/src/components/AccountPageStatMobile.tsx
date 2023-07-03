import { Box, Grid, GridItem, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";
import { lazy } from "react";
// import AccIncExpChart from "./charts/AccIncExpChart";
const AccIncExpChart = lazy(() => import('@/components/charts/AccIncExpChart'));

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
        bg={useColorModeValue('white', '#0d120d')}
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
          bg={useColorModeValue('white', '#15151c')}
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


export default AccountPageStatMobile