import { Grid, Typography } from "@mui/material";
import { IndexContainer, Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";

const TextInputStyle = {
  width: "50%",
};

const YoutubeSubscribeText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Subscribe to this Youtube channel</Label>
    <TextField
      placeholder="Please enter the channel url"
      value={value.ytChannelLink || ""}
      onChange={(value) => handleOnChange("ytChannelLink", value)}
      multiline={false}
      error={error}
      style={TextInputStyle}
    />
  </>
);

const YoutubeSubscribeComponent = ({ onChange, value, stepType, error }) => {
  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };
  console.log(error)
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
        <YoutubeSubscribeText handleOnChange={handleOnChange} value={value} error={error?.additionalData?.ytChannelLink} />
      </Grid>
    </Grid>
  );
};

export default YoutubeSubscribeComponent;
