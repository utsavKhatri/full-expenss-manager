import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);
import { Bar, Line } from 'react-chartjs-2';

const TransactionChart = ({ chartLable, chartData }) => {
  const labels = [...chartLable];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const data = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "Transactions",
        backgroundColor: chartData.map((ele) => {
          if (ele < 0) {
            return "rgba(255, 0, 0, 0.4)";
          } else {
            return "rgba(131, 247, 129, 0.4)";
          }
        }),
        data: chartData,
        borderColor: chartData.map((ele) => {
          if (ele < 0) {
            return "rgba(255, 0, 0, 0.9)";
          } else {
            return "rgba(131, 247, 129, 0.9)";
          }
        }),
        borderWidth:2
      },
    ],
  };
  return (
    <Bar
      options={options}
      data={data}
    />
  );
};

export default TransactionChart;
