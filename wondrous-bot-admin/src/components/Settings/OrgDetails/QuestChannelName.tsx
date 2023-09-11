import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, CircularProgress } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { Label } from "components/CreateTemplate/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { UPDATE_DISCORD_PARENT_CHANNEL_NAME } from "graphql/mutations/discord";
import { GET_GUILD_DISCORD_CHANNELS } from "graphql/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";

const QuestChannelName = ({ guildId, parentChannelId }) => {
  const [channelName, setChannelName] = useState("");
  const { activeOrg } = useContext(GlobalContext);
  const [getGuildDiscordChannels, { data, loading, refetch }] = useLazyQuery(GET_GUILD_DISCORD_CHANNELS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const defaultChannel = data?.getAvailableChannelsForDiscordGuild.find(
        (channel) => channel.id === parentChannelId || channel.name === "community-quest"
      );
      setChannelName(defaultChannel?.name);
    },
  });

  const [updateChannelName, { loading: updateInProgress }] = useMutation(UPDATE_DISCORD_PARENT_CHANNEL_NAME, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (guildId) {
      getGuildDiscordChannels({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);

  const defaultChannelName = useMemo(() => {
    if (data?.getAvailableChannelsForDiscordGuild) {
      const defaultChannel = data?.getAvailableChannelsForDiscordGuild.find(
        (channel) => channel.id === parentChannelId || channel.name === "community-quest"
      );
      return defaultChannel?.name;
    }
  }, [data?.getAvailableChannelsForDiscordGuild]);

  const handleSave = (value) => {
    updateChannelName({
      variables: {
        orgId: activeOrg?.id,
        newName: value,
      },
    });
  };

  const handleChange = (e) => setChannelName(e.target.value);
  if (!guildId) return null;

  const isLoading = loading || updateInProgress;
  return (
    <Box display="flex" flexDirection="column" gap="14px" justifyContent="flex-start" alignItems="flex-start">
      <Label>Update channel name</Label>
      <Box display="flex" gap="8px" alignItems="center">
        <CustomTextField 
        onChange={handleChange}
        value={channelName} disabled={isLoading} />
        <SharedSecondaryButton onClick={() => handleSave(channelName)} disabled={channelName === defaultChannelName}>
          {isLoading ? (
            <CircularProgress
              size={30}
              thickness={5}
              sx={{
                color: "#2A8D5C",
                animationDuration: "10000ms",
              }}
            />
          ) : (
            "Save"
          )}
        </SharedSecondaryButton>
      </Box>
    </Box>
  );
};

export default QuestChannelName;
