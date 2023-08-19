import { Box, Dialog, Grid, List, ListItem, ListItemButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import CommunitySurveyImage from "assets/questTemplatesImages/communitySurvey.jpeg";
import CustomOnchainVerificationImage from "assets/questTemplatesImages/customOnchainVerification.jpeg";
import CustomProductVerificationImage from "assets/questTemplatesImages/customProductVerification.jpeg";
import GatherFeatureIdeasImage from "assets/questTemplatesImages/gatherFeatureIdeas.jpeg";
import GetBugReportImage from "assets/questTemplatesImages/getBugReport.jpeg";
import GetDiscordEngagementImage from "assets/questTemplatesImages/getDiscordEngagement.jpeg";
import GetDiscordEventAttendanceImage from "assets/questTemplatesImages/getDiscordEventAttendance.jpeg";
import GetEngineeringContributionsImage from "assets/questTemplatesImages/getEngineeringContributions.jpeg";
import GetProductFeedbackImage from "assets/questTemplatesImages/getProductFeedback.jpeg";
import GetYoutubeLikesImage from "assets/questTemplatesImages/getYoutubeLikes.jpeg";
import HaveMembersInviteFriendsImage from "assets/questTemplatesImages/haveMembersInviteFriends.jpeg";
import HostAContentContestImage from "assets/questTemplatesImages/hostAContentContest.jpeg";
import IncreaseTwitterFollowersImage from "assets/questTemplatesImages/increaseTwitterFollowers.jpeg";
import LaunchAMemeContestImage from "assets/questTemplatesImages/launchAMemeContest.jpeg";
import LaunchSnapshotProposalImage from "assets/questTemplatesImages/launchSnapshotProposal.jpeg";
import OnboardYourCommunityImage from "assets/questTemplatesImages/onboardYourCommunity.jpeg";
import PromoteATweetImage from "assets/questTemplatesImages/promoteATweet.jpeg";
import StartFromScratchImage from "assets/questTemplatesImages/startFromScratch.jpeg";
import VerifyTokenHoldingsImage from "assets/questTemplatesImages/verifyTokenHoldings.jpeg";
import VerifyYourSubscriptionImage from "assets/questTemplatesImages/verifyYourSubscription.jpeg";
import CloseModalIcon from "components/Icons/CloseModal";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";
import { SharedSecondaryButton } from "components/Shared/styles";
import React, { Suspense, useState } from "react";
import { TYPES } from "utils/constants";
import { usePaywall, useSubscription } from "utils/hooks";

const EcosystemFeature = React.lazy(() => import("components/PremiumFeatureDialog/ecosystem"));

const questTemplateCategories = {
  all: "See All",
  socialMedia: "Social Media",
  product: "Product",
  community: "Community",
  tokens: "Tokens",
};

const rewardTypePoints = "points";

const questTemplates: {
  [key: string]: {
    category?: (typeof questTemplateCategories)[keyof typeof questTemplateCategories];
    text: string;
    image: string;
    steps?: any[];
    rewards?: {
      type: string;
      value: number;
    }[];
    isCustom?: boolean;
  };
} = {
  startFromScratch: {
    text: "Start From Scratch",
    image: StartFromScratchImage,
    steps: [],
    rewards: [
      {
        type: rewardTypePoints,
        value: 0,
      },
    ],
  },
  communitySurvey: {
    text: "Community survey",
    image: CommunitySurveyImage,
    category: questTemplateCategories.community,
    steps: [
      {
        type: TYPES.TEXT_FIELD,
        value: "How has your experience been with our community so far?",
      },
      {
        type: TYPES.TEXT_FIELD,
        value: "What are some improvements we can make?",
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  gatherFeatureIdeas: {
    text: "Gather feature ideas",
    image: GatherFeatureIdeasImage,
    category: questTemplateCategories.product,
    steps: [
      {
        type: TYPES.TEXT_FIELD,
        value: "What is your idea for a feature?",
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  getYoutubeLikes: {
    text: "Get YouTube likes",
    image: GetYoutubeLikesImage,
    category: questTemplateCategories.socialMedia,
    steps: [{ type: TYPES.LIKE_YT_VIDEO }],
    rewards: [
      {
        type: rewardTypePoints,
        value: 5,
      },
    ],
  },
  verifyTokenHoldings: {
    text: "Verify Token Holdings",
    image: VerifyTokenHoldingsImage,
    category: questTemplateCategories.tokens,
    steps: [{ type: TYPES.VERIFY_TOKEN_HOLDING }],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  getDiscordEngagement: {
    text: "Get Discord engagement",
    image: GetDiscordEngagementImage,
    category: questTemplateCategories.community,
    steps: [
      {
        type: TYPES.DISCORD_MESSAGE_IN_CHANNEL,
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  getDiscordEventAttendance: {
    text: "Get Discord event attendance",
    image: GetDiscordEventAttendanceImage,
    category: questTemplateCategories.community,
    steps: [
      {
        type: TYPES.DISCORD_EVENT_ATTENDANCE,
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 15,
      },
    ],
  },
  getEngineeringContributions: {
    text: "Get engineering contributions",
    image: GetEngineeringContributionsImage,
    category: questTemplateCategories.product,
    steps: [
      {
        type: TYPES.TEXT_FIELD,
        value: "Submit PR to Github issues",
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 25,
      },
    ],
  },
  getProductFeedback: {
    text: "Get Product Feedback",
    image: GetProductFeedbackImage,
    category: questTemplateCategories.product,
    steps: [
      {
        type: TYPES.TEXT_FIELD,
        value: "What was your favorite thing about our product (was it useful, fun, etc)?",
      },
      {
        type: TYPES.TEXT_FIELD,
        value: "What could have been improved on?",
      },
      {
        type: TYPES.TEXT_FIELD,
        value: "Are there any features you would have liked",
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 15,
      },
    ],
  },
  haveMembersInviteFriends: {
    text: "Have members invite friends",
    image: HaveMembersInviteFriendsImage,
    category: questTemplateCategories.community,
    steps: [
      {
        type: TYPES.TEXT_FIELD,
        value: "Submit your Discord invite link so we can check referrals",
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 20,
      },
    ],
  },
  hostContentContest: {
    text: "Host content contest",
    image: HostAContentContestImage,
    category: questTemplateCategories.socialMedia,
    steps: [{ type: TYPES.TWEET_WITH_PHRASE }],
    rewards: [
      {
        type: rewardTypePoints,
        value: 50,
      },
    ],
  },
  increaseTwitterFollowers: {
    text: "Increase Twitter Followers",
    image: IncreaseTwitterFollowersImage,
    category: questTemplateCategories.socialMedia,
    steps: [{ type: TYPES.FOLLOW_TWITTER }, { type: TYPES.REPLY_TWEET }],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  launchMemeContest: {
    text: "Launch Meme contest",
    image: LaunchAMemeContestImage,
    category: questTemplateCategories.socialMedia,
    steps: [{ type: TYPES.ATTACHMENTS, value: "Winner gets 50 USDC, Runner up 25 and third place 10 USDC" }],
    rewards: [
      {
        type: rewardTypePoints,
        value: 5,
      },
    ],
  },
  launchSnapshotProposal: {
    text: "Launch Snapshot proposal",
    image: LaunchSnapshotProposalImage,
    category: questTemplateCategories.community,
    steps: [
      {
        type: TYPES.SNAPSHOT_PROPOSAL_VOTE,
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 20,
      },
    ],
  },
  onboardCommunity: {
    text: "Onboard Your Community",
    image: OnboardYourCommunityImage,
    category: questTemplateCategories.community,
    steps: [
      {
        type: TYPES.MULTI_QUIZ,
        value: {
          question: "go to our website (X) and answer these questions",
          withCorrectAnswers: false,
          multiSelectValue: TYPES.MULTI_QUIZ,
          answers: [
            {
              value: "",
              isCorrect: true,
            },
          ],
        },
      },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  promoteATweet: {
    text: "Promote a Tweet",
    image: PromoteATweetImage,
    category: questTemplateCategories.socialMedia,
    steps: [{ type: TYPES.LIKE_TWEET }, { type: TYPES.REPLY_TWEET }],
    rewards: [
      {
        type: rewardTypePoints,
        value: 5,
      },
    ],
  },
  reportABug: {
    text: "Report a bug",
    image: GetBugReportImage,
    category: questTemplateCategories.product,
    steps: [
      {
        type: TYPES.TEXT_FIELD,
        value: "What is the bug you found?",
      },
      { type: TYPES.ATTACHMENTS, value: "Attach a screenshot if applicable" },
    ],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  verifyYoutubeSubscription: {
    text: "Verify YouTube Subscription",
    image: VerifyYourSubscriptionImage,
    category: questTemplateCategories.socialMedia,
    steps: [{ type: TYPES.SUBSCRIBE_YT_CHANNEL }],
    rewards: [
      {
        type: rewardTypePoints,
        value: 10,
      },
    ],
  },
  customProductVerification: {
    text: "Custom product verification",
    image: CustomProductVerificationImage,
    category: questTemplateCategories.product,
    isCustom: true,
  },
  customOnChainVerification: {
    text: "Custom on-chain verification",
    image: CustomOnchainVerificationImage,
    category: questTemplateCategories.tokens,
    isCustom: true,
  },
};

const useFilteredQuestTemplateByCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(questTemplateCategories.all);
  const filteredQuestTemplates =
    selectedCategory === questTemplateCategories.all
      ? questTemplates
      : Object.keys(questTemplates).reduce((obj, key) => {
          if (selectedCategory !== questTemplates[key].category) return obj;
          obj[key] = questTemplates[key];
          return obj;
        }, {});
  return {
    setSelectedCategory,
    selectedCategory,
    filteredQuestTemplates,
  };
};

const useHandleSelectTemplate = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [ecoSystemFeatureModal, setEcoSystemFeatureModal] = useState({
    open: false,
    message: "",
  });
  const { setPaywall, setPaywallMessage } = usePaywall();
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);

  const handleSetEcoSystemFeatureModalOnClose = () => setEcoSystemFeatureModal({ open: false, message: "" });

  const handleSelectTemplate = (questTemplate) => () => {
    const { isCustom, text } = questTemplates[questTemplate];
    if (isCustom && plan === PricingOptionsTitle.Basic) {
      setPaywall(true);
      setPaywallMessage(`${text} is a premium template`);
      return;
    }
    if (isCustom && plan !== PricingOptionsTitle.Basic) {
      setEcoSystemFeatureModal({
        open: true,
        message: `Please talk to your sales representative to add ${text}`,
      });
      return;
    }
    setSelectedTemplate(questTemplate);
  };
  return {
    selectedTemplate,
    ecoSystemFeatureModal,
    handleSelectTemplate,
    handleSetEcoSystemFeatureModalOnClose,
    setSelectedTemplate,
  };
};

const useIsScreenSmDown = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
};

type QuestTemplateModalProps = {
  open: boolean;
  setSteps: React.Dispatch<React.SetStateAction<any>>;
  setOpen: React.Dispatch<React.SetStateAction<any>>;
  setQuestSettings: React.Dispatch<React.SetStateAction<any>>;
};

const QuestTemplateModal = ({ open, setOpen, setSteps, setQuestSettings }: QuestTemplateModalProps) => {
  const { selectedCategory, setSelectedCategory, filteredQuestTemplates } = useFilteredQuestTemplateByCategory();

  const {
    selectedTemplate,
    ecoSystemFeatureModal,
    handleSelectTemplate,
    handleSetEcoSystemFeatureModalOnClose,
    setSelectedTemplate,
  } = useHandleSelectTemplate();

  const handleSelectCategory = (categoryValue) => () => {
    setSelectedCategory(() => categoryValue);
    setSelectedTemplate(() => null);
  };

  const handleTemplateCreate = () => {
    const template = questTemplates[selectedTemplate];
    const steps = template.steps.map((step, i) => ({
      order: i + 1,
      required: true,
      value: "",
      ...step,
    }));
    setQuestSettings((prev) => ({
      ...prev,
      rewards: template.rewards,
    }));
    setSteps(steps);
    setOpen(false);
  };

  return (
    <>
      <Suspense>
        <EcosystemFeature
          open={ecoSystemFeatureModal.open}
          onClose={handleSetEcoSystemFeatureModalOnClose}
          paywallMessage={ecoSystemFeatureModal.message}
        />
      </Suspense>

      <Dialog
        open={open}
        fullScreen={useIsScreenSmDown()}
        onClose={() => setOpen(false)}
        sx={{
          overflow: "hidden",
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            border: "1px solid black",
            overflow: "hidden",
            boxSizing: "border-box",
            maxWidth: useIsScreenSmDown() ? "100%" : "900px",
          },
        }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "#AF9EFFCC", backdropFilter: "blur(5px)" },
          },
        }}
      >
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="center"
          bgcolor="#2A8D5C"
          height="58px"
          padding="14px"
        >
          <Typography color="#fff" fontWeight="500" fontFamily="Poppins">
            Create New Quest
          </Typography>
          <Grid
            container
            alignItems="center"
            width="30px"
            height="30px"
            justifyContent="center"
            borderRadius="6px"
            bgcolor="#C1B6F6"
            onClick={() => setOpen(false)}
            sx={{
              cursor: "pointer",
            }}
          >
            <CloseModalIcon strokeColor="#000000" />
          </Grid>
        </Grid>
        <Grid
          item
          container
          flexGrow="1"
          overflow="hidden"
          flexDirection={{ xs: "column", md: "row" }}
          flexWrap="nowrap"
          justifyContent="flex-start"
          width="100%"
          height={{ xs: "100%", sm: "600px", md: "550px" }}
          minWidth={{
            xs: 0,
            sm: "790px",
            md: "830px",
          }}
        >
          <List
            sx={{
              padding: "12px",
              height: "80px",
              display: "flex",
              flexDirection: {
                xs: "row",
                md: "column",
              },
              flexWrap: {
                xs: "wrap",
                md: "nowrap",
              },
              gap: "8px",
              width: {
                xs: "fit-content",
                md: "192px",
              },
            }}
          >
            {Object.keys(questTemplateCategories).map((category) => {
              const categoryValue = questTemplateCategories[category];
              const isSelected = categoryValue === selectedCategory;
              return (
                <ListItem
                  key={categoryValue}
                  disablePadding
                  sx={{
                    borderRadius: "6px",
                    width: {
                      xs: "fit-content",
                      md: "192px",
                    },
                    background: isSelected ? "#AF9EFF" : "#f1f1f1",
                    outline: isSelected && "1px solid black",
                    height: "37px",
                    "&:hover": {
                      background: "#AF9EFF",
                      outline: "1px solid black",
                    },
                  }}
                >
                  <ListItemButton
                    disableRipple
                    disableTouchRipple
                    onClick={handleSelectCategory(categoryValue)}
                    sx={{
                      padding: "12px",
                      height: "100%",
                    }}
                  >
                    <Typography fontFamily="Poppins" fontSize="13px" margin="0" fontWeight="500">
                      {categoryValue}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Grid
            item
            container
            padding="12px"
            height="100%"
            flexDirection="column"
            flexWrap="nowrap"
            flexGrow="1"
            minWidth={{
              xs: 0,
              md: "600px",
            }}
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                WebkitAppearance: "none",
                background: " #fff",
                width: "20px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(0, 0, 0, 0.20);",
                border: "6px solid transparent",
                backgroundClip: "padding-box",
                borderRadius: "20px",
              },
              "&::-webkit-scrollbar-thumb": {
                border: "6px solid transparent",
                background: "#2A8D5C",
                backgroundClip: "padding-box",
                borderRadius: "100px",
              },
            }}
          >
            <List
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                width: "100%",
                alignItems: "stretch",
              }}
            >
              {Object.keys(filteredQuestTemplates).map((questTemplate) => {
                const questTemplateValue = filteredQuestTemplates[questTemplate];
                const isSelected = selectedTemplate === questTemplate;
                return (
                  <ListItem
                    key={questTemplateValue.text}
                    disablePadding
                    sx={{
                      width: {
                        xs: "calc(50% - 4px)",
                        sm: "calc(33% - 4px)",
                      },
                      minWidth: {
                        xs: "calc(50% - 4px)",
                        sm: "180px",
                      },
                      background: isSelected ? "#AF9EFF" : "#f1f1f1",
                      padding: 0,
                      borderRadius: "12px",
                      overflow: "hidden",
                      outline: isSelected && "1px solid black",
                      "&:hover": {
                        background: "#AF9EFF",
                        outline: "1px solid black",
                        "& img": {
                          opacity: "70%",
                        },
                      },
                    }}
                  >
                    <ListItemButton
                      disableRipple
                      disableTouchRipple
                      onClick={handleSelectTemplate(questTemplate)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        height: "100%",
                      }}
                    >
                      <img
                        src={questTemplateValue.image}
                        style={{ display: "block", width: "100%", opacity: isSelected && "70%" }}
                      />
                      <Typography fontFamily="Poppins" padding="14px" margin="0" fontWeight="500">
                        {questTemplateValue.text}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            {selectedCategory !== questTemplateCategories.all && (
              <Grid container item width="fit-content" paddingY="24px">
                <Typography fontFamily="Poppins">
                  Want to make your own?{" "}
                  <Box
                    display="inline"
                    color="#3E96FF"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => setOpen(false)}
                  >
                    Start from scratch
                  </Box>
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          container
          borderTop="1px solid black"
          width="100%"
          height="88px"
          justifyContent="flex-end"
          padding="24px 14px"
          gap="24px"
          zIndex="100"
          justifySelf="end"
        >
          <SharedSecondaryButton
            onClick={() => setOpen(false)}
            background="transparent"
            width="140px"
            sx={{
              outline: "1px solid #84BCFF",
            }}
          >
            Cancel
          </SharedSecondaryButton>
          <SharedSecondaryButton onClick={handleTemplateCreate} width="140px" disabled={!selectedTemplate}>
            Create
          </SharedSecondaryButton>
        </Grid>
      </Dialog>
    </>
  );
};

export default QuestTemplateModal;
