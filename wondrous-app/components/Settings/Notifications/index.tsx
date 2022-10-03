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
  Task = 'task',
  Thread = 'thread',
}

function Notifications({ orgId }) {
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  const [__discordNotificationConfigData, __setDiscordNotificationConfigData] = useState(null);

  // const [manualDiscordOrgSetup, { error: saveDiscordOrgError }] = useMutation(MANUAL_DISCORD_ORG_SETUP);
  const { data } = useQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS, {
    variables: {
      orgId,
    },
    skip: !orgId
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

  const discordChannels = discordChannelData?.getAvailableChannelsForDiscordGuild || [];

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
            discordChannels={discordChannels}
            type={NotificationType.Task}
            configData={__discordNotificationConfigData}
            // disabled={!guildId}
          />
          <DiscordIntegrationCard
            title="Task Discussion Thread"
            orgId={orgId}
            discordChannels={discordChannels}
            configData={discordNotificationConfigData}
            type={NotificationType.Thread}
            // disabled={!guildId}
          />
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default Notifications;
