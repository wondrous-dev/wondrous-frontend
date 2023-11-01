import { Box } from "@mui/material";
import { memo } from "react";
import { CustomTextField } from "../AddFormEntity/components/styles";
import { CustomResizableTextField, ErrorText } from "./styles";
import ErrorField from "./ErrorField";

export const ResizeTextField = ({ value, onChange, label = "", error, placeholder, maxRows = 4, ...props }) => {
  return (
    <Box width="100%" height="100%" style={props?.boxStyles} flex="1">
      <CustomResizableTextField
        placeholder="Type an answer here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        multiline={true}
        sx={{
          minHeight: "40px",
          padding: "2px",
        }}
        maxRows={maxRows}
        {...props}
      />
      {error ? <ErrorField errorText={error}/> : null}
    </Box>
  );
};

const TextFieldComponent = ({
  label = "Label",
  value = "",
  onChange = null,
  error = null,
  placeholder = "Enter value",
  multiline = true,
  ...props
}) => {
  const handleChange = (e) => {
    return onChange?.(e.target.value);
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
        borderRadius={props?.borderRadius}
        {...props}
      />
      {error ? <ErrorField errorText={error} /> : null}
    </Box>
  );
};

export default memo(TextFieldComponent);
