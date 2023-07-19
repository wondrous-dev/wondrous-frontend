import React, { useContext } from "react";
import { Grid } from "@mui/material";
import apollo from "services/apollo";
import { Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";
import { GET_GUILD_EVENTS, GET_GUILD_EVENT, GET_CMTY_ORG_DISCORD_CONFIG } from "graphql/queries";
import { useQuery } from "@apollo/client";
import SelectComponent from "components/Shared/Select";
import GlobalContext from "utils/context/GlobalContext";
import DropdownSelect from "components/DropdownSelect/DropdownSelect";
import { format } from "date-fns";
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

const DiscordJoinCommunityCall = ({ handleOnChange, value }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const { data: guildEventsData } = useQuery(GET_GUILD_EVENTS, {
    variables: {
      guildId: orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId,
    },
    skip: !orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId,
  });
  const upcomingEvents = guildEventsData?.getGuildEvents?.filter(
    (event) => event?.status === "scheduled" || event?.status === "active"
  );
  let options: any[] = upcomingEvents
    ? upcomingEvents?.map((event) => {
        const startTime = format(new Date(Number(event?.startTime)), "yyyy-MM-dd HH:mm a");
        const label = `${event?.eventName} - ${startTime}`;
        return {
          label: label,
          value: event?.eventId,
        };
      })
    : [];
  // if value?.discordEventId not in upcomingEvents then fetch the event from db
  if (value?.discordEventId && !upcomingEvents?.find((event) => event?.eventId === value?.discordEventId)) {
    apollo
      .query({
        query: GET_GUILD_EVENT,
        variables: {
          eventId: value?.discordEventId,
        },
      })
      .then((res) => {
        const event = res?.data?.getGuildEvent;
        const startTime = format(new Date(Number(event?.startTime)), "yyyy-MM-dd HH:mm a");
        const label = `${event?.eventName} - ${startTime}`;
        options.push({
          label: label,
          value: event?.eventId,
        });
      });
  }

  const durationOptions = [
    {
      label: "10 minutes",
      value: 10 * 60,
    },
    {
      label: "20 minutes",
      value: 20 * 60,
    },
    {
      label: "30 minutes",
      value: 30 * 60,
    },
  ];
  return (
    <>
      {options && (
        <SelectComponent
          options={options}
          background="#C1B6F6"
          value={value?.discordEventId}
          // error={error?.discordMessageType}
          onChange={(value) => handleOnChange("discordEventId", value)}
          style={{
            width: "50%",
          }}
        />
      )}
      <Label>Event Id </Label>
      <TextField
        placeholder="Discord event link"
        value={value?.discordEventId || ""}
        onChange={(value) => {}}
        multiline={false}
        disabled
      />
      <Label>Minimum Attendance Duration</Label>
      <SelectComponent
        options={durationOptions}
        background="#C1B6F6"
        value={value?.minDuration}
        // error={error?.discordMessageType}
        onChange={(value) => handleOnChange("minDuration", value)}
        style={{
          width: "50%",
        }}
      />
    </>
  );
};

const getDiscordComponent = (stepType, handleOnChange, value, error) => {
  if (stepType === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
    return <DiscordChannelMessage handleOnChange={handleOnChange} value={value} error={error?.additionalData} />;
  }

  if (stepType === TYPES.DISCORD_EVENT_ATTENDANCE) {
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
