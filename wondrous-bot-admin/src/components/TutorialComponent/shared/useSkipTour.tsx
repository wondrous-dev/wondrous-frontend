import { useTour } from "@reactour/tour";
import ContentComponent from "../ContentComponent";
import { Box, useMediaQuery } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import { doArrow } from "../utils";

const useSkipTour = () => {
  const onClose = () => {
    setIsOpen(false);
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

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
      selector: '[data-tour="tour-tutorial-link"]',
      hideButtons: true,
      position: "right",
      content,
    },
  ];

  const steps = isMobile ? mobileSteps : desktopSteps;

  const { setIsOpen, setSteps, setCurrentStep } = useTour();
  const skipTour = () => {
    setIsOpen(false);
    setSteps(steps);
    setCurrentStep(0);
    setIsOpen(true);
  };
  return {
    skipTour,
  };
};

export default useSkipTour;
