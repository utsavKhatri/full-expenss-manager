import { useColorMode } from '@chakra-ui/react';
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
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Income', 'Expenses'],
    series: [Math.floor(income), Math.floor(expenses)],
    colors: [incomeColor, expensesColor],
    stroke: {
      show: false,
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
        height={500}
      />
    </div>
  );
};

export default BalanceChart;
