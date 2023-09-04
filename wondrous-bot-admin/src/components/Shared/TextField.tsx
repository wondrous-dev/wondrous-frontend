import { Box } from "@mui/material";
import { memo, useEffect, useRef } from "react";
import { CustomTextField } from "../AddFormEntity/components/styles";
import { ErrorText } from "./styles";

const TextFieldComponent = ({
  label = "Label",
  value = "",
  onChange,
  error = null,
  placeholder = "Enter value",
  multiline = true,
  ...props
}) => {
  const handleChange = (e) => {
    return onChange(e.target.value);
  };
  
  return (
    <Box width="100%" height="100%" style={props?.boxStyles}>
      <CustomTextField
        key={label}
        label={label}
        value={value}
        fullWidth
        onChange={handleChange}
        multiline={multiline}
        variant="standard"
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        {...props}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Box>
  );
};

export default memo(TextFieldComponent);
