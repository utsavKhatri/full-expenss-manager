import { Flex } from "@chakra-ui/react";
import React from "react";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";
// import ReactApexChart from "react-apexcharts";

const ApexTransactionChart = ({ chartLable, chartData }) => {
  console.log(chartData);
  const options = {
    chart: {
      height: 280,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime",
      categories: chartLable,
    },
  };
  const options2 = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
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
          fontSize: "12px",
        },
      },
    },
  };

  const series = [
    {
      data: chartData,
    },
  ];
  return <ReactApexChart type="area" options={options} series={series} />;
};

export default ApexTransactionChart;
