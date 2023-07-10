import React from 'react';
import dynamic from 'next/dynamic';
import { useColorMode, useMediaQuery } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
const ReactApexChart = dynamic(() => import('react-apexcharts'));

const MainBalanceChart = ({
  chartLable,
  chartData,
}: {
  chartLable: any;
  chartData: any;
}) => {
  const data = {
    labels: chartLable,
    series: chartData,
  };
  const { colorMode } = useColorMode();

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  const options: ApexOptions = {
    chart: {
      type: 'pie',
    },
    stroke: {
      width: 0.5,
      colors: ['transparent'],
    },
    colors: [
      '#90CAF9', // Light Blue 200
      '#1E88E5', // Blue 600
      '#1565C0', // Blue 800
      '#64B5F6', // Light Blue 300
      '#1976D2', // Blue 900
      '#0D47A1', // Blue 900
    ],
    labels: data.labels,
    legend: {
      position: 'bottom',
      horizontalAlign: isLargerThan800 ? 'left' : 'center',
      labels: {
        colors: [colorMode == 'dark' ? '#d4d4d4' : '#000'],
      },
    },
    title: {
      text: 'Account Balance',
      style: {
        color: colorMode === 'light' ? '#858585' : '#e8e8e8',
        fontSize: '16px',
      },
      offsetX: 14,
    },
  };

  return (
    <div style={{ height: 350, width: '100%', marginBlock: 'auto' }}>
      <ReactApexChart
        options={options}
        series={data.series}
        type="pie"
        height={350}
      />
    </div>
  );
};

export default MainBalanceChart;
