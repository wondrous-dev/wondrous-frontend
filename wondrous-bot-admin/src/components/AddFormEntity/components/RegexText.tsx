import { Grid } from "@mui/material";
import TextField from "components/Shared/TextField";
import { Label } from "./styles";

const RegexComponent = ({ error, value, onChange, TextInputStyle, ...rest }) => {
  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };
  console.log("value", value);
  return (
    <Grid display="flex" gap="8px" flexDirection="column" width="100%">
      <Label>Question / Prompt</Label>
      <TextField
        multiline={false}
        value={value?.prompt || ""}
        onChange={(value) => {
          handleOnChange("prompt", value);
        }}
        {...rest}
        error={error?.prompt}
      />
      <Label>Regex to use for checking the answer</Label>
      <TextField
        placeholder="E.g. To make sure the answer starts with 0x, use ^0x"
        value={value?.regex || ""}
        onChange={(value) => handleOnChange("regex", value)}
        multiline={false}
        error={error}
        {...rest}
      />
    </Grid>
  );
};

export default RegexComponent;
