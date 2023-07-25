import moment from "moment";


const getMessagesAndReactionsData = (apiData, filterType) => {
  const labels = apiData.map((item) => moment(item?.date).format("DD/MM"));

  const messagesData = apiData.map((item) => item?.counts.discordMessage);
  const reactionsData = apiData.map((item) => item?.counts.discordReaction);
  const interactionsData = apiData.map((item) => item?.counts.discordInteraction);

  return {
    labels: labels,
    datasets: [
      {
        label: "\nMessages",
        data: messagesData,
        fill: false,
        backgroundColor: "#2A8D5C",
        pointRadius: 5,
        pointStyle: "circle",
        borderColor: "#2A8D5C",
      },
      {
        label: "\nReactions",
        data: reactionsData,
        fill: false,
        pointRadius: 5,
        pointStyle: "circle",
        backgroundColor: "#9DCAFF",
        borderColor: "#9DCAFF",
      },
      {
        label: "\n\nInteractions",
        data: interactionsData,
        pointRadius: 5,
        pointStyle: "circle",
        fill: false,
        backgroundColor: "#AF9EFF",
        borderColor: "#AF9EFF",
      },
    ],
  };
};

export default getMessagesAndReactionsData;
