import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const MainBalanceChart = ({ expenses, income }) => {
  const data = {
    labels: ["Income", "Expenss"],
    datasets: [
      {
        label: "expenss and income",
        data: [income, expenses],
        backgroundColor: ["rgba(131, 247, 129, 0.4)", "rgba(255, 0, 0, 0.4)"],
        borderColor: ["rgba(131, 247, 129, 1)", "rgba(255, 0, 0, 1)"],
        borderWidth: 1,
        width: 10,
      },
    ],
  };
  return (
    <Doughnut
    width={"75%"}
      options={{
        responsive: true,
        aspectRatio:3|4,
        maintainAspectRatio: true
      }}
      data={data}
    />
  );
}

export default MainBalanceChart