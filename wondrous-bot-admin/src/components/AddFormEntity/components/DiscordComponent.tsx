import { Grid } from "@mui/material";
import { Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";
import SelectComponent from "components/Shared/Select";

const TextInputStyle = {
  width: "50%",
};
const DISCORD_MESSAGE_TYPES = [
  {
    label: "Introduction",
    value: "intro",
  },
];

const DiscordChannelMessage = ({ handleOnChange, value, error }) => (
  <>
    <Label>Ask members to message a particular channel</Label>
    <TextField
      placeholder="Please enter the channel name without the # e.g. intros"
      value={value?.discordChannelName || ""}
      onChange={(value) => handleOnChange("discordChannelName", value)}
      multiline={false}
      error={error?.discordChannelName}
      style={TextInputStyle}
    />
    <Label>Select message type</Label>
    <SelectComponent
      options={DISCORD_MESSAGE_TYPES}
      background="#C1B6F6"
      value={value?.discordMessageType}
      error={error?.discordMessageType}
      onChange={(value) => handleOnChange("discordMessageType", value)}
      style={{
        width: "50%",
      }}
    />
  </>
);

const DiscordJoinCommunityCall = ({ handleOnChange, value }) => (
  <>
    <Label>Event invite link</Label>
    <TextField
      placeholder="Discord event link"
      value={value?.discordEventLink || ""}
      onChange={(value) => handleOnChange("discordEventLink", value)}
      multiline={false}
    />
  </>
);
const getDiscordComponent = (stepType, handleOnChange, value, error) => {
  if (stepType === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
    return <DiscordChannelMessage handleOnChange={handleOnChange} value={value} error={error?.additionalData} />;
  }
  if (stepType === TYPES.JOIN_DISCORD_COMMUNITY_CALL) {
    return <DiscordJoinCommunityCall handleOnChange={handleOnChange} value={value} />;
  }
  return null;
};

const DiscordComponent = ({ onChange, value, stepType, error }) => {
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
        {getDiscordComponent(stepType, handleOnChange, value, error)}
      </Grid>
    </Grid>
  );
};

export default DiscordComponent;
