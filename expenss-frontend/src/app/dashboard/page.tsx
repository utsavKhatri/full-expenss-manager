'use client';
import { useEffect } from 'react';
import SidebarWithHeader from '@/components/Navbar';
import Loader from '@/components/Loader';
import DashboardStatistics from '@/components/DashboardStatistics';
import { dataState } from '@/context';
const page = () => {
  const { getDashboardData, dashboardLoading, getTransByCategorys } =
    dataState();

  useEffect(() => {
    getDashboardData();
    getTransByCategorys();
  }, []);

  return dashboardLoading == true ? (
    <Loader />
  ) : (
    <SidebarWithHeader>
        <DashboardStatistics />
    </SidebarWithHeader>
  );
};

export default page;
