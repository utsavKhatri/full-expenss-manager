'use client';
import { Suspense, useEffect } from 'react';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
import { dataState } from '@/context';
import TableComp from '@/components/TableComp';
import {
  Box,
  Button,
  Flex,
  Skeleton,
  Stack,
  VStack,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import AddBalance from '@/components/modals/AddBalance';
import AccountPageStat from '@/components/AccountPageStat';
import dynamic from 'next/dynamic';
const AccountShare = dynamic(() => import('@/components/modals/AccountShare'));
const AccountPageStatMobile = dynamic(
  () => import('@/components/AccountPageStatMobile')
);
const ApexTransactionChart = dynamic(
  () => import('@/components/charts/ApexTransactionChart')
);
const BalanceChart = dynamic(() => import('@/components/charts/BalanceChart'));

const page = ({ params }: { params: { id: string } }) => {
  const {
    fetchSignleAcc,
    accPageLoading,
    transData,
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
            justifyContent={{ base: 'space-evenly', md: 'space-between' }}
            gap={{ base: 3, md: 0 }}
          >
            {transData.owner == currentuserData?.user.id && (
              <Suspense fallback={<Skeleton />}>
                <AccountShare id={transData.accountId} />
              </Suspense>
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
                p={{ base: 3, md: 6 }}
                mb={5}
                mt={3}
                rounded="md"
                size={{ base: 'sm', md: 'md' }}
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
                    <Suspense fallback={<Skeleton />}>
                      <BalanceChart
                        income={transData.income}
                        expenses={transData.expenses}
                      />
                    </Suspense>
                  </Box>
                  <Box w={{ base: '100%', md: '55%' }}>
                    <Suspense fallback={<Skeleton />}>
                      <ApexTransactionChart />
                    </Suspense>
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
