import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
import { dataState } from '@/context';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
const InEXPChart = ({
  icomeType,
  isBalance,
}: {
  icomeType?: boolean;
  isBalance?: boolean;
}) => {
  const { chartDataI } = dataState();
  const { colorMode } = useColorMode();

  const series = isBalance
    ? [
        {
          name: 'Balance',
          data: chartDataI.map((x: { amount: any }) => x.amount),
        },
      ]
    : [
        {
          name: icomeType ? 'Income' : 'Expense',
          data: chartDataI
            .filter((x: { isIncome: boolean }) => x.isIncome === icomeType)
            .map((x: { amount: any }) => x.amount),
        },
      ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      width: '100%',
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'straight',
      width: 2,
    },
    yaxis: {
      min: 0,
    },
    colors: [
      isBalance
        ? colorMode === 'light'
          ? '#78b9ff'
          : '#4da4ff'
        : colorMode === 'light'
        ? icomeType
          ? '#a3ffb9'
          : '#ff4d4d'
        : icomeType
        ? '#98f599'
        : '#ff9e9e',
    ],
    fill: {
      opacity: 0.5,
      type: 'gradient',
      gradient: {
        shade: colorMode,
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [
          isBalance
            ? colorMode === 'light'
              ? '#78b9ff80'
              : '#3b9aff80'
            : colorMode === 'light'
            ? icomeType
              ? '#a3ffb980'
              : '#ff4d4d66'
            : icomeType
            ? '#19ff1d3D'
            : '#ff454580',
        ],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    tooltip: {
      theme: colorMode,
    },
  };
  return (
    <div style={{ width: '100%', paddingTop: '3.8rem' }}>
      <Chart
        options={options}
        series={series}
        type="area"
        width={'100%'}
        height={140}
      />
    </div>
  );
};

export default InEXPChart;
