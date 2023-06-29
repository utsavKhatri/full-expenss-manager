import dynamic from 'next/dynamic';
import { useColorMode } from '@chakra-ui/react';
import { dataState } from '@/context';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});
const AccIncExpChart = ({ icomeType }: { icomeType?: boolean }) => {
  const { chartDataA } = dataState();
  const { colorMode } = useColorMode();

  const series = [
    {
      name: 'Income',
      data: chartDataA
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
              ? '#a3ffb9'
              : '#ff8a8a'
            : icomeType
            ? '#e9fce8'
            : '#ffc4c4',
        ],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    yaxis: {
      min: 0,
    },
    colors: [
      colorMode === 'light'
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
    <div style={{ width: '100%', marginTop:'-2rem' }}>
      <Chart
        options={options}
        series={series}
        type="area"
        width={'100%'}
        height={100}
      />
    </div>
  );
};

export default AccIncExpChart;
