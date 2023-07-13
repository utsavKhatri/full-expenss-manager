import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
import { dataState } from '@/context';
import { ApexOptions } from 'apexcharts';
import { currencyFormat } from '@/utils';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
const AccIncExpChart = ({
  icomeType,
  height = 100,
  className,
}: {
  icomeType?: boolean;
  height?: any;
  className?: any;
}) => {
  const { chartDataA } = dataState();
  const { colorMode } = useColorMode();

  const series = [
    {
      name: icomeType ? 'Income' : 'Expense',
      data: chartDataA
        .filter((x: { isIncome: boolean }) => x.isIncome === icomeType)
        .map((x: { amount: any }) => x.amount),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      width: '100%',
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'straight',
      width: 1,
    },
    fill: {
      opacity: 0.5,
      type: 'gradient',
      gradient: {
        shade: colorMode,
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [
          colorMode === 'light'
            ? icomeType
              ? '#a3ffb980'
              : '#ff8a8a80'
            : icomeType
            ? '#33b50e80'
            : '#ff000080',
        ],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    yaxis: {
      show: false,
    },
    colors: [
      colorMode === 'light'
        ? icomeType
          ? '#a3ffb9'
          : '#ff8a8aBF'
        : icomeType
        ? '#e9fce800'
        : '#cf535300',
    ],
    tooltip: {
      theme: colorMode,
      x: {
        show: false,
      },
      y: {
        formatter: function (val: any) {
          return currencyFormat(val,"standard");
        },
      },
      marker: {
        show: false,
      }
    },
  };
  return (
    <div className={className} style={{ width: '100%', marginTop: '-2rem' }}>
      <Chart
        options={options}
        series={series}
        type="area"
        width={'100%'}
        height={height}
      />
    </div>
  );
};

export default AccIncExpChart;
