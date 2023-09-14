import { Box, Grid, Typography } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { DEFAULT_BANNER_IMAGES } from "utils/constants";
import { Image } from "./styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useTakeQuest } from "utils/hooks";
import { GET_QUEST_REWARDS } from "graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { NFTIcon, PointsIcon } from "components/Icons/Rewards";
import { TextLabel } from "components/ViewQuest/styles";

const Body = ({ header, subHeader, renderComponents = null }) => {
  return (
    <>
      <Typography color="black" fontFamily="Poppins" fontSize="14px" fontWeight={700} lineHeight="14px">
        {header}
      </Typography>
      <Typography color="black" fontFamily="Poppins" fontSize="14px" fontWeight={400} lineHeight="14px">
        {subHeader}
      </Typography>

      <Image
        src={DEFAULT_BANNER_IMAGES.QUEST_READY_TO_SUBMIT}
        style={{
          width: "100%",
        }}
      />
      {renderComponents?.()}
    </>
  );
};

const SubmitBodyComponent = ({ handleSubmit }) => {
  const { setIsEditMode } = useTakeQuest();
  return (
    <Body
      header="Ready to submit the quest?"
      subHeader="Do you want to submit your response?"
      renderComponents={() => (
        <Box display="flex" gap="14px">
          <SharedSecondaryButton onClick={() => setIsEditMode(true)} $reverse>
            Edit Responses
          </SharedSecondaryButton>
          <SharedSecondaryButton onClick={handleSubmit}>Submit Quest</SharedSecondaryButton>
        </Box>
      )}
    />
  );
};

const SubmittedQuestRewards = ({ quest }) => {
  const [getQuestRewards, { data: questRewardsData }] = useLazyQuery(GET_QUEST_REWARDS);

  useEffect(() => {
    getQuestRewards({
      variables: {
        questId: quest.id,
      },
    });
  }, [quest?.requireReview]);

  const rewards = useMemo(() => {
    let roles = [
      {
        label: `${quest?.pointReward} points`,
        icon: PointsIcon,
      },
    ];
    let questRewards =
      questRewardsData?.getQuestRewards?.map((reward) => {
        if (reward.type === "token") {
          return {
            label: `Token: ${reward.amount} ${reward?.paymentMethod?.name || reward?.paymentMethod?.contractAddress}`,
            icon: reward?.paymentMethod?.type?.toLowerCase() === "erc20" ? PointsIcon : NFTIcon,
            subLabel: "These will be sent later to your wallet",
          };
        }
        if (reward.type === "poap") {
          return {
            label: `POAP: ${reward.poapRewardData?.name}`,
            icon: NFTIcon,
            subComponent: () => (
              <a href="https://app.poap.xyz/scan">
                <TextLabel
                  sx={{
                    textDecoration: "underline",
                  }}
                >
                  See it
                </TextLabel>
              </a>
            ),
          };
        }
      }) || [];
    return [...roles, ...questRewards];
  }, [quest, questRewardsData]);

  return (
    <>
      <Typography color="black" fontFamily="Poppins" fontSize="14px" fontWeight={700} lineHeight="14px">
        Rewards
      </Typography>
      <Grid display="flex" flexDirection="column" gap="16px" width="calc(100% - 84px)">
        {rewards?.map((reward, idx) => (
          <Box display="flex" flexDirection="column" gap="14px" padding="8px" bgcolor="#EAEAEA" borderRadius="12px">
            <Box
              minHeight="40px"
              display="flex"
              justifyContent="center"
              key={`${idx}_reward`}
              alignItems="center"
              width="100%"
              gap="6px"
            >
              {reward && <reward.icon />}
              <TextLabel>{reward?.label}</TextLabel>
            </Box>
            {reward?.subLabel || reward?.subComponent ? <Box display="flex" justifyContent="center" alignItems="center">
              {reward?.subLabel ? (
                <TextLabel fontSize="12px" fontWeight={400} textAlign="center">
                  {reward?.subLabel}
                </TextLabel>
              ) : null}
              {reward.subComponent ? reward.subComponent() : null}
            </Box> : null}
          </Box>
        ))}
      </Grid>
    </>
  );
};

const SubmittedQuestBody = () => {
  const { quest, webApp } = useTakeQuest();

  const subHeader = quest?.requireReview
    ? "Your submission has been sent for review"
    : "Your submission has been approved";
    
  return (
    <>
      <Body header="Quest Submitted" subHeader={subHeader} />
      {quest?.requireReview === false ? <SubmittedQuestRewards quest={quest} /> : null}
      <SharedSecondaryButton onClick={() => webApp?.close()}>Close</SharedSecondaryButton>
    </>
  );
};

const SubmitQuest = ({ handleSubmit, submittedQuestData, errorComponents = null }) => {
  return (
    <PanelComponent
      renderHeader={() => (
        <Grid
          padding="14px"
          bgcolor="#F7F7F7"
          sx={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <Typography fontFamily="Poppins" color="black" fontSize="14px" fontWeight={600} lineHeight="15px">
            Quest Portal
          </Typography>
        </Grid>
      )}
      renderBody={() => (
        <Grid display="flex" flexDirection="column" gap="24px" width="100%" justifyContent="center" alignItems="center">
          {submittedQuestData ? <SubmittedQuestBody /> : <SubmitBodyComponent handleSubmit={handleSubmit} />}
          {errorComponents?.()}
        </Grid>
      )}
    />
  );
};

export default SubmitQuest;
