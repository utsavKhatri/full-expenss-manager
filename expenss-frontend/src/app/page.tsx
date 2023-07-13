'use client';
import AccountCard from '@/components/AccountCard';
import AddAccModal from '@/components/modals/AddAccModal';
import Loader from '@/components/Loader';
import SidebarWithHeader from '@/components/Navbar';
const SearchResultComp = dynamic(() => import('@/components/SearchResultComp'));
import { dataState } from '@/context';
import {
  Box,
  Container,
  Heading,
  Stack,
  Wrap,
  useColorModeValue,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Key, useEffect } from 'react';

const Home: NextPage = () => {
  const {
    data,
    fetchHomepageData,
    handleDeleteAcc,
    searchResult,
    loading,
    getDashboardData,
    getTransByCategorys,
  } = dataState();
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get('userInfo')) {
      fetchHomepageData();
      getDashboardData();
      getTransByCategorys();
    } else {
      router.push('/auth/login');
    }
  }, []);

  return !loading ? (
    <SidebarWithHeader isShow={true}>
      <Box
        bg={useColorModeValue('gray.100', 'gray.900')}
        suppressHydrationWarning
      >
        <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
          {searchResult && <SearchResultComp searchResult={searchResult} />}
          <Stack spacing={0} align={'center'}>
            <Heading>Your Accounts</Heading>
            <AddAccModal />
          </Stack>

          <Wrap
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 10, md: 4, lg: 10 }}
            py={{ base: 5, md: 3 }}
            justify="center"
          >
            {data.length ? (
              data.map((v: any, i: Key | null | undefined) => {
                return (
                  <AccountCard
                    key={i}
                    account={v}
                    handleDeleteAcc={handleDeleteAcc}
                  />
                );
              })
            ) : (
              <Loader />
            )}
          </Wrap>
        </Container>
      </Box>
    </SidebarWithHeader>
  ) : (
    <Loader />
  );
};

export default Home;
