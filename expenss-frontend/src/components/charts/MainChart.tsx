import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import { currencyFormat } from '@/utils';

const Chart = dynamic(() => import('react-apexcharts'));

const MainChart = ({
  chartLable,
  chartData,
}: {
  chartLable: any;
  chartData: any;
}) => {
  const labels = typeof chartLable === 'object' && [...chartLable];
  const { colorMode } = useColorMode();
  const series = [
    {
      name: 'Transactions',
      data: chartData,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
      zoom: {
        enabled: true,
      },
      selection:{
        enabled: true
      },
      background: 'transparent',
    },
    theme: {
      mode: colorMode,
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: colorMode,
      y: {
        formatter: (val) => {
          return currencyFormat(val);
        },
      }
    },
    colors: [colorMode === 'light' ? '#0072b0' : '#2eb6ff'],
    stroke: {
      width: 1,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: labels,
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: colorMode === 'light' ? '#858585' : '#e8e8e8',
        },
        formatter: function (val: any) {
          return new Date(val).toLocaleDateString();
        },
      },
    },
    yaxis: {
      labels: {
        minWidth: 40,
        formatter: (val) => {
          return currencyFormat(val);
        },
        style: {
          colors: colorMode === 'light' ? '#858585' : '#e8e8e8',
          cssClass: 'apexcharts-xaxis-label',
        },
      },
    },
    title: {
      text: 'All Transactions',
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
        options={options}
        series={series}
        type="bar"
        height={350}
        width={'100%'}
      />
    </div>
  );
};

export default MainChart;
