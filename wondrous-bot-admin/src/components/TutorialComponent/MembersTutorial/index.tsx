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
import { doArrow } from "../utils";
import FinishModalComponent from "../shared/FinishModalComponent";
import { transformUser } from "utils/transformCmtyUserToMembers";
import { getFakeData } from "./fakeUsers";

const MembersTutorial = ({ setMembersData, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fakeData = getFakeData();
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const { setIsOpen, setCurrentStep, currentStep, setSteps, meta, setMeta } = useTour();

  const handleResetData = () => {
    if (data?.length) {
      setMembersData(
        data?.map((user) => {
          return transformUser(user);
        })
      );
    }
  };
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
      action: (node) => {
        if (!meta) {
          setMeta(JSON.stringify({ hideModal: false }));
        }
        const usernameElement = node.querySelector("[data-tour=tutorial-members-username]");
        if (!usernameElement) return;
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
      position: [300, 200],
      id: "tutorial-add-rewards",
      mutationObservables: [".tour-default-modal", ".tutorials-onboarding-modal"],
      disableInteraction: true,
      handleNextAction: () => {
        handleResetData();
        setMeta(JSON.stringify({ hideModal: true }));
        return setCurrentStep(2);
      },
      styles: {
        popover: (base, state) => {
          return {
            ...base,
            background: "white",
            borderRadius: "16px",
            padding: "0px",
            zIndex: 1000000,
            ...doArrow(state.position, state.verticalAlign, state.horizontalAlign, "white", "left"),
          };
        },
      },
      content: () => (
        <ContentComponent
          content="Here is a sample data from Dwight."
          subHeader="You can see what quests they’ve submitted."
        />
      ),
    },
    {
      selector: "[data-tour=tutorial-members-table]",
      hidePrevButton: true,
      alignCenter: true,
      nextButtonTitle: "Next",
      handleNextAction: () => {
        setIsOpen(false);
        return setIsFinishModalOpen(true);
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
  const completedGuides = [];
  //   const completedGuides = useUserCompletedGuides();
  const { handleTourVisit } = useContext(TourDataContext);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleStart = () => {
    setIsModalOpen(false);
    setIsOpen(true);
    handleTourVisit(TUTORIALS.MEMBERS_PAGE_GUIDE);
    setMembersData(fakeData);
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
