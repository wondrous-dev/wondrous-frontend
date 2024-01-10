import { useContext, useEffect, useRef, useState } from "react";
import ModalComponent from "../../ModalComponent";
import { Box, useMediaQuery } from "@mui/material";
import { TUTORIALS } from "utils/constants";
import { ModalLabel, ModalTextBody } from "../../styles";
import { useTour } from "@reactour/tour";
import { TourDataContext } from "utils/context";
import { useUserCompletedGuides } from "utils/hooks";
import ContentComponent from "../../ContentComponent";
import { doArrow } from "../../utils";
import FinishModalComponent from "../shared/FinishModalComponent";
import { transformUser } from "utils/transformCmtyUserToMembers";
import { getFakeData } from "./fakeUsers";

const MembersTutorial = ({ setMembersData, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fakeData = getFakeData();
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const { setIsOpen, setCurrentStep, currentStep, setSteps, meta, setMeta } = useTour();

  const handleResetData = () => {
    setMembersData(
      data?.map((user) => {
        return transformUser(user);
      })
    );
  };

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  useEffect(() => {
    if (currentStep === 3) {
      handleResetData();
    }
  }, [currentStep]);

  const nodes = useRef([]);
  const steps: any = [
    {
      selector: "[data-tour=tutorial-members-table]",
      hideNextButton: true,
      content: () => (
        <ContentComponent
          content="We filled in your member list as if you were from the Office."
          subHeader="Here you will see the members information and participation. Get deeper insights by clicking on the users name. Let’s see what work Dwight has done."
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
      selector: isMobile ? "[data-tour=member-analytics-modal-username]" : ".tutorials-onboarding-modal",
      position: isMobile ? "bottom" : "left",
      id: "tutorial-add-rewards",
      mutationObservables: [".tour-default-modal", ".tutorials-onboarding-modal"],
      disableInteraction: true,
      handleNextAction: () => {
        setMeta(JSON.stringify({ hideModal: true }));
        return setCurrentStep(2);
      },
      ...(isMobile
        ? {
            prevButtonTypographyStyles: {
              color: "white",
            },
          }
        : {}),
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: isMobile ? "#2A8D5C" : "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(
              state.position,
              state.verticalAlign,
              state.horizontalAlign,
              isMobile ? "#2A8D5C" : "white",
              "bottom",
              isMobile ? 120 : 20
            ),
          };
        },
      },
      content: () => (
        <ContentComponent
          typographyProps={{
            color: "white",
          }}
          content="Here is a sample data from Dwight."
          subHeader="You can see what quests they’ve submitted."
        />
      ),
    },
    {
      selector: "[data-tour=tutorial-members-table]",
      mutationObservables: ["[data-tour=tutorial-members-table]"],
      hidePrevButton: true,
      alignCenter: true,
      nextButtonTitle: "Next",
      handleNextAction: () => {
        setIsOpen(false);
        return setIsFinishModalOpen(true);
      },
      action: () => {
        handleResetData();
      },
      content: () => (
        <ContentComponent
          subHeader="We removed all of your friends from “The Office”. As you onboard more members you will see their information populate here."
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
  const completedGuides = useUserCompletedGuides();
  const { handleTourVisit, setShouldForceOpenTour, shouldForceOpenTour } = useContext(TourDataContext);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleStart = () => {
    setMembersData(fakeData);
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.MEMBERS_PAGE_GUIDE);
  };

  const handleSkip = () => {
    handleTourVisit(TUTORIALS.MEMBERS_PAGE_GUIDE);
  };

  const handleTourStart = () => {
    if (completedGuides && (!completedGuides?.includes(TUTORIALS.MEMBERS_PAGE_GUIDE) || shouldForceOpenTour)) {
      setIsModalOpen(true);
      if (shouldForceOpenTour) return setShouldForceOpenTour(false);
    }
  };
  useEffect(() => {
    handleTourStart();
    return () => {
      setIsOpen(false);
      setCurrentStep(0);
      setSteps(steps);
      nodes.current.forEach(({ element, event, action }) => {
        element.removeEventListener(event, action);
      });
    };
  }, [shouldForceOpenTour]);

  return (
    <>
      {isFinishModalOpen ? (
        <FinishModalComponent
          onClose={() => setIsFinishModalOpen(false)}
          header={"Members tour complete!"}
          imgBgColor={"#D5AEFD"}
          img={"/images/tour-images/members-page.png"}
          subHeader={"As you grow your community, the network you’ve built will become more and more valuable."}
          bodyText={"To learn more about our other features, just select them on the sidebar and begin the tour."}
        />
      ) : null}

      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={handleModalClose}
        imgSrc={"/images/tour-images/members-page.png"}
        onStart={handleStart}
        onSkip={handleSkip}
      >
        <Box display="flex" flexDirection="column" gap="8px">
          <ModalLabel>Your Member CRM</ModalLabel>
          <ModalTextBody>Here is where you can get deeper insight into your community members.</ModalTextBody>
          <ModalTextBody>
            For more info check <a href="#">out this video.</a>
          </ModalTextBody>
        </Box>
      </ModalComponent>
    </>
  );
};

export default MembersTutorial;
