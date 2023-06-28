'use client';
import { useEffect } from 'react';
import SidebarWithHeader from '@/components/Navbar';
import { Flex } from '@chakra-ui/react';
import Loader from '@/components/Loader';
import ChartAccordion from '@/components/ChartAccordion';
import DashboardStatistics from '@/components/DashboardStatistics';
import { dataState } from '@/context';
const page = () => {
  const {
    getDashboardData,
    listBalance,
    listIncome,
    chartDataD,
    chartLableD,
    balance,
    expenses,
    income,
    dashboardLoading,
    analytics,
  } = dataState();

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
        <DashboardStatistics
          analytics={analytics}
          income={income}
          expenses={expenses}
          balance={balance}
        />
        <ChartAccordion
          chartLable={chartLableD}
          chartData={chartDataD}
          listIncome={listIncome}
          listBalance={listBalance}
        />
      </Flex>
    </SidebarWithHeader>
  );
};

export default page;


