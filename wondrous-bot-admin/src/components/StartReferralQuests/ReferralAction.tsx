import { Masonry } from "@mui/lab";
import { Box } from "@mui/material";
import { useMemo } from "react";
import IndividualQuestComponent from "./IndividualQuestComponent";
import { useDiscordConnect } from "./utils/hooks";
import { SharedSecondaryButton } from "components/Shared/styles";
import { shouldDisplayJoinDiscordButton } from "./utils/customization";

const EndedCampaignPrompt = ({ orgId }) => {
  const { isMember, handleJoinDiscord } = useDiscordConnect({
    orgId,
  });

  const handleClick = () => {
    return handleJoinDiscord({
      shouldVerify: false,
    });
  };

  return (
    <Box height="100%" flex="1">
      <SharedSecondaryButton onClick={handleClick}>{isMember ? "Visit Discord" : "Join Discord"}</SharedSecondaryButton>
    </Box>
  );
};

const ReferralAction = ({ quests, onStartQuest, hasEnded = false, orgId }) => {
  const masonryColumnsConfig = useMemo(() => {
    if (quests?.length <= 1) {
      return { xs: 1 };
    } else if (quests?.length <= 2) {
      return { xs: 1, sm: 2 };
    }
    return { xs: 1, sm: 2, md: 2, lg: 3 };
  }, [quests?.length]);

  const showDiscordButton = shouldDisplayJoinDiscordButton(orgId);
  if (hasEnded && showDiscordButton) return <EndedCampaignPrompt orgId={orgId} />;
  return (
    <Box
      bgcolor="#AF9EFF"
      height="100%"
      padding="32px 56px"
      display="flex"
      width="100%"
      flex="1"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Masonry
        spacing={4}
        columns={masonryColumnsConfig}
        sx={{
          alignContent: "center",
          width: "100%",
        }}
      >
        {quests?.map((quest, index) => (
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            sx={{
              maxWidth: "350px",
            }}
          >
            <IndividualQuestComponent quest={quest} key={index} onStartQuest={onStartQuest} />
          </Box>
        ))}
      </Masonry>
    </Box>
  );
};

export default ReferralAction;
