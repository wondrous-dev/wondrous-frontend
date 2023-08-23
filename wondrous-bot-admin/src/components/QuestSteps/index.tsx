import { TYPES } from "utils/constants";
import { StepTextField } from "./Steps";
import { Grid } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { CampaignOverviewTitle } from "components/CreateTemplate/styles";
import { useState } from "react";

const COMPONENTS_CONFIG: any = {
  [TYPES.TEXT_FIELD]: StepTextField,
};

const QuestStep = ({ step, onChange, value }) => {
  const Component: React.FC<any> = COMPONENTS_CONFIG[step?.type];
  if (Component) {
    return (
      <PanelComponent
        renderHeader={() => (
          <Grid
            padding="14px"
            bgcolor="#2A8D5C"
            sx={{
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <CampaignOverviewTitle>Step {step.order}</CampaignOverviewTitle>
          </Grid>
        )}
        renderBody={() => <Component step={step} 
        value={value}
        onChange={(value) => onChange({ id: step.id, value })} />}
      />
    );
  }
  return null;
};

const QuestStepsList = ({ quest }) => {
  const { steps } = quest || [];
  const [responses, setResponses] = useState({});

  console.log(responses, "STEPS");

  const handleChange = ({ id, value, skip = false }) =>
    setResponses({
      ...responses,
      [id]: skip ? null : value,
    });

  return (
    <Grid display="flex" flexDirection="column" justifyContent="center" gap="24px" alignItems="center" width="100%">
      {steps?.map((step, idx) => {
        return <QuestStep 
        value={responses[step.id]}
        step={step} key={step.id} onChange={handleChange} />;
      })}
    </Grid>
  );
};

export default QuestStepsList;
