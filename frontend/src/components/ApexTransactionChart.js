import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const ApexTransactionChart = ({ chartLable, chartData }) => {
  const [isWindow, setIsWindow] = useState(false);
  const { colorMode } = useColorMode();
  const options = {
    chart: {
      height: 280,
      type: 'area',
      fillTo: 'origin',
    },
    tooltip: {
      theme: colorMode === 'light' ? 'light' : 'dark',
    },
    dataLabels: {
      enabled: false,
    },
    theme: {
      mode: colorMode === 'light' ? 'light' : 'dark',
    },
    stroke: {
      width: 1.5,
    },
    grid: {
      show: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: colorMode === 'light' ? 'light' : 'dark',
        shadeIntensity: 0.7,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: 'datetime',
      categories: chartLable,
      labels: {
        show: true,
        style: {
          colors: colorMode === 'light' ? '#1a1a1a' : '#fff',
          cssClass: 'apexcharts-xaxis-label',
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: colorMode === 'light' ? '#1a1a1a' : '#fff',
          cssClass: 'apexcharts-yaxis-label',
        },
      },
    },
  };

  const series = [
    {
      data: chartData,
    },
  ];

  useEffect(() => {
    setIsWindow(true);
  }, []);

  return isWindow ? (
    <ReactApexChart type="area" options={options} series={series} />
  ) : (
    <h2>Loading</h2>
  );
};

export default ApexTransactionChart;
