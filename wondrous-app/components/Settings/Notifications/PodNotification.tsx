import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DiscordIntegrationCard from 'components/Settings/Notifications/DiscordIntegrationCard';
import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import palette from 'theme/palette';
import {
  GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
  GET_POD_DISCORD_NOTIFICATION_CONFIGS,
  GET_CHANNELS_FROM_DISCORD,
  GET_POD_BY_ID,
} from 'graphql/queries';

import { MANUAL_DISCORD_POD_SETUP, DISCONNECT_POD_DISCORD_NOTIFICATION_CONFIG } from 'graphql/mutations';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationType } from 'components/Settings/Notifications/constants';
import { HeaderBlock } from 'components/Settings/headerBlock';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import styles from './styles';
import { GeneralSettingsIntegrationsBlock } from '../styles';

function PodNotification(props) {
  const { podId } = props;
  const [orgNotificationConfig, setOrgNotificationConfig] = useState(null);
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  const [manualDiscordPodSetup, { error: saveDiscordOrgError }] = useMutation(MANUAL_DISCORD_POD_SETUP);
  const [disconnectPodDiscordNotificationConfig] = useMutation(DISCONNECT_POD_DISCORD_NOTIFICATION_CONFIG);

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

  useEffect(() => {
    if (orgId) {
      getOrgDiscordNotificationConfig({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId]);

  const handleDisconnect = (notificationType: string) => {
    disconnectPodDiscordNotificationConfig({
      variables: {
        podId,
        type: notificationType,
      },
      refetchQueries: [GET_POD_DISCORD_NOTIFICATION_CONFIGS],
    });
  };

  const discordNotificationConfigData = data?.getPodDiscordNotificationConfig
  
  const taskNotificationConfig = discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TasksNotifications && !config.disabledAt
  );
  const threadNotificationConfig = discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TaskDiscussionThread && !config.disabledAt
  );

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
              <Typography
                fontSize="14px"
                color={palette.grey250}
                fontWeight={500}
                sx={{ a: { color: palette.highlightBlue } }}
              >
                Add wonder bot to discord server on the org{' '}
                <Link href={`/organization/settings/${orgId}/notifications`}>notification setting page</Link>
              </Typography>
            </Grid>
          ) : null}


          <DiscordIntegrationCard
            title="Tasks Notifications"
            disabled={!guildId}
            type={NotificationType.TasksNotifications}
            configData={taskNotificationConfig}
            orgId={''}
          />
          <DiscordIntegrationCard
            title="Task Discussion Thread"
            disabled={!guildId}
            type={NotificationType.TaskDiscussionThread}
            configData={threadNotificationConfig}
            orgId={''}
          />
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default PodNotification;
