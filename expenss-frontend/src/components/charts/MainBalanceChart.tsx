import React from 'react';
import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const MainBalanceChart = ({
  chartLable,
  chartData,
}: {
  chartLable: any;
  chartData: any;
}) => {
  const { colorMode } = useColorMode();
  const data = {
    labels: chartLable,
    series: chartData,
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'pie',
    },
    theme: {
      mode: colorMode,
    },
    stroke: {
      width: 0.5,
      colors: ['transparent'],
    },
    colors: [
      '#9B59B6', // Royal Purple
      '#3498DB', // Royal Blue
      '#E67E22', // Royal Orange
      '#2ECC71', // Royal Green
      '#F1C40F', // Royal Yellow
      '#E74C3C', // Royal Red
    ],
    labels: data.labels,
    legend: {
      position: 'bottom',
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={data.series}
      type="pie"
      height={350}
    />
  );
};

export default MainBalanceChart;
