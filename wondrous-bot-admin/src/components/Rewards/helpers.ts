export const getRewardMethodOptionButtonStyle = (isActive, isUnavailable) => ({
  style: {
    flex: 1,
    width: "100%",
    opacity: isUnavailable ? 0.7 : 1,
  },
  background: isActive ? "#BFB4F3" : "#BFB4F366",
  borderColor: isActive ? "#000" : "transparent",
  justifyContent: "flex-start",
  height: "44px",
  padding: "10px",
  minWidth: "fit-content",
});

