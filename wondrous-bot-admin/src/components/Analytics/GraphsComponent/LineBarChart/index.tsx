import { CircularProgress, Grid, useMediaQuery } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import { Chart } from "react-chartjs-2";

import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { paddingBelowLegend } from "../plugins";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  paddingBelowLegend
);

function LineBarChart({ title, data = null, renderComponents = null }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  const options: ChartOptions<"line" | "bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: isMobile ? 1 : 4,
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
      bar: {
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
      // width="100%"
      justifyContent="center"
      display="flex"
      flexDirection="column"
      gap="24px"
      alignItems="center"
      height="100%"
      minWidth="20vw"
      position="relative"
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

          <Chart
            type="line"
            data={data}
            options={options}
            style={{
              height: "20vh",
              width: "20vw",
              position: "relative",
            }}
          />
        </>
      )}
    </Grid>
  );
}

export default LineBarChart;
