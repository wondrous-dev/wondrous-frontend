import Confetti from "react-confetti";
import useWindowSize from "utils/useWindowSize";

const ConfettiComponent = ({ shouldShow = false, confettiProps = {} }) => {
  const { height, width } = useWindowSize();
  return (
    <Confetti
      style={{
        zIndex: 9999,
      }}
      height={height}
      width={width}
      {...confettiProps}
    />
  );
};

export default ConfettiComponent;
