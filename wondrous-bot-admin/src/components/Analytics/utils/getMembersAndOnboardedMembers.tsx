import moment from "moment";

const getMembersAndOnboardedMembers = (apiData, activeFilter) => {
  const labels = apiData.map((item) => moment(item?.date).format("MM/DD"));
  const total = apiData.map((item) => item?.total);

    return {
      labels,
      datasets: [
        {
          label: "\nOnboarded",
          data: total,
          fill: false,
          backgroundColor: "#F8AFDB",
          pointRadius: 5,
          pointStyle: "circle",
          borderColor: "#F8AFDB",
        },
        
      ],
    };
  };
  
  export default getMembersAndOnboardedMembers;
  