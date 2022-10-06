import React, { useEffect, useState } from 'react';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_CHANNELS_FROM_DISCORD } from 'graphql/queries';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';

import DiscordIntegrationCard from 'components/Settings/Notifications/DiscordIntegrationCard';
import { MANUAL_DISCORD_ORG_SETUP, DISCONNECT_ORG_DISCORD_NOTIFICATION_CONFIG } from 'graphql/mutations';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import palette from 'theme/palette';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import { HeaderBlock } from 'components/Settings/headerBlock';

import { GeneralSettingsIntegrationsBlock } from 'components/Settings/styles';
import { NotificationType } from 'components/Settings/Notifications/constants';
import styles from 'components/Settings/Notifications/styles';

function Notifications({ orgId }) {
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


  const discordNotificationConfigData = data?.getOrgDiscordNotificationConfig;

  const taskNotificationConfig = discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TasksNotifications && !config.disabledAt
  );
  const threadNotificationConfig = discordNotificationConfigData?.filter(
    (config) => config.type === NotificationType.TaskDiscussionThread && !config.disabledAt
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

          {/* {!discordNotificationConfigData?.length && discordNotificationConfigData !== undefined ? <ConnectDiscordServer orgId={orgId} /> : null} */}

          <DiscordIntegrationCard
            title="Tasks Notifications"
            orgId={orgId}
            type={NotificationType.TasksNotifications}
            configData={taskNotificationConfig}
            disabled={false}
          />
          <DiscordIntegrationCard
            title="Task Discussion Thread"
            orgId={orgId}
            configData={threadNotificationConfig}
            type={NotificationType.TaskDiscussionThread}
            disabled={false}
          />
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default Notifications;
