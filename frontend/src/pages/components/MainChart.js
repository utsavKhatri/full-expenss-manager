import React, { useEffect, useState } from "react";
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
  Filler,
  BarController,
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  Filler,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);
import { Bar, Line } from "react-chartjs-2";
const MainChart = ({ chartLable, chartData }) => {
  const labels = [...chartLable];
  const [options, setOptions] = useState({});
  useEffect(() => {
    setOptions({
      responsive: true,
      scales: {
        x: {
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: 14,
            },
          },
        },
      },
    });
  }, []);

  useEffect(() => {
    function checkMediaQuery() {
      if (matchMedia) {
        const mq = window.matchMedia("(max-width: 600px)");
        if (mq.matches) {
          // hide x-axis on mobile view
          setOptions((prevOptions) => ({
            ...prevOptions,
            scales: {
              ...prevOptions.scales,
              x: {
                ...prevOptions.scales.x,
                ticks: {
                  ...prevOptions.scales.x.ticks,
                  display: false,
                },
              },
            },
          }));
        } else {
          // show x-axis on desktop view
          setOptions((prevOptions) => ({
            ...prevOptions,
            scales: {
              ...prevOptions.scales,
              x: {
                ...prevOptions.scales.x,
                ticks: {
                  ...prevOptions.scales.x.ticks,
                  display: true,
                },
              },
            },
          }));
        }
      }
    }

    checkMediaQuery();
    window.addEventListener("resize", checkMediaQuery);

    return () => {
      window.removeEventListener("resize", checkMediaQuery);
    };
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        fill: true,
        label: "Transactions",
        tension: 0.5,
        backgroundColor: chartData.map((ele) => {
          if (ele < 0) {
            return "rgba(255, 0, 0, 0.4)";
          } else {
            return "rgba(131, 247, 129, 0.4)";
          }
        }),
        borderColor: chartData.map((ele) => {
          if (ele < 0) {
            return "rgba(255, 0, 0, 0.9)";
          } else {
            return "rgba(131, 247, 129, 0.9)";
          }
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        data: chartData,
        borderWidth: 2,
      },
    ],
  };
  return <Line options={options} data={data} />;
}

export default MainChart