import { Grid } from "@mui/material";
import { Label } from "components/AddFormEntity/components/styles";
import TextField from "components/Shared/TextField";

export const StepTextField = ({ step, onChange, value }) => {
  return (
    <>
      <Label color="black">Write your response below!</Label>
      <Grid display="flex" gap="8px" flexDirection="column" width="100%">
        <Label>{step?.prompt}</Label>
        <TextField multiline={false} onChange={onChange} value={value} />
      </Grid>
    </>
  );
};
