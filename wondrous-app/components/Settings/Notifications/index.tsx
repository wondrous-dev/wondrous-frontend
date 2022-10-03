import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';

import DiscordIntegrationCard from 'components/Settings/Notifications/DiscordIntegrationCard';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_CHANNELS_FROM_DISCORD } from 'graphql/queries';
import { MANUAL_DISCORD_ORG_SETUP, DISCONNECT_ORG_DISCORD_NOTIFICATION_CONFIG } from 'graphql/mutations';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import palette from 'theme/palette';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import { HeaderBlock } from 'components/Settings/headerBlock';

import { GeneralSettingsIntegrationsBlock } from 'components/Settings/styles';
import ConnectDiscordServer from 'components/Settings/Notifications/ConnectDiscordServer';
import { NotificationType } from 'components/Settings/Notifications/constants';
import styles from 'components/Settings/Notifications/styles';

function Notifications({ orgId }) {
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  // TODO: This is just for demo purposes
  const [__discordNotificationConfigData, __setDiscordNotificationConfigData] = useState(null);

  const [manualDiscordOrgSetup, { error: saveDiscordOrgError }] = useMutation(MANUAL_DISCORD_ORG_SETUP);
  const [disconnectOrgDiscordNotificationConfig] = useMutation(DISCONNECT_ORG_DISCORD_NOTIFICATION_CONFIG);

  const [getOrgDiscordNotificationConfig, { data }] = useLazyQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS);

  useEffect(() => {
    if (orgId) {
      getOrgDiscordNotificationConfig({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId]);

  useEffect(() => {
    if (guildId) {
      getChannelsFromDiscord({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);

  const discordNotificationConfigData = data?.getOrgDiscordNotificationConfig;

  useEffect(() => {
    setGuildId(discordNotificationConfigData?.[0]?.guildId);
    __setDiscordNotificationConfigData(discordNotificationConfigData);
  }, [discordNotificationConfigData]);

  const handleConnect = (notificationType: string, channelId: string) => {
    manualDiscordOrgSetup({
      variables: {
        guildId,
        orgId,
        channelId,
        type: notificationType,
      },
      refetchQueries: [GET_ORG_DISCORD_NOTIFICATION_CONFIGS],
    });
  };

  const handleDisconnect = (notificationType: string) => {
    disconnectOrgDiscordNotificationConfig({
      variables: {
        orgId,
        type: notificationType,
      },
      refetchQueries: [GET_ORG_DISCORD_NOTIFICATION_CONFIGS],
    });
  };

  const discordChannels = discordChannelData?.getAvailableChannelsForDiscordGuild || [];
  const taskNotificationConfig = __discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TasksNotifications && config.channelId
  );
  const threadNotificationConfig = __discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TaskDiscussionThread && config.channelId
  );

  return (
    <SettingsWrapper>
      <Grid container maxWidth="740px">
        <HeaderBlock
          icon={<NotificationOutlineSettings width="32" height="32" />}
          title="Notifications"
          description="Manage notifications"
        />

        <GeneralSettingsIntegrationsBlock
          style={{
            borderBottom: 'none',
          }}
        >
          <Typography color={palette.blue20} fontWeight={500}>
            Discord Integration
          </Typography>
          <Divider sx={styles.divider} />

          {!guildId && discordNotificationConfigData !== undefined ? <ConnectDiscordServer orgId={orgId} /> : null}

          <DiscordIntegrationCard
            title="Tasks Notifications"
            discordChannels={discordChannels}
            disabled={!guildId}
            onConnect={(channelId) => handleConnect(NotificationType.TasksNotifications, channelId)}
            onDisconnect={() => handleDisconnect(NotificationType.TasksNotifications)}
            channel={taskNotificationConfig?.[0]?.channelInfo}
          />
          <DiscordIntegrationCard
            title="Task Discussion Thread"
            discordChannels={discordChannels}
            disabled={!guildId}
            onConnect={(channelId) => handleConnect(NotificationType.TaskDiscussionThread, channelId)}
            onDisconnect={() => handleDisconnect(NotificationType.TaskDiscussionThread)}
            channel={threadNotificationConfig?.[0]?.channelInfo}
          />
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default Notifications;
