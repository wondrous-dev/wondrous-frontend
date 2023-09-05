import { Divider, Grid, Typography } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useTakeQuest } from "utils/hooks";
import QuestStepComponent from "../QuestStepComponent";
import { useEffect } from "react";

const QuestStepsList = ({ steps, responses }) => {
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
                    {idx === steps.length - 1 ? null : (
                      <Divider
                        color="#E8E8E8"
                        sx={{
                          width: "100%",
                        }}
                      />
                    )}
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

  return <QuestStepsList steps={steps} responses={responses} />;
};

export default EditModal;
