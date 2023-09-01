import { Grid } from "@mui/material";
import TextField from "components/Shared/TextField";

const validateTypes = (type, value) => {
  if (type === "number" || type === "tel") {
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      return true;
    }
    return false;
  }
  return true;
};

export const StepTextField = ({ step, onChange, value, placeholder = "", type = "text" }) => {
  const handleInputChange = (value) => {
    const isValid = validateTypes(type, value);
    if (isValid) {
      return onChange(value);
    }
  };

  return (
    <>
      <Grid display="flex" gap="8px" flexDirection="column" width="100%">
        <TextField
          multiline={false}
          type={type}
          onChange={handleInputChange}
          value={value}
          placeholder={placeholder}
          autoFocus="true"
        />
      </Grid>
    </>
  );
};
