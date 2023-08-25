import { TYPES } from "utils/constants";
import { StepTextField } from "./Steps";
import { Grid, Typography } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { useState } from "react";
import { StepModal } from "./StepModal";
import OptionSelect from "./Steps/OptionSelect";
import AttachmentType from "./Steps/Attachment";
import { VerifyButton } from "./Steps/VerifyButton";

const COMPONENTS_CONFIG: any = {
  [TYPES.TEXT_FIELD]: StepTextField,
  [TYPES.MULTI_QUIZ]: OptionSelect,
  [TYPES.SINGLE_QUIZ]: OptionSelect,
  [TYPES.NUMBER]: (props) => <StepTextField type="number" {...props} />,
  [TYPES.ATTACHMENTS]: AttachmentType,
  [TYPES.LINK_CLICK]: VerifyButton,
  [TYPES.LIKE_YT_VIDEO]: VerifyButton,
  [TYPES.SUBSCRIBE_YT_CHANNEL]: VerifyButton,
};

const QuestStep = ({ step, onChange, value, isActive, nextStepId, nextStep, prevStep, handleSubmit }) => {
  const Component: React.FC<any> = COMPONENTS_CONFIG[step?.type];
  const [isActionDisabled, setIsActionDisabled] = useState(false);
  if (!isActive) return null;
  if (Component) {
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
          <StepModal
            step={step}
            nextStepId={nextStepId}
            nextStep={nextStep}
            prevStep={prevStep}
            disabled={!value || isActionDisabled}
            handleSubmit={handleSubmit}
          >
            <Component
              step={step}
              value={value}
              isActionDisabled={isActionDisabled}
              setIsActionDisabled={setIsActionDisabled}
              onChange={(value) => onChange({ id: step.id, value })}
              placeholder="Enter answer"
            />
          </StepModal>
        )}
      />
    );
  }
  return null;
};

const QuestStepsList = ({ quest }) => {
  const { steps } = quest || [];
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id);
  const [responses, setResponses] = useState({});

  const handleChange = ({ id, value, skip = false }) =>
    setResponses({
      ...responses,
      [id]: skip ? null : value,
    });

  const handleSubmit = () => {};

  return (
    <Grid display="flex" flexDirection="column" justifyContent="center" gap="24px" alignItems="center" width="100%">
      {steps?.map((step, idx) => {
        return (
          <QuestStep
            value={responses[step.id]}
            isActive={activeStepId === step.id}
            step={step}
            key={step.id}
            nextStepId={steps[idx + 1]}
            nextStep={() => setActiveStepId(steps[idx + 1]?.id)}
            prevStep={() => setActiveStepId(steps[idx - 1]?.id)}
            onChange={handleChange}
            handleSubmit={handleSubmit}
          />
        );
      })}
    </Grid>
  );
};

export default QuestStepsList;
