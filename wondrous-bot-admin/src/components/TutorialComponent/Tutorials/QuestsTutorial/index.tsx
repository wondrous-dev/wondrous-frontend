import { useState, useEffect, useRef, useContext } from "react";
import { TUTORIALS } from "utils/constants";
import ModalComponent from "../../ModalComponent";
import { useTour } from "@reactour/tour";
import { Box, useMediaQuery } from "@mui/material";
import { ModalLabel, ModalTextBody } from "../../styles";
import ContentComponent from "../../ContentComponent";
import { TourDataContext } from "utils/context";
import { useUserCompletedGuides } from "utils/hooks";
import { useLocation } from "react-router-dom";
import FinishModalComponent from "../shared/FinishModalComponent";
import { doArrow } from "components/TutorialComponent/utils";

const QuestsTutorial = () => {
  const completedGuides = useUserCompletedGuides();
  const { handleTourVisit, setShouldForceOpenTour, shouldForceOpenTour } = useContext(TourDataContext);
  const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { search } = useLocation();

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const searchParams = new URLSearchParams(search);

  const tourQuestId = searchParams.get("tourQuestId");

  const STEPS: any = [
    {
      selector: "[data-tour=quests-page-guide-new-quest-button]",
      position: isMobile ? "bottom" : "left",
      content: () => (
        <ContentComponent
          content="Create a quest by clicking here!"
          wrapperProps={{
            sx: {
              width: "100%",
            },
          }}
        />
      ),
      ...(isMobile
        ? {
            styles: {
              popover: (base, state) => {
                return {
                  ...base,
                  background: "white",
                  borderRadius: "16px",
                  padding: "0px",
                  zIndex: 1000000,
                  ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "white", "bottom", 120),
                };
              },
            },
          }
        : {}),
      hideButtons: true,
    },
  ];

  const POST_QUEST_CREATE_STEPS: any = [
    {
      selector: `[data-tour=quest-card-${tourQuestId}]`,
      resizeObservables: [`[data-tour=quest-card-${tourQuestId}]`],
      mutationObservables: [`[data-tour=quest-card-${tourQuestId}]`],
      position: "bottom",
      hidePrevButton: true,
      alignCenter: true,
      nextButtonTitle: "Next",
      handleNextAction: () => {
        setIsFinishModalOpen(true);
        setIsOpen(false);
      },
      afterAction: () => {
        if (shouldForceOpenTour) return setShouldForceOpenTour(false);
      },
      content: () => (
        <ContentComponent
          content="Woohoo!"
          subHeader="Congrats on creating your first quest. All of the quests you create will live on this page."
          typographyProps={{
            textAlign: "center",
            paddingTop: "24px",
            paddingBottom: "8px",
          }}
          wrapperProps={{
            sx: {
              padding: "0px",
              paddingBottom: "16px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            },
          }}
        />
      ),
    },
  ];

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStart = () => {
    setSteps(STEPS);
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE);
  };

  const handleSkip = () => {
    handleTourVisit(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE);
    if (shouldForceOpenTour) setShouldForceOpenTour(false);
  };

  const handleTourStart = (shouldForceOpenTour) => {
    if (
      completedGuides &&
      (!completedGuides?.includes(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE) || shouldForceOpenTour)
    ) {
      setIsModalOpen(true);
      return;
    }
    if (
      completedGuides &&
      !completedGuides?.includes(TUTORIALS.POST_CREATE_QUEST_QUESTS_PAGE_GUIDE) &&
      completedGuides?.includes(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE) &&
      tourQuestId &&
      !shouldForceOpenTour
    ) {
      setSteps(POST_QUEST_CREATE_STEPS);
      setIsOpen(true);
      setCurrentStep(0);
    }
  };

  useEffect(() => {
    handleTourStart(shouldForceOpenTour);
  }, [shouldForceOpenTour]);

  useEffect(() => {
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps([]);
    };
  }, []);
  return (
    <>
      {isFinishModalOpen ? (
        <FinishModalComponent
          onClose={() => setIsFinishModalOpen(false)}
          header={"Quests tour complete!"}
          imgBgColor={"#D5AEFD"}
          img={"/images/tour-images/quests-page.png"}
          subHeader={"Now it’s time to get creative. Start testing out other quest templates and create your own."}
          bodyText={"To learn more about our other features, just select them on the sidebar and begin the tour."}
        />
      ) : null}
      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={handleModalClose}
        imgSrc={"/images/tour-images/quests-page.png"}
        onStart={handleStart}
        onSkip={handleSkip}
      >
        <Box display="flex" flexDirection="column" gap="8px">
          <ModalLabel>Introducing Quests</ModalLabel>
          <ModalTextBody>Quests are fun challenges that your members complete to earn rewards.</ModalTextBody>
        </Box>
      </ModalComponent>
    </>
  );
};

export default QuestsTutorial;
