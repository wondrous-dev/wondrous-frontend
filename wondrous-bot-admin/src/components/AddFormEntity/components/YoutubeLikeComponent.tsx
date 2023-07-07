import { Grid, Typography } from "@mui/material";
import { IndexContainer, Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";

const TextInputStyle = {
  width: "50%",
};

const YoutubeLikeText = ({ handleOnChange, value, error }) => (
  <>
    <Label>Like this Youtube video</Label>
    <TextField
      placeholder="Please enter the video url"
      value={value.ytVideoLink || ""} // ? formatYoutubeLink(value.ytVideoId) :
      onChange={(value) => handleOnChange("ytVideoLink", value)}
      multiline={false}
      error={error}
      style={TextInputStyle}
    />
  </>
);

const YoutubeLikeComponent = ({ onChange, value, stepType, error }) => {
  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };
  console.log("value", value);
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
        <YoutubeLikeText handleOnChange={handleOnChange} value={value} error={error?.additionalData?.ytVideoLink} />
      </Grid>
    </Grid>
  );
};

export default YoutubeLikeComponent;
