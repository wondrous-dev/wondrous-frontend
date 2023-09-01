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
