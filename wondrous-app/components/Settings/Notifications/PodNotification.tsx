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
  const [disconnectPodDiscordNotificationConfig] = useMutation(DISCONNECT_POD_DISCORD_NOTIFICATION_CONFIG);

  const { data } = useQuery(GET_POD_DISCORD_NOTIFICATION_CONFIGS, {
    variables: {
      podId,
    },
  });

  const handleDisconnect = (notificationType: string, id) => {
    disconnectPodDiscordNotificationConfig({
      variables: {
        podId,
        type: notificationType,
        discordConfigId: id,
      },
      refetchQueries: [GET_POD_DISCORD_NOTIFICATION_CONFIGS],
    });
  };

  const discordNotificationConfigData = data?.getPodDiscordNotificationConfig;

  const taskNotificationConfig = discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TasksNotifications && !config.disabledAt
  );
  const threadNotificationConfig = discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TaskDiscussionThread && !config.disabledAt
  );

  const DISCORD_NOTIFICATION_CARDS = [
    {
      title: 'Tasks Notifications',
      type: NotificationType.TasksNotifications,
      configData: taskNotificationConfig,
      displayAddButton: !taskNotificationConfig?.length,
    },
    {
      title: 'Task Discussion Thread',
      type: NotificationType.TaskDiscussionThread,
      configData: threadNotificationConfig,
      displayAddButton: !threadNotificationConfig?.length,
    },
  ];
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
          {DISCORD_NOTIFICATION_CARDS.map(
            (card, idx) =>
              !!card && (
                <DiscordIntegrationCard
                  key={idx}
                  title={card.title}
                  podId={podId}
                  displayAddButton={card.displayAddButton}
                  type={card.type}
                  configData={card.configData}
                  handleDisconnect={handleDisconnect}
                />
              )
          )}
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default PodNotification;
