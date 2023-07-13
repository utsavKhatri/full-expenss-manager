import { useColorMode, useMediaQuery } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
const BalanceChart = ({
  expenses,
  income,
}: {
  expenses: number;
  income: number;
}) => {
  const { colorMode } = useColorMode();
  const incomeColor = colorMode === 'light' ? '#99f291' : '#68de47';
  const expensesColor = colorMode === 'light' ? '#E74C3C' : '#E74C3C';
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Income', 'Expenses'],
    series: [Math.floor(income), Math.floor(expenses)],
    colors: [incomeColor, expensesColor],
    stroke: {
      show: false,
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: colorMode,
      },
    },
    responsive: [
      {
        breakpoint: 780,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div style={{ height: '100%', width: '100%', marginInline: 'auto' }}>
      <Chart
        options={chartOptions}
        series={chartOptions.series}
        type="donut"
        height={!isLargerThan800 ? 350 : 500}
      />
    </div>
  );
};

export default BalanceChart;
