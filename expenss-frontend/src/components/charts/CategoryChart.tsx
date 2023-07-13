import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import { dataState } from '@/context';
import { currencyFormat } from '@/utils';

const Chart = dynamic(() => import('react-apexcharts'));

const CategoryChart = () => {
  const { catIncExp } = dataState();
  const { colorMode } = useColorMode();

  if (catIncExp.isShow === false) return null;

  const option: ApexOptions = {
    chart: {
      background: 'transparent',
    },
    grid: {
      show: false,
    },
    theme: {
      mode: colorMode,
      monochrome: {
        enabled: true,
        color: colorMode === 'light' ? '#479c38' : '#7fd470',
      },
    },
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
          return currencyFormat(val, 'standard');
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
