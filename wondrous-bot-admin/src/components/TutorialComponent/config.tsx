import { Grid, Typography } from "@mui/material";
import { ModalContent, ModalHeader } from "components/Shared/Modal/styles";
import { TUTORIALS } from "utils/constants";
import ContentComponent from "./ContentComponent";
import { ActiveQuestContent } from "./helpers";

export const config = [
  {
    path: "/",
    id: TUTORIALS.COMMUNITIES_HOME_GUIDE,
    disableInteraction: false,
    steps: [
      {
        selector: "[data-tour=connect-discord-button]",
        content: () => (
          <ContentComponent title="Add Bot">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              Add the bot to your Discord server to get started.
            </Typography>
          </ContentComponent>
        ),
        nextButtonTitle: "Done",
        prevButtonTitle: "Skip",
        prevAction: "skip",
      },
    ],
  },
  {
    path: "/quests",
    id: TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE,
    disableInteraction: true,
    steps: [
      {
        selector: "[data-tour=tutorial-quest-select]",
        nextButtonTitle: "Next",
        action: () => {},
        prevButtonTitle: "Skip",
        content: () => (
          <ContentComponent title="Quests">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              You can toggle active and inactive quests here. We created default quests for your to use as templates but
              they are inactive currently.
            </Typography>
          </ContentComponent>
        ),
      },
      {
        selector: "[data-tour=tutorial-quest-card]",
        nextButtonTitle: "Visit Quest",
        action: () => window.scrollTo(0, 0),
        prevButtonTitle: "Skip",
        nextHref: "/quests/:id?edit=true",
        content: () => (
          <ContentComponent title="Quests">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              Your quests will appear here. For now we created some default quests for you! Click on the first quest to
              view and activate it.
            </Typography>
          </ContentComponent>
        ),
      },
    ],
  },
  {
    path: "/quests/:id",
    id: TUTORIALS.COMMUNITIES_QUEST,
    steps: [
      {
        selector: "[data-tour=tutorial-quest-rewards]",
        id: "tutorial-quest-rewards",
        content: () => (
          <ContentComponent title="Rewards">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              You can set up points rewards. You can also add multiple rewards for a quest. Click{" "}
              <strong>Add More</strong> to add more rewards.
            </Typography>
          </ContentComponent>
        ),
        prevButtonTitle: "Skip",
        prevAction: "skip",
      },
      {
        selector: ".tutorials-quest-reward-modal",
        id: "tutorial-add-rewards",
        position: [50, 500],
        highlightedSelectors: [".tour-default-modal"],
        mutationObservables: [".tour-default-modal"],
        resizeObservables: [".tour-default-modal"],
        disableInteraction: true,
        content: () => (
          <ContentComponent title="Add Rewards">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              You can set up <strong>Discord Roles</strong> as rewards for your quests. You can also set up{" "}
              <strong>POAP and token rewards</strong>.
            </Typography>
          </ContentComponent>
        ),
      },
      {
        selector: "[data-tour=tutorial-activate-quest]",
        id: "tutorial-activate-quest",
        content: () => <ActiveQuestContent />,
        nextButtonTitle: "Done",
      },
    ],
  },
];
