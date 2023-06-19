import { Typography } from "@mui/material";
import { ModalContent, ModalHeader } from "components/Shared/Modal/styles";
import { TUTORIALS } from "utils/constants";
import ContentComponent from "./ContentComponent";

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
        selector: '[data-tour=tutorial-quest-card]',
        nextButtonTitle: "Visit Quest",
        prevButtonTitle: "Skip",
        nextHref: "/quests/:id?edit=true",
        content: () => (
          <ContentComponent title="Quests">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              Your quests will appear here. Click on a quest to view and activate it.
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
        position: [40, 40],
        highlightedSelectors: ['.tutorials-quest-reward-modal'],
        mutationObservables: ['.tour-default-modal'],

        content: () => (
          <ContentComponent title="Rewards">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              These are the rewards for completing the quest. You can set multiple rewards for a quest. Click Add More to add more rewards.
            </Typography>
          </ContentComponent>
        ),
      },
      {
        selector: "[data-tour=tutorial-activate-quest]",
        content: () => (
          <ContentComponent title="Activate Quest">
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              Use this toggle to activate or deactivate the quest.
            </Typography>
          </ContentComponent>
        ),
        nextButtonTitle: "Done",
      }
    ],
  },
];
