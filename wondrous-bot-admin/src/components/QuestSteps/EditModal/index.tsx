import { Box, Divider, Grid, Typography } from "@mui/material";
import { BotIcon } from "assets/botIcon";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { StyledContent, StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { useMemo, useState } from "react";
import { DATA_COLLECTION_TYPES, INTERESTS, SELECT_TYPES, SKILLS, TYPES } from "utils/constants";
import { useTakeQuest } from "utils/hooks";
import { Media } from "../Steps/Attachment";
import QuestStepComponent from "../QuestStepComponent";

const StepContent = ({ response, stepType, dataCollectionType }) => {
  const contentTypes = [TYPES.TEXT_FIELD, TYPES.NUMBER];

  const linkVisits = [
    TYPES.LINK_CLICK,
    TYPES.FOLLOW_TWITTER,
    TYPES.LIKE_TWEET,
    TYPES.LIKE_YT_VIDEO,
    TYPES.RETWEET,
    TYPES.TWEET_WITH_PHRASE,
    TYPES.VERIFY_TOKEN_HOLDING,
    TYPES.SUBSCRIBE_YT_CHANNEL,
    TYPES.SNAPSHOT_SPACE_VOTE,
    TYPES.SNAPSHOT_PROPOSAL_VOTE,
  ];

  if (!response) {
    return (
      <Typography color="#1D1D1D" fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px">
        Step was skipped
      </Typography>
    );
  }

  if (contentTypes?.includes(stepType)) {
    return (
      <Typography color="#1D1D1D" fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px">
        {response}
      </Typography>
    );
  }
  if (linkVisits.includes(stepType)) {
    return (
      <StyledContent fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
        <StyledCheckbox checked />
        Verified URL visit
      </StyledContent>
    );
  }

  if (SELECT_TYPES.includes(stepType)) {
    return (
      <Grid display="flex" gap="6px" alignItems="center">
        {response?.map((value, idx) => (
          <StyledViewQuestResults>{value}</StyledViewQuestResults>
        ))}
      </Grid>
    );
  }
  if (stepType === TYPES.ATTACHMENTS) {
    return (
      <Grid display="flex" flexDirection="column" gap="14px">
        {response?.map((media, idx) => {
          return <Media file={media} key={`media-${idx}`} />;
        })}
      </Grid>
    );
  }
  if (stepType === TYPES.DATA_COLLECTION) {
    const isSkill = dataCollectionType === DATA_COLLECTION_TYPES.SKILLS;
    const isInterest = dataCollectionType === DATA_COLLECTION_TYPES.INTERESTS;
    return (
      <Grid display="flex" gap="6px" alignItems="center">
        {response?.map((option, idx) => {
          let label = option;
          if (isSkill) {
            label = SKILLS[option] || option;
          }
          if (isInterest) {
            label = INTERESTS[option] || option;
          }
          return <StyledViewQuestResults key={`${option}_${idx}`}>{label}</StyledViewQuestResults>;
        })}
      </Grid>
    );
  }
  return null;
};

const QuestStepsList = ({ steps, responses, setEditStepId }) => {
  const { handleSubmit } = useTakeQuest();
  return (
    <>
      <PanelComponent
        renderHeader={() => {
          return (
            <Grid
              padding="14px"
              bgcolor="#F7F7F7"
              sx={{
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <Typography fontFamily="Poppins" color="black" fontSize="14px" fontWeight={600} lineHeight="15px">
                Confirm your Answers
              </Typography>
            </Grid>
          );
        }}
        renderBody={() => (
          <>
            <Grid
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width="100%"
              gap="14px"
              overflow="hidden"
            >
              {steps?.map((step, idx) => {
                const response = responses[step?.id];
                return (
                  <>
                    <QuestStepComponent value={response} isActive step={step} key={step.id} nextStepId />
                    {idx === steps.length - 1 ? null : <Divider
                      color="#E8E8E8"
                      sx={{
                        width: "100%",
                      }}
                    />}
                  </>
                );
              })}
            </Grid>
          </>
        )}
      />
      <SharedSecondaryButton onClick={handleSubmit}>Submit</SharedSecondaryButton>
    </>
  );
};

const EditModal = ({ responses }) => {
  const { quest } = useTakeQuest();
  const steps = quest?.steps;
  const [editStepId, setEditStepId] = useState(null);

  const stepToEdit = useMemo(() => {
    if (editStepId) {
      return steps?.find((step) => step.id === editStepId);
    }
    return null;
  }, [editStepId]);
  console.log(stepToEdit, "step to edit", editStepId);
  return <QuestStepsList steps={steps} responses={responses} setEditStepId={setEditStepId} />;
};

export default EditModal;
