import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import { dataState } from '@/context';
import { currencyFormat } from '@/utils';

const Chart = dynamic(() => import('react-apexcharts'));

const CategoryChart = () => {
  const { catIncExp } = dataState();
  const { colorMode } = useColorMode();
  const option: ApexOptions = {
    theme: {
      mode: colorMode,
    },
    chart: {
      background: 'transparent',
    },
    grid: {
      show: false,
    },
    colors: [
      colorMode === 'light' ? '#0293e0' : '#32a7e6',
      colorMode === 'light' ? '#E55441' : '#E64534',
    ],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: catIncExp.category,
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => {
          return currencyFormat(val);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: colorMode,
      y: {
        formatter: (val) => {
          return currencyFormat(val);
        },
      },
    },
    title: {
      text: 'Group By Category',
      style: {
        color: colorMode === 'light' ? '#858585' : '#e8e8e8',
        fontSize: '16px',
      },
      offsetX: 14,
    },
  };

  return (
    <div style={{ height: 350, width: '100%', marginBlock: 'auto' }}>
      <Chart
        options={option}
        series={catIncExp.series}
        type="bar"
        height={350}
        width={'100%'}
      />
    </div>
  );
};

export default CategoryChart;
