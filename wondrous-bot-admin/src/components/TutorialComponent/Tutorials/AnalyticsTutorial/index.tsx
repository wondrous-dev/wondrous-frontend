import { Box, useMediaQuery } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useContext, useEffect, useMemo, useState } from "react";
import ModalComponent from "../../ModalComponent";
import FinishModalComponent from "../shared/FinishModalComponent";
import { ModalLabel, ModalTextBody } from "../../styles";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import { useUserCompletedGuides } from "utils/hooks";
import ContentComponent from "../../ContentComponent";
import { getNodePosition } from "utils/common";
import { doArrow } from "../../utils";

const AnalyticsTutorial = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const { setIsOpen, setCurrentStep, setSteps } = useTour();

  const completedGuides = useUserCompletedGuides();
  const { handleTourVisit, shouldForceOpenTour, setShouldForceOpenTour } = useContext(TourDataContext);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleStart = () => {
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.ANALYTICS_PAGE_GUIDE);
  };
  const handleSkip = () => {
    handleTourVisit(TUTORIALS.ANALYTICS_PAGE_GUIDE);
  };

  const handleTourStart = () => {
    if ((completedGuides && !completedGuides?.includes(TUTORIALS.ANALYTICS_PAGE_GUIDE)) || shouldForceOpenTour) {
      setIsModalOpen(true);
      if (shouldForceOpenTour) setShouldForceOpenTour(false);
    }
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const { x, y } = useMemo(() => {
    return getNodePosition("[data-tour=tutorial-analytics-graphs]");
  }, []);

  const { x: x2, y: y2 } = useMemo(() => {
    return getNodePosition("[data-tour=tutorial-analytics-leaderboard-title]");
  }, []);

  const { x: x3, y: y3 } = useMemo(() => {
    return getNodePosition("[data-tour=tutorial-analytics-users-leaderboard-title]");
  }, []);

  const steps: any = [
    {
      selector: "[data-tour=tutorial-analytics-filters]",
      position: "right",
      content: () => (
        <ContentComponent
          content="Set the date range of data"
          subHeader="You can use this filter to change the time range displayed"
          typographyProps={{
            textAlign: "left",
          }}
          wrapperProps={{
            sx: {
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
            },
          }}
        />
      ),
    },
    {
      selector: "[data-tour=tutorial-analytics-graphs-selector]",
      resizeObservables: ["[data-tour=tutorial-analytics-graphs]"],
      mutationObservables: ["[data-tour=tutorial-analytics-graphs]"],
      highlightedSelectors: ["[data-tour=tutorial-analytics-graphs]"],
      position: isMobile ? "top" : [x + 600, y - 200],
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "white", "top", 150),
          };
        },
      },
      content: () => (
        <ContentComponent
          content="Here you can see your engagement is over-time."
          typographyProps={{
            textAlign: "left",
          }}
          wrapperProps={{
            sx: {
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
            },
          }}
        />
      ),
    },
    {
      selector: "[data-tour=tutorial-analytics-leaderboard-title]",
      resizeObservables: ["[data-tour=tutorial-analytics-leaderboard-table]"],
      mutationObservables: ["[data-tour=tutorial-analytics-leaderboard-table]"],
      highlightedSelectors: ["[data-tour=tutorial-analytics-leaderboard-table]"],
      position: "top",
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "white", "top", 150),
          };
        },
      },
      content: () => (
        <ContentComponent
          content="Analyze your most engaged quests"
          subHeader="Analyze your most engaged quests. Use this information to make better quests."
          typographyProps={{
            textAlign: "left",
          }}
          wrapperProps={{
            sx: {
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
            },
          }}
        />
      ),
    },
    {
      selector: "[data-tour=tutorial-analytics-users-leaderboard-title]",
      resizeObservables: ["[data-tour=tutorial-analytics-users-leaderboard-table]"],
      mutationObservables: ["[data-tour=tutorial-analytics-users-leaderboard-table]"],
      highlightedSelectors: ["[data-tour=tutorial-analytics-users-leaderboard-table]"],
      position: "top",
      handleNextAction: () => {
        setIsOpen(false);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        setIsFinishModalOpen(true);
      },
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "white", "top", 150),
          };
        },
      },
      content: () => (
        <ContentComponent
          content="Uncover your super fans here!"
          typographyProps={{
            textAlign: "left",
          }}
          wrapperProps={{
            sx: {
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
            },
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    handleTourStart();
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps(steps);
    };
  }, [shouldForceOpenTour]);

  return (
    <>
      {isFinishModalOpen ? (
        <FinishModalComponent
          onClose={() => setIsFinishModalOpen(false)}
          header={"Analytics tour complete!"}
          imgBgColor={"#D5AEFD"}
          img={"/images/tour-images/analytics-page.png"}
          subHeader={"With better data, we can make better decisions."}
          bodyText={"To learn more about our other features, just select them on the sidebar and begin the tour."}
        />
      ) : null}

      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={handleModalClose}
        imgSrc={"/images/tour-images/analytics-page.png"}
        onStart={handleStart}
        onSkip={handleSkip}
      >
        <Box display="flex" flexDirection="column" gap="8px">
          <ModalLabel>Get better data with Analytics</ModalLabel>
          <ModalTextBody>Access the data you need to make better decisions with analytics. </ModalTextBody>
        </Box>
      </ModalComponent>
    </>
  );
};

export default AnalyticsTutorial;
