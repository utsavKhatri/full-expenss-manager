import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const ApexTransactionChart = ({ chartLable, chartData }) => {
  const [isWindow, setIsWindow] = useState(false);
  // console.log(chartData);
  const options = {
    chart: {
      height: 280,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: 'datetime',
      categories: chartLable,
    },
  };
  const options2 = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      dataSets: [
        {
          data: chartLable,
        },
      ],
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: chartLable,
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
  };

  const series = [
    {
      data: chartData,
    },
  ];

  useEffect(() => {
    setIsWindow(true);
  }, []);

  return isWindow ? (
    <ReactApexChart type="area" options={options} series={series} />
  ) : (
    <h2>Loading</h2>
  );
};

export default ApexTransactionChart;
