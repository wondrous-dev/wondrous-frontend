import React, { useEffect, useState } from 'react';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS } from 'graphql/queries';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';

import DiscordIntegrationCard from 'components/Settings/Notifications/DiscordIntegrationCard';
import { DISCONNECT_ORG_DISCORD_NOTIFICATION_CONFIG } from 'graphql/mutations';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import palette from 'theme/palette';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import HeaderBlock from 'components/Settings/headerBlock';

import { GeneralSettingsIntegrationsBlock } from 'components/Settings/styles';
import { NotificationType } from 'components/Settings/Notifications/constants';
import styles from 'components/Settings/Notifications/styles';

function Notifications({ orgId, isCollab = false }) {
  const [getOrgDiscordNotificationConfig, { data }] = useLazyQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS);
  const [disconnectOrgDiscordNotificationConfig] = useMutation(DISCONNECT_ORG_DISCORD_NOTIFICATION_CONFIG, {
    refetchQueries: ['getOrgDiscordNotificationConfig'],
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

  const handleDisconnect = (notificationType, id) => {
    disconnectOrgDiscordNotificationConfig({
      variables: {
        orgId,
        type: notificationType,
        discordConfigId: id,
      },
    });
  };

  const discordNotificationConfigData = data?.getOrgDiscordNotificationConfig;

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
      displayAddButton: isCollab || !taskNotificationConfig?.length,
      isCollab,
    },
    !isCollab && {
      title: 'Task Discussion Thread',
      type: NotificationType.TaskDiscussionThread,
      configData: threadNotificationConfig,
      displayAddButton: !threadNotificationConfig?.length,
      isCollab,
    },
  ];

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

          {DISCORD_NOTIFICATION_CARDS.map(
            (card, idx) =>
              !!card && (
                <DiscordIntegrationCard
                  key={idx}
                  title={card.title}
                  displayAddButton={card.displayAddButton}
                  type={card.type}
                  configData={card.configData}
                  isCollab={card.isCollab}
                  orgId={orgId}
                  handleDisconnect={handleDisconnect}
                />
              )
          )}
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default Notifications;
