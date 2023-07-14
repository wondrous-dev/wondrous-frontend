import { Grid, Typography } from "@mui/material";
import { IndexContainer, Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";


const YoutubeLikeText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Click this link</Label>
    <TextField
      placeholder="Please enter the url"
      value={value.linkClickUrl || ""} 
      onChange={(value) => handleOnChange("linkClickUrl", value)}
      multiline={false}
      error={error}
    />
  </>
);

const LinkClickComponent = ({ onChange, value, stepType, error }) => {
  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };
  return (
    <Grid
      gap="8px"
      display="flex"
      alignItems="center"
      style={{
        width: "100%",
      }}
      direction="column"
    >
      <Grid
        item
        gap="14px"
        display="flex"
        flexDirection="column"
        xs={12}
        style={{
          width: "100%",
        }}
      >
        <YoutubeLikeText handleOnChange={handleOnChange} value={value} error={error?.additionalData?.linkClickUrl} />
      </Grid>
    </Grid>
  );
};

export default LinkClickComponent;