import Confetti from "react-confetti";
import useWindowSize from "utils/useWindowSize";

const ConfettiComponent = ({ shouldShow = false }) => {
  const { height, width } = useWindowSize();
  if (!shouldShow) return;
  return <Confetti 
  style={{
    zIndex: 9999,
  }}
  height={height} width={width} />;
};

export default ConfettiComponent;