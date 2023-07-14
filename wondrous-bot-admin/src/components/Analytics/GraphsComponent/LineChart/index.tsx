import { CircularProgress, Grid } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import React from "react";
import { Line } from "react-chartjs-2";
import { paddingBelowLegend } from "../plugins";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, {
  ...paddingBelowLegend,
});

function LineChart({ title, data = null, renderComponents = null }) {
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          color: "black",
          padding: 12,
          font: {
            size: 12,
            weight: "500",
            family: "Poppins",
          },
        },
      },

      title: {
        display: true,
        text: title || "",
        position: "top",
        align: "start",
        color: "black",
        font: {
          size: 16,
          weight: "600",
          family: "Poppins",
        },
        padding: {
          top: 0,
          bottom: 24,
        },
      },
    },
    elements: {
      point: {
        radius: 10, // size of the point markers,
        borderWidth: 4,
      },
      line: {
        tension: 0.1, // this will make the line straight,
        borderWidth: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            weight: "500",
            family: "Poppins",
          },
          color: "black",
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          padding: 12,
          font: {
            size: 12,
            weight: "500",
            family: "Poppins",
          },
          color: "black",
        },
      },
    },
  };

  return (
    <Grid
      bgcolor="white"
      borderRadius="16px"
      border={`1px solid #000212`}
      padding="24px"
      width="100%"
      justifyContent="center"
      display="flex"
      flexDirection="column"
      gap="24px"
      alignItems="center"
    >
      {data === null ? (
        <CircularProgress
          size={60}
          thickness={5}
          sx={{
            color: "#2A8D5C",
            animationDuration: "10000ms",
          }}
        />
      ) : (
        <>
          {renderComponents ? renderComponents() : null}

          <Line data={data} options={options} />
        </>
      )}
    </Grid>
  );
}

export default LineChart;
