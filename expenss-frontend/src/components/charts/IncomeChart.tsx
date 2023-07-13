import dynamic from 'next/dynamic';
import { useColorMode, useMediaQuery } from '@chakra-ui/react';
import { dataState } from '@/context';
import { ApexOptions } from 'apexcharts';
import { currencyFormat } from '@/utils';

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
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

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

  const options: ApexOptions = {
    chart: {
      type: 'area',
      width: '100%',
      sparkline: {
        enabled: true,
      },
      background: 'transparent',
      toolbar: {
        autoSelected: 'zoom',
      },
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      stacked: false,
    },
    stroke: {
      curve: 'straight',
      width: isLargerThan800 ? 1.1 : 0,
    },
    yaxis: {
      show: false,
    },
    colors: [
      isBalance
        ? colorMode === 'light'
          ? isLargerThan800
            ? '#78b9ff'
            : '#ffffff'
          : isLargerThan800
          ? '#2991ff'
          : '#252830'
        : colorMode === 'light'
        ? icomeType
          ? isLargerThan800
            ? '#46bd62'
            : '#ffffff'
          : isLargerThan800
          ? '#e64343'
          : '#ffffff'
        : icomeType
        ? isLargerThan800
          ? '#98f599'
          : '#252830'
        : isLargerThan800
        ? '#e53e3e'
        : '#252830',
    ],
    fill: {
      opacity: 0.5,
      type: 'gradient',
      gradient: {
        shade: colorMode,
        type: 'vertical',
        shadeIntensity: isLargerThan800 ? 0.5 : 1,
        gradientToColors: [
          isLargerThan800
            ? isBalance
              ? colorMode === 'light'
                ? '#78b9ff80'
                : '#3b9aff80'
              : colorMode === 'light'
              ? icomeType
                ? '#a3ffb980'
                : '#ff4d4d80'
              : icomeType
              ? '#19ff1d3D'
              : '#ff454580'
            : isBalance
            ? colorMode === 'light'
              ? '#439dff'
              : '#6da6ff'
            : colorMode === 'light'
            ? icomeType
              ? '#39bc7b'
              : '#ff1717'
            : icomeType
            ? '#62f065'
            : '#e53e3e',
        ],
        inverseColors: isLargerThan800 ? false : true,
        opacityFrom: 1,
        opacityTo: isLargerThan800 ? 0 : 1,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: colorMode,
      x: {
        show: false,
      },
      y: {
        formatter: (val) => {
          return currencyFormat(val);
        },
      },
      marker: {
        show: isLargerThan800 ? true : false,
      },
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
