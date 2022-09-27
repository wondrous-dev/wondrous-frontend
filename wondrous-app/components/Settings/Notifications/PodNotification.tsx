import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DiscordIntegrationCard from 'components/Settings/Notifications/DiscordIntegrationCard';
import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import Link from 'next/link';
import palette from 'theme/palette';
import {
  GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
  GET_POD_DISCORD_NOTIFICATION_CONFIGS,
  GET_CHANNELS_FROM_DISCORD,
  GET_POD_BY_ID,
} from 'graphql/queries';

import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationOutlineSettings } from '../../Icons/notifications';
import { HeaderBlock } from '../headerBlock';
import styles from './styles';
import { GeneralSettingsIntegrationsBlock } from '../styles';

enum NotificationType {
  TasksNotifications = 'tasksNotifications',
  TaskDiscussionThread = 'taskDiscussion',
}

function PodNotification(props) {
  const { podId } = props;
  const [orgNotificationConfig, setOrgNotificationConfig] = useState(null);
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  const [__discordNotificationConfigData, __setDiscordNotificationConfigData] = useState(null);

  const [getOrgDiscordNotificationConfig] = useLazyQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS, {
    onCompleted: (data) => {
      setOrgNotificationConfig(data?.getOrgDiscordNotificationConfig);
    },
    fetchPolicy: 'network-only',
  });

  const { data: podData } = useQuery(GET_POD_BY_ID, {
    variables: {
      podId,
    },
  });
  const orgId = podData?.getPodById?.orgId;

  const { data } = useQuery(GET_POD_DISCORD_NOTIFICATION_CONFIGS, {
    variables: {
      podId,
    },
  });

  const discordNotificationConfigData = data?.getPodDiscordNotificationConfig;

  useEffect(() => {
    setGuildId(discordNotificationConfigData?.guildId || orgNotificationConfig?.guildId);
  }, [orgNotificationConfig?.guildId, discordNotificationConfigData?.guildId]);

  useEffect(() => {
    if (guildId) {
      getChannelsFromDiscord({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);

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
    __setDiscordNotificationConfigData(discordNotificationConfigData);
  }, [discordNotificationConfigData]);

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
      <HeaderBlock
        icon={<NotificationOutlineSettings width="32" height="32" />}
        title="Notifications"
        description="Manage notifications"
      />

      <Grid container>
        <GeneralSettingsIntegrationsBlock
          style={{
            borderBottom: 'none',
          }}
        >
          <Typography color={palette.blue20} fontWeight={500}>
            Discord Integration
          </Typography>
          <Divider sx={styles.divider} />

          {!guildId && discordNotificationConfigData !== undefined ? (
            <Grid container sx={styles.connectDiscord}>
              <Typography fontSize="14px" color={palette.grey250} fontWeight={500} sx={{ a: { color: palette.highlightBlue } }}>
                Add wonder bot to discord server on the org{' '}
                <Link href={`/organization/settings/${orgId}/notifications`}>notification setting page</Link>
              </Typography>
            </Grid>
          ) : null}

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

export default PodNotification;
