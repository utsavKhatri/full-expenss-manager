import React, { useEffect, useRef, useState } from 'react';

const RadialBarChart = () => {
  const chartRef = useRef(null);
  const [chartValue, setChartValue] = useState(70);
  const chartInstance = useRef(null);

  useEffect(() => {
    const options = {
      series: [chartValue],
      chart: {
        type: 'radialBar',
        animations: {
          enabled: false,
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 3,
          opacity: 0.5,
        },
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: '25px',
              offsetY: 13,
              formatter: function (val) {
                return val + '%';
              },
            },
          },
          hollow: {
            size: '60%',
          },
        },
      },
      fill: {
        colors: ['#F44336'],
      },
    };

    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.updateOptions(
          {
            series: [chartValue],
          },
          true
        );
      } else {
        const ApexCharts = require('apexcharts');
        chartInstance.current = new ApexCharts(chartRef.current, options);
        chartInstance.current.render();
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartValue]);

  const handleSliderChange = (event) => {
    setChartValue(Number(event.target.value));
  };

  return (
    <>
      <div
        id="chart"
        ref={chartRef}
        style={{
          height: '350px',
          width: '350px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      ></div>
      <div className="fire-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={chartValue}
          onChange={handleSliderChange}
          className="fire-slider"
        />
        <div className="fire-flame"></div>
      </div>
    </>
  );
};

export default RadialBarChart;
