import { useMediaQuery } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useEffect } from "react";

// home-page-wrapper

const steps: any = [
  {
    selector: "[#home-page-guide]",

    content: () => <div>yo</div>,
    nextButtonTitle: null,
    prevButtonTitle: null,
    prevAction: null,
    // position: "center",
    highlightedSelectors: ["#home-page-wrapper"],
    mutationObservables: ["#home-page-wrapper"],
    resizeObservables: ["#home-page-wrapper"],
    disableInteraction: true,
  },
];

const useHomeTutorial = ({ hasConnectedBot = false }) => {
  const { setIsOpen, isOpen, setSteps } = useTour();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  useEffect(() => {
    if (hasConnectedBot && !isOpen) {
      setSteps(steps);
      setIsOpen(true);
    }
  }, []);
};

export default useHomeTutorial;
