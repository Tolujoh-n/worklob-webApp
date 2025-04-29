import React, { useState } from "react";
import Chart from "react-apexcharts";

const TradeChart = () => {
  const [chartType, setChartType] = useState("candlestick");
  const [timeframe, setTimeframe] = useState("1D");

  // Dummy data for candlestick chart
  const chartData = {
    series: [
      {
        data: [
          { x: new Date("2023-03-01"), y: [50000, 51000, 49500, 50500] },
          { x: new Date("2023-03-02"), y: [50500, 52000, 50000, 51500] },
          { x: new Date("2023-03-03"), y: [51500, 53000, 51000, 52500] },
          { x: new Date("2023-03-04"), y: [52500, 53500, 52000, 53000] },
          { x: new Date("2023-03-05"), y: [53000, 52500, 52000, 51000] },
          { x: new Date("2023-03-06"), y: [52000, 54000, 51500, 53500] },
          { x: new Date("2023-03-07"), y: [53500, 55000, 53000, 54500] },
          { x: new Date("2023-03-08"), y: [55500, 54500, 54000, 53000] },
          { x: new Date("2023-03-09"), y: [55500, 57000, 55000, 56500] },
          { x: new Date("2023-03-10"), y: [57500, 56500, 56000, 55000] },
        ],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    chart: {
      type: chartType,
      background: "#213743",
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    tooltip: {
      theme: "dark", // Optional: helps with default dark mode styles
      style: {
        fontSize: "14px",
        color: "#ffffff",
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const ohlc =
          w.globals.initialSeries[seriesIndex].data[dataPointIndex].y;
        return `
          <div style="background-color: #5e95b3; padding: 10px; border-radius: 5px; color: #ffffff;">
            <strong>Date:</strong> ${w.globals.labels[dataPointIndex]}<br/>
            <strong>Open:</strong> ${ohlc[0]}<br/>
            <strong>High:</strong> ${ohlc[1]}<br/>
            <strong>Low:</strong> ${ohlc[2]}<br/>
            <strong>Close:</strong> ${ohlc[3]}
          </div>
        `;
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#0f0",
          downward: "#f00",
        },
      },
    },
  };

  return (
    <Chart
      options={chartOptions}
      series={chartData.series}
      type={chartType}
      height={500}
    />
  );
};

export default TradeChart;
