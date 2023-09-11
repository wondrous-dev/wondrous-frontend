import { useLazyQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { Label } from "components/CreateTemplate/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_GUILD_DISCORD_CHANNELS } from "graphql/queries";
import { useEffect, useMemo, useState } from "react";

const QuestChannelName = ({ guildId, parentChannelId }) => {
    const [channelName, setChannelName] = useState('');
  const [getGuildDiscordChannels, {data, loading}] = useLazyQuery(GET_GUILD_DISCORD_CHANNELS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
        const defaultChannel = data?.getAvailableChannelsForDiscordGuild.find(channel => channel.id === parentChannelId || channel.name === 'community-quest');
        setChannelName(defaultChannel?.name);

    }
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
    if(data?.getAvailableChannelsForDiscordGuild) {
        const defaultChannel = data?.getAvailableChannelsForDiscordGuild.find(channel => channel.id === parentChannelId || channel.name === 'community-quest');
        return defaultChannel?.name;
    }
  }, [data?.getAvailableChannelsForDiscordGuild])
  
  return (
     <Box display="flex" flexDirection="column" gap="14px" justifyContent="flex-start" alignItems="flex-start">
      <Label>Quest channel name</Label>
      <Box display="flex" gap="8px" alignItems="center">
      <CustomTextField value={channelName}/>
    <SharedSecondaryButton disabled={channelName === defaultChannelName}>Save</SharedSecondaryButton>
      </Box>
    </Box>
  );
};

export default QuestChannelName;
