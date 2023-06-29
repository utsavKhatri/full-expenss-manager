
import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

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

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: colorMode,
    },
    colors: [colorMode === 'light' ? '#0072b0' : '#2eb6ff'],
    stroke: {
      width: 2,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: labels,
      labels: {
        show: true,
        style:{
          colors: colorMode === 'light' ? '#858585' : '#e8e8e8',
        },
        formatter: function (val: any) {
          return new Date(val).toLocaleDateString();
        }
      },
    },
    yaxis: {
      labels: {
        minWidth: 40,
        style: {
          colors: colorMode === 'light' ? '#858585' : '#e8e8e8',
          cssClass: 'apexcharts-xaxis-label',
        },
      },
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={350}
      width={'100%'}
    />
  );
};

export default MainChart;
