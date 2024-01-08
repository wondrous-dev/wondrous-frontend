import { useMe } from "components/Auth";
import ContentComponent from "../ContentComponent";
import { useContext, useEffect, useState } from "react";
import { TUTORIALS } from "utils/constants";
import { TourDataContext } from "utils/context";
import { useTour } from "@reactour/tour";
import Modal from "components/Shared/Modal";
import { Box, Typography } from "@mui/material";
import { QuestScrolLGraphics } from "components/Icons/Tour";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useUserCompletedGuides } from "utils/hooks";
import { useParams } from "react-router-dom";

const ViewQuestTutorial = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const { handleTourVisit } = useContext(TourDataContext);
  let { id } = useParams();
  const completedGuides = [];
  const STEPS = [
    {
      selector: "[data-tour=tour-submissions-empty-state]",
      action: (node) => {
        const submissionsTitle = document.querySelector("[data-tour=tour-submissions-title]");
        const submissionsFilterButtons = document.querySelectorAll("[data-tour=tour-submissions-filter-buttons]") || [];
        const elements = [submissionsTitle, ...submissionsFilterButtons];
        elements.forEach((element) => {
          if (!element) return;
          element.style.zIndex = 3;
        });
      },
      content: () => (
        <ContentComponent
          content="Here is your quest view page! Your community’s submissions will appear here."
          subHeader="Browse submissions and review them here. If you want to edit the content of your quest, hit edit quest at the top!"
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
      selector: "[data-tour=tour-quest-preview-quest]",
      id: "tour-quest-preview-quest",
      content: () => {
        return (
          <ContentComponent
            content="Click here to preview the Quest in your server."
            subHeader="Preview what your members will see when you activate the quest. This will only be visible to you."
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
        );
      },
    },
    {
      selector: "[data-tour=tour-quest-preview-quest]",
      id: "tour-quest-preview-quest",
      content: () => {
        return <ContentComponent content="Connect your Discord account and press Next" />;
      },
    },
    {
      selector: "body",
      content: () => null,
      action: () => {
        setIsModalOpen(true);
        setIsOpen(false);
      },
    },
    {
      selector: "[data-tour=tour-quest-back-button]",
      hideButtons: true,
      content: () => (
        <ContentComponent content="Now you have saved your quest, press the back button to jump to all quests!" />
      ),
    },
  ];

  useEffect(() => {
    if (completedGuides && !completedGuides?.includes(TUTORIALS.POST_CREATE_QUEST)) {
      handleTourVisit(TUTORIALS.POST_CREATE_QUEST);
      setSteps(STEPS);
      setCurrentStep(0);
      setIsOpen(true);
    }
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentStep((prev) => prev + 1);
    setIsOpen(true);
  };

  return isModalOpen ? (
    <Modal
      footerCenter
      footerLeft={
        <Box width="100%" display="flex" justifyContent="center">
          <SharedSecondaryButton onClick={handleModalClose}>Continue</SharedSecondaryButton>
        </Box>
      }
      open
      noHeader
    >
      <Box display="flex" flexDirection="column" gap="9px" alignItems="center" justifyContent="center">
        <QuestScrolLGraphics />
        <Typography color="#2A8D5C" fontSize="16px" fontWeight={600} fontFamily="Poppins">
          Previewing Quest in Discord
        </Typography>
        <Typography color="black" fontSize="14px" fontWeight={500} fontFamily="Poppins">
          Once you’re done, please click continue
        </Typography>
      </Box>
    </Modal>
  ) : null;
};

export default ViewQuestTutorial;
