'use client';
import { useEffect } from 'react';
import SidebarWithHeader from '@/components/Navbar';
import { Flex } from '@chakra-ui/react';
import Loader from '@/components/Loader';
import DashboardStatistics from '@/components/DashboardStatistics';
import { dataState } from '@/context';
const page = () => {
  const { getDashboardData, dashboardLoading } = dataState();

  useEffect(() => {
    getDashboardData();
  }, []);

  return dashboardLoading == true ? (
    <Loader />
  ) : (
    <SidebarWithHeader>
      <Flex
        justifyContent="center"
        gap={4}
        flexDirection={'column'}
        alignItems={'center'}
      >
        <DashboardStatistics />
      </Flex>
    </SidebarWithHeader>
  );
};

export default page;
