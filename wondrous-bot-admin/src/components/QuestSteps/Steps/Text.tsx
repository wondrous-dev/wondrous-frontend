import { Grid } from "@mui/material";
import TextField from "components/Shared/TextField";
import { useKeyboardEffect } from "./utils";
import { useTakeQuest } from "utils/hooks";
import { validateTypes } from "utils/common";


export const StepTextField = ({ step, onChange, value, placeholder = "", type = "text" }) => {
  const handleInputChange = (value) => {
    const isValid = validateTypes(type, value);
    if (isValid) {
      return onChange(value);
    }
  };

  const { onBlur, onFocus } = useKeyboardEffect();

  const {isEditMode} = useTakeQuest();

  const shouldAutoFocus = step.order > 1 && !isEditMode;
  return (
    <>
      <Grid display="flex" gap="8px" flexDirection="column" width="100%">
        <TextField
          multiline={false}
          type={type}
          onChange={handleInputChange}
          value={value}
          placeholder={placeholder}
          autoFocus={shouldAutoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Grid>
    </>
  );
};
