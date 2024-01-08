import { useState, useEffect, useRef, useContext } from "react";
import { TUTORIALS } from "utils/constants";
import ModalComponent from "../ModalComponent";
import { useTour } from "@reactour/tour";
import { Box } from "@mui/material";
import { ModalLabel, ModalTextBody } from "../styles";
import ContentComponent from "../ContentComponent";
import { TourDataContext } from "utils/context";
import { useUserCompletedGuides } from "utils/hooks";
import { useLocation } from "react-router-dom";
import FinishModalComponent from "../shared/FinishModalComponent";

const ReferralsTutorial = () => {
  // const completedGuides = [];
  const completedGuides = useUserCompletedGuides();
  const { handleTourVisit } = useContext(TourDataContext);
  const { setIsOpen, isOpen, setSteps, currentStep, setCurrentStep } = useTour();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { search } = useLocation();

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const searchParams = new URLSearchParams(search);

  const STEPS = [
    {
      selector: "[data-tour=referrals-page-guide-new-referral-button]",
      content: () => (
        <ContentComponent
          content="Create your first referral campaign by clicking here!"
          wrapperProps={{
            sx: {
              width: "100%",
            },
          }}
        />
      ),
      hideButtons: true,
    },
  ];

  const POST_REFERRAL_CREATE_STEPS: any = [
    {
      selector: "[data-tour=tutorial-referrals-table]",
      resizeObservables: ["[data-tour=tutorial-referrals-table]"],
      mutationObservables: ["[data-tour=tutorial-referrals-table]"],
      position: "bottom",
      hidePrevButton: true,
      alignCenter: true,
      nextButtonTitle: "Next",
      handleNextAction: () => {
        setIsOpen(false);
        return setIsFinishModalOpen(true);
      },
      content: () => (
        <ContentComponent
          content="Woohoo!"
          subHeader="Congrats on creating your first referral campaign. All of your referrals will live here!"
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
    handleTourVisit(TUTORIALS.REFERRAL_PAGE_GUIDE);
  };

  const handleSkip = () => handleTourVisit(TUTORIALS.REFERRAL_PAGE_GUIDE);

  const handleTourStart = () => {
    if (completedGuides && !completedGuides?.includes(TUTORIALS.REFERRAL_PAGE_GUIDE)) {
      return setIsModalOpen(true);
    }
    if (
      completedGuides &&
      !completedGuides?.includes(TUTORIALS.POST_CREATE_REFERRAL_PAGE_GUIDE) &&
      completedGuides?.includes(TUTORIALS.REFERRAL_PAGE_GUIDE)
    ) {
      handleTourVisit(TUTORIALS.POST_CREATE_REFERRAL_PAGE_GUIDE);
      setSteps(POST_REFERRAL_CREATE_STEPS);
      setIsOpen(true);
      setCurrentStep(0);
    }
  };
  useEffect(() => {
    handleTourStart();
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps([]);
    };
  }, []);

  //TODO: replace image with higher quality - ask Ben
  return (
    <>
      {isFinishModalOpen ? (
        <FinishModalComponent
          onClose={() => setIsFinishModalOpen(false)}
          header={"Referrals tour complete!"}
          imgBgColor={"#D5AEFD"}
          img={"/images/tour-images/referral-page.png"}
          subHeader={"Keep testing campaigns, rewards, and ways to get your community involved."}
          bodyText={"To learn more about our other features, just select them on the sidebar and begin the tour."}
        />
      ) : (
        false
      )}
      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={handleModalClose}
        imgSrc={"/images/tour-images/referral-page.png"}
        onStart={handleStart}
        onSkip={handleSkip}
        startButtonLabel={"Start Tour"}
      >
        <Box display="flex" flexDirection="column" gap="8px">
          <ModalLabel>Referrals make quests go viral</ModalLabel>
          <ModalTextBody>
            Referrals reward your members for promoting your quests. Let’s set a campaign together.
          </ModalTextBody>
          <ModalTextBody>
            For more info check <a href="#">out this video.</a>
          </ModalTextBody>
        </Box>
      </ModalComponent>
    </>
  );
};

export default ReferralsTutorial;
