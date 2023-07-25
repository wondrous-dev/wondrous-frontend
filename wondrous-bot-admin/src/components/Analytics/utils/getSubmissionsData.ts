import moment from "moment";

const getSubmissionsData = (apiData, filterType) => {
  const labels = apiData.map((item) => moment(item?.date).format("MM/DD"));

  const submissionsTotal = apiData.map((item) => item?.counts.total);
  const submissionsApproved = apiData.map((item) => item?.counts.approved);

  return {
    labels: labels,
    datasets: [
      {
        label: "\nApprovals",
        data: submissionsApproved,
        fill: false,
        backgroundColor: "#2A8D5C",
        pointRadius: 5,
        pointStyle: "circle",
        borderColor: "#2A8D5C",
        type: "line",
      },
      {
        label: "\nSubmissions",
        data: submissionsTotal,
        backgroundColor: "#84BCFF",
        pointRadius: 5,
        borderColor: "#84BCFF",
        pointStyle: "circle",
        type: "bar",
        borderRadius: 8,
        boxWidth: 1000
      },

    ],
  };
};

export default getSubmissionsData;
