import { Grid } from "@mui/material";
import { Label } from "components/AddFormEntity/components/styles";
import TextField from "components/Shared/TextField";

export const StepTextField = ({ step, onChange, value, placeholder = "", type = "text" }) => {
  return (
    <>
      <Grid display="flex" gap="8px" flexDirection="column" width="100%">
        <TextField
          multiline={false}
          type={type}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          autoFocus="true"
        />
      </Grid>
    </>
  );
};
