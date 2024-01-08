import { useContext, useEffect, useRef, useState } from "react";
import ModalComponent from "../ModalComponent";
import { Box } from "@mui/material";
import { TUTORIALS } from "utils/constants";
import { ModalLabel, ModalTextBody } from "../styles";
import { useTour } from "@reactour/tour";
import { TourDataContext } from "utils/context";
import useSkipTour from "../shared/useSkipTour";
import { useUserCompletedGuides } from "utils/hooks";
import ContentComponent from "../ContentComponent";
import { FAKE_DATA } from "./fakeUsers";

const MembersTutorial = ({ setMembersData, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodes = useRef([]);
  const steps: any = [
    {
      selector: "[data-tour=tutorial-members-table]",
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
      action: (node) => {
        const usernameElement = node.querySelector("[data-tour=tutorial-members-username]");
        const action = () => {
          setCurrentStep(1);
        };
        usernameElement.addEventListener("click", action);
        nodes.current.push({
          element: usernameElement,
          event: "click",
          action,
        });
      },
    },
    {
      selector: ".tutorials-onboarding-modal",
      position: "top",
      id: "tutorial-add-rewards",
      mutationObservables: [".tour-default-modal", ".tutorials-onboarding-modal"],
      disableInteraction: true,
      content: () => (
        <ContentComponent
          content="Here is a sample data from Dwight."
          subHeader="You can see what quests they’ve submitted."
        />
      ),
    },
  ];
  const completedGuides = [];
  //   const completedGuides = useUserCompletedGuides();
  const { handleTourVisit } = useContext(TourDataContext);
  const { setIsOpen, setCurrentStep, currentStep, setSteps } = useTour();
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleStart = () => {
    setMembersData([]);
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.MEMBERS_PAGE_GUIDE);
    setMembersData(FAKE_DATA);
  };
  const handleSkip = () => {
    handleTourVisit(TUTORIALS.MEMBERS_PAGE_GUIDE);
  };

  const handleTourStart = () => {
    if (completedGuides && !completedGuides?.includes(TUTORIALS.MEMBERS_PAGE_GUIDE)) {
      setIsModalOpen(true);
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
  }, []);

  return (
    <ModalComponent
      isModalOpen={isModalOpen}
      onClose={handleModalClose}
      imgSrc={"/images/tour-images/homepage.png"}
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
  );
};

export default MembersTutorial;
