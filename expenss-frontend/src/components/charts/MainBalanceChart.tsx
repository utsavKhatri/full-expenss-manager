import React from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const MainBalanceChart = ({
  chartLable,
  chartData,
}: {
  chartLable: any;
  chartData: any;
}) => {
  const data = {
    labels: chartLable,
    series: chartData,
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'pie',
    },
    stroke: {
      width: 0.5,
      colors: ['transparent'],
    },
    colors: [
      '#90CAF9', // Light Blue 200
      '#1E88E5', // Blue 600
      '#1565C0', // Blue 800
      '#64B5F6', // Light Blue 300
      '#1976D2', // Blue 900
      '#0D47A1', // Blue 900
    ],
    labels: data.labels,
    legend: {
      position: 'bottom',
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={data.series}
      type="pie"
      height={350}
    />
  );
};

export default MainBalanceChart;
