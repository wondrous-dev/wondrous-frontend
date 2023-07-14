const getMembersAndOnboardedMembers = () => {
    return {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [
        {
          label: "\nOnboarded",
          data: [12, 19, 3, 5, 2, 0, 0],
          fill: false,
          backgroundColor: "#F8AFDB",
          pointRadius: 5,
          pointStyle: "circle",
          borderColor: "#F8AFDB",
        },
        {
          label: "\nReactions",
          data: [1, 2, 1, 1, 2, 0, 12],
          fill: false,
          pointRadius: 5,
          pointStyle: "circle",
          backgroundColor: "#F8642D",
          borderColor: "#F8642D",
        },
      ],
    };
  };
  
  export default getMembersAndOnboardedMembers;
  