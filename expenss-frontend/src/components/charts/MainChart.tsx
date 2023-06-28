import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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
    colors: ['#008FFB'],
    stroke: {
      width: 2,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: labels,
    },
    yaxis: {
      labels: {
        minWidth: 40,
      },
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      height={350}
      width={'100%'}
    />
  );
};

export default MainChart;
