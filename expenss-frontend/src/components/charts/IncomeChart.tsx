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
    fill: {
      opacity: 1,
    },
    yaxis: {
      min: 0,
    },
    colors: [
      isBalance
        ? colorMode === 'light'
          ? '#78b9ff'
          : '#abd4ff'
        : colorMode === 'light'
        ? icomeType
          ? '#a3ffb9'
          : '#ff8a8a'
        : icomeType
        ? '#e9fce8'
        : '#fce8e8',
    ],
    tooltip: {
      theme: colorMode,
    },
  };
  return (
    <div style={{ width: '100%', paddingTop: '4rem' }}>
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
