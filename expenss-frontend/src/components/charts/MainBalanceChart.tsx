import React from 'react';
import dynamic from 'next/dynamic';
import { useColorMode, useMediaQuery } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import { currencyFormat } from '@/utils';
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
      background: 'transparent',
    },
    stroke: {
      width: 0.5,
      colors: ['transparent'],
    },
    theme: {
      monochrome: {
        enabled: true,
        color: colorMode == 'light' ? '#6198e0' : '#38241e',
      },
      mode: colorMode,
    },
    labels: data.labels,
    tooltip: {
      y: {
        formatter: (val) => {
          return currencyFormat(val, 'standard');
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: isLargerThan800 ? 'left' : 'center',
      labels: {
        colors: [colorMode == 'dark' ? '#d4d4d4' : '#000'],
      },
      formatter: (legendName: string, opts?: any) => {
        return (
          legendName +
          ' : ' +
          currencyFormat(opts.w.globals.series[opts.seriesIndex])
        );
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
