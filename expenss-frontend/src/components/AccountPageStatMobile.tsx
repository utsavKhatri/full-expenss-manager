import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, Grid, GridItem, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const AccIncExpChart = dynamic(() => import('@/components/charts/AccIncExpChart'));

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
        w={'full'}
        bg={useColorModeValue('white', '#0d120d')}
      >
        <GridItem textAlign={'left'} w={'full'}>
          <Box
            height="auto"
            width={'100%'}
            p={4}
            zIndex={3}
            bgGradient={'linear(to-t, #000000, trasnsparent)'}
          >
            <Text fontSize="lg">Income</Text>
            <Text
              fontSize="2xl"
              as={'b'}
              color={useColorModeValue('green.500', 'green.200')}
            >
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.income)}
            </Text>
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <Icon as={TriangleUpIcon} color={'green.500'}/>
              {transData.incomePercentageChange}%
            </Box>
          </Box>
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
        w={'full'}
        bg={useColorModeValue('white', '#171313')}
      >
        <GridItem textAlign={'left'} w={'full'}>
          <Box
            height="auto"
            width={'100%'}
            p={4}
            zIndex={3}
            bgGradient={'linear(to-t, #000000, trasnsparent)'}
          >
            <Text fontSize="lg">Expense</Text>
            <Text fontSize="2xl" color="red" as={'b'}>
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.expenses)}
            </Text>
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <Icon as={TriangleDownIcon} color={'red.500'}/>
              {transData.expensePercentageChange}%
            </Box>
          </Box>
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
          <Box>
            <Text fontSize="lg">Total balance</Text>
            <Text
              fontSize="2xl"
              as={'b'}
              color={useColorModeValue('blue.600', 'blue.400')}
            >
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(transData.balance)}
            </Text>
          </Box>
        </Box>
      </GridItem>
    </Grid>
  );
};


export default AccountPageStatMobile