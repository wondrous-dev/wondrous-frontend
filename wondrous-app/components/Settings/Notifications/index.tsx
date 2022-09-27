import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';

import DiscordIntegrationCard from 'components/Settings/Notifications/DiscordIntegrationCard';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_CHANNELS_FROM_DISCORD } from 'graphql/queries';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import palette from 'theme/palette';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import { HeaderBlock } from 'components/Settings/headerBlock';

import { GeneralSettingsIntegrationsBlock } from 'components/Settings/styles';
import ConnectDiscordServer from 'components/Settings/Notifications/ConnectDiscordServer';
import styles from 'components/Settings/Notifications/styles';

enum NotificationType {
  TasksNotifications = 'tasksNotifications',
  TaskDiscussionThread = 'taskDiscussion',
}

function Notifications({ orgId }) {
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  // TODO: This is just for demo purposes
  const [__discordNotificationConfigData, __setDiscordNotificationConfigData] = useState(null);

  // const [manualDiscordOrgSetup, { error: saveDiscordOrgError }] = useMutation(MANUAL_DISCORD_ORG_SETUP);
  const { data } = useQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS, {
    variables: {
      orgId,
    },
  });

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
    setGuildId(discordNotificationConfigData?.guildId);
    __setDiscordNotificationConfigData(discordNotificationConfigData);
  }, [discordNotificationConfigData?.guildId]);

  // TODO: Implement
  const handleConnect = (notificationType: string, channelId: string) => {
    const channelName = (discordChannelData?.getAvailableChannelsForDiscordGuild || []).find(
      (r) => r.id === channelId
    )?.name;

    __setDiscordNotificationConfigData({
      ...__discordNotificationConfigData,
      channelInfo: {
        ...__discordNotificationConfigData.channelInfo,
        [notificationType]: {
          channelName,
          guildName: null,
        },
      },
    });

    // manualDiscordOrgSetup({
    //   variables: {
    //     guildId,
    //     orgId,
    //     channelId,
    //   },
    //   refetchQueries: [GET_ORG_DISCORD_NOTIFICATION_CONFIGS],
    // });
  };

  // TODO: Implement
  const handleDisconnect = (notificationType: string) => {
    __setDiscordNotificationConfigData({
      ...__discordNotificationConfigData,
      channelInfo: {
        ...__discordNotificationConfigData.channelInfo,
        [notificationType]: null,
      },
    });
  };

  const discordChannels = discordChannelData?.getAvailableChannelsForDiscordGuild || [];
  const channelInfo = __discordNotificationConfigData?.channelInfo || {};

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
            channel={channelInfo[NotificationType.TasksNotifications]}
          />
          <DiscordIntegrationCard
            title="Task Discussion Thread"
            discordChannels={discordChannels}
            disabled={!guildId}
            onConnect={(channelId) => handleConnect(NotificationType.TaskDiscussionThread, channelId)}
            onDisconnect={() => handleDisconnect(NotificationType.TaskDiscussionThread)}
            channel={channelInfo[NotificationType.TaskDiscussionThread]}
          />
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default Notifications;
