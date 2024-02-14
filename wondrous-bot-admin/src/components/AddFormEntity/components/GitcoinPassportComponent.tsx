import { Box, Grid, Typography } from "@mui/material";
import { IndexContainer, Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";

const TextInputStyle = {
  width: "50%",
};

const GitcoinPassportScore = ({ handleOnChange, value, errors }) => (
  <>
    <Label>Question/Prompt</Label>
    <TextField
      placeholder="Enter prompt here"
      value={value?.prompt || ""}
      onChange={(value) => {
        if (value.length <= 256) {
          handleOnChange("prompt", value);
        }
      }}
      multiline={false}
      error={errors?.prompt}
    />
    <Box fontSize="13px" color="#2A8D5C" fontWeight="500" marginTop="-8px">
      {value?.prompt?.length} / 256
    </Box>
    <Label>Verify that a user's Gitcoin Passport Score is above this threshold</Label>
    <TextField
      placeholder="Please enter the minimum score threshold"
      value={value?.gitcoinPassportMinimumScoreThreshold}
      error={errors?.gitcoinPassportMinimumScoreThreshold}
      onChange={(value) => handleOnChange("gitcoinPassportMinimumScoreThreshold", value)}
      multiline={false}
      style={TextInputStyle}
      type="number"
    />
  </>
);

const GitcoinPassportComponent = ({ onChange, value, stepType, error }) => {
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
        <GitcoinPassportScore handleOnChange={handleOnChange} value={value} errors={error?.additionalData} />
      </Grid>
    </Grid>
  );
};

export default GitcoinPassportComponent;
