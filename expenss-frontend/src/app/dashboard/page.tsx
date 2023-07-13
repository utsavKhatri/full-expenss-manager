'use client';
import { useEffect } from 'react';
import SidebarWithHeader from '@/components/Navbar';
import Loader from '@/components/Loader';
import dynamic from 'next/dynamic';
import { dataState } from '@/context';
import { Center, Text } from '@chakra-ui/react';
const DashboardStatistics = dynamic(
  () => import('@/components/DashboardStatistics')
);
const page = () => {
  const { dashboardLoading, analytics, getDashboardData, getTransByCategorys } =
    dataState();
  useEffect(() => {
    getDashboardData();
    getTransByCategorys();
  }, []);

  return dashboardLoading == true ? (
    <Loader />
  ) : (
    <SidebarWithHeader>
      {analytics.listAllTransaction.length > 2 ? (
        <DashboardStatistics />
      ) : (
        <Center>
          <Text>Not enough transactions</Text>
        </Center>
      )}
    </SidebarWithHeader>
  );
};

export default page;
