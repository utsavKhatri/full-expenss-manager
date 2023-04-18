import React from "react";
import { Chart } from "react-chartjs-2";
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
const TransactionChart = ({ chartLable, chartData }) => {
  const labels = [...chartLable];

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
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
        borderWidth: 2,
      },
    ],
  };
  return (
    <Chart
      type="bar"
      options={{
        responsive: true,
      }}
      data={data}
    />
  );
};

export default TransactionChart;
