
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
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Income', 'Expenses'],
    series: [Math.floor(income), Math.floor(expenses)],
    colors: ['rgba(131, 247, 129, 0.4)', 'rgba(255, 0, 0, 0.4)'],
    stroke: {
      width: 1,
      colors: ['rgba(131, 247, 129, 1)', 'rgba(255, 0, 0, 1)'],
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
