import { useTour } from "@reactour/tour";
import ContentComponent from "../../ContentComponent";
import { Box, useMediaQuery } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import { doArrow } from "../../utils";
import { useContext, useMemo } from "react";
import { TourDataContext } from "utils/context";

const useSkipTour = () => {
  const onClose = () => {
    setIsOpen(false);
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  const getTutorialLinkPosition = () => {
    const element = document.querySelector("[data-tour=tour-tutorial-link]");
    if (element) {
      const x = element?.getBoundingClientRect().x;
      const y = element?.getBoundingClientRect().y;
      return { x, y };
    }
    return { x: 0, y: 0 };
  };

  const { x, y } = useMemo(() => getTutorialLinkPosition(), []);

  const content = () => (
    <ContentComponent
      typographyProps={{
        textAlign: "left",
      }}
      wrapperProps={{
        sx: {
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
          gap: "8px",
        },
      }}
      content="Tour closed!"
      subHeader="If you change your mind, you can always bring the tour back through the help menu"
    >
      <Box width="100%">
        <SharedSecondaryButton onClick={onClose}>Close</SharedSecondaryButton>
      </Box>
    </ContentComponent>
  );

  const mobileSteps: any = [
    {
      selector: "[data-tour=homepage-guide-menu]",
      content,
      hideButtons: true,
      position: [80, 100],
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "white", "bottom"),
          };
        },
      },
    },
  ];

  const desktopSteps: any = [
    {
      selector: "[data-tour=tour-tutorial-link]",
      hideButtons: true,
      position: [x + 200, y - 160],
      content,
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            "--rtp-arrow-left": "50px !important",
            ...doArrow(state.position, "bottom", "bottom", "white", "right"),
          };
        },
      },
    },
  ];

  const steps = isMobile ? mobileSteps : desktopSteps;

  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const { setShouldForceOpenTour, shouldForceOpenTour } = useContext(TourDataContext);
  const skipTour = () => {
    setIsOpen(false);
    setSteps(steps);
    setCurrentStep(0);
    setIsOpen(true);
    if (shouldForceOpenTour) setShouldForceOpenTour(false);
  };
  return {
    skipTour,
  };
};

export default useSkipTour;
