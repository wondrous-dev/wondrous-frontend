import React, { useContext, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import apollo from "services/apollo";
import { Label } from "./styles";
import TextField from "../../Shared/TextField";
import { TYPES } from "utils/constants";
import {
  GET_GUILD_EVENTS,
  GET_GUILD_EVENT,
  GET_CMTY_ORG_DISCORD_CONFIG,
  GET_GUILD_DISCORD_CHANNELS,
} from "graphql/queries";
import { useLazyQuery, useQuery } from "@apollo/client";
import SelectComponent from "components/Shared/Select";
import GlobalContext from "utils/context/GlobalContext";
import DropdownSelect from "components/DropdownSelect/DropdownSelect";
import { format } from "date-fns";
import { ErrorText } from "components/Shared/styles";
import AutocompleteOptionsComponent from "./AutocompleteComponent";
import ErrorField from "components/Shared/ErrorField";
import InfoLabel from "components/CreateTemplate/InfoLabel";
import AutocompleteMultipleComponent from "./AutocompleteMultipleComponent";

const TextInputStyle = {
  width: "50%",
};
const DISCORD_MESSAGE_TYPES = [
  {
    label: "Introduction",
    value: "intro",
  },
];

const DiscordChannelMessage = ({ handleOnChange, value, error }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(GET_CMTY_ORG_DISCORD_CONFIG, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
    fetchPolicy: "cache-and-network",
  });

  const [getGuildDiscordChannels, { data: guildDiscordChannelsData }] = useLazyQuery(GET_GUILD_DISCORD_CHANNELS, {
    fetchPolicy: "cache-and-network",
  });
  const guildId = orgDiscordConfig?.getCmtyOrgDiscordConfig?.guildId;
  const guildDiscordChannels = guildDiscordChannelsData?.getAvailableChannelsForDiscordGuild;
  useEffect(() => {
    if (guildId) {
      // fetch all guild channels
      getGuildDiscordChannels({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);
  const channels = guildDiscordChannels?.map((channel) => ({
    label: channel.name,
    value: channel.id,
  }));
  const defaultSelectedChannels = channels?.filter((channel) => {
    if (value?.discordChannelIds) {
      return value?.discordChannelIds?.includes(channel.value);
    }
    return false;
  });
  const defaultSelectedChannel = channels?.filter((channel) => {
    if (value?.discordChannelIds) {
      return channel.value === value?.discordChannelId;
    }
    return false;
  });
  return (
    <>
      <Label>Ask members to message a particular channel</Label>
      <AutocompleteMultipleComponent
        value={defaultSelectedChannels || (value?.discordChannelId ? [defaultSelectedChannel] : [])}
        onChange={(value) => handleOnChange("discordChannelIds", value)}
        options={channels || []}
        placeholder="Select a channel"
      />
      {error?.discordChannelIds ? <ErrorField errorText={error?.discordChannelId} /> : null}

      {/* <Label>Select message type</Label>
      <SelectComponent
        options={DISCORD_MESSAGE_TYPES}
        background="#C1B6F6"
        value={value?.discordMessageType}
        error={error?.discordMessageType}
        onChange={(value) => handleOnChange("discordMessageType", value)}
        style={{
          width: "50%",
        }}
      /> */}
    </>
  );
};

const DiscordJoinCommunityCall = ({ handleOnChange, value, error }) => {
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
      <div style={{ display: "flex" }}>
        <Label>Select Event </Label>
        <InfoLabel title={"First create the event on Discord, refresh the page"} />
      </div>
      {options && (
        <SelectComponent
          options={options}
          background="#C1B6F6"
          value={value?.discordEventId}
          error={error?.discordEventId}
          onChange={(value) => handleOnChange("discordEventId", value)}
          style={{
            width: "50%",
          }}
        />
      )}
      <Label>Minimum Attendance Duration</Label>
      <SelectComponent
        options={durationOptions}
        background="#C1B6F6"
        value={value?.minDuration}
        error={error?.minDuration}
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
    return <DiscordJoinCommunityCall handleOnChange={handleOnChange} value={value} error={error?.additionalData} />;
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
  const { prompt } = value;
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
          <Label>Question/Prompt</Label>
          <TextField
            placeholder="Enter prompt here (Ex. Join our weekly community call for a minimum of 10 minutes)"
            value={prompt || ""}
            onChange={(value) => {
              if (value?.length <= 256) {
                handleOnChange("prompt", value);
              }
            }}
            multiline={false}
            error={error?.prompt}
          />
          <Box fontSize="13px" color="#2A8D5C" fontWeight="500" marginTop="-8px">
            {prompt?.length} / 256
          </Box>
        </Grid>
        {getDiscordComponent(stepType, handleOnChange, value, error)}
      </Grid>
    </Grid>
  );
};

export default DiscordComponent;
