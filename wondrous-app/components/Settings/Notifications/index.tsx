import { Discord } from 'components/Icons/discord';
import DiscordIntegrationCard from 'components/Settings/Notifications/DiscordIntegrationCard';
import { TitleStyle } from 'components/Settings/Notifications/DiscordNotificationSection/styles';
import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_CHANNELS_FROM_DISCORD } from 'graphql/queries';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import palette from 'theme/palette';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import { HeaderBlock } from 'components/Settings/headerBlock';
import WonderButton from 'components/Button';

import { GeneralSettingsIntegrationsBlock } from 'components/Settings/styles';
import Accordion from 'components/Common/Accordion';
import DiscordNotificationSection from 'components/Settings/Notifications/DiscordNotificationSection';
import ConnectDiscordServer from 'components/Settings/Notifications/ConnectDiscordServer';
import styles, { GuildNameStyle } from 'components/Settings/Notifications/styles';

function Notifications({ orgId }) {
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState('1023920043031011369');
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
  }, [discordNotificationConfigData?.guildId]);

  const discordChannels = discordChannelData?.getAvailableChannelsForDiscordGuild || [];
  const isDiscordConnected = Boolean(discordNotificationConfigData?.id);

  return (
    <SettingsWrapper>
      <Grid container>
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

          {isDiscordConnected ? (
            <Grid container sx={styles.discordConnection}>
              <Typography sx={{ color: palette.white, fontWeight: 500 }}>Connected Server:</Typography>
              <Chip label={discordNotificationConfigData?.channelInfo?.guildName} sx={GuildNameStyle} />
            </Grid>
          ) : (
            <ConnectDiscordServer orgId={orgId} />
          )}

          <DiscordIntegrationCard
            title="Tasks Notifications"
            discordChannels={discordChannels}
            disabled={!isDiscordConnected}
          />
          <DiscordIntegrationCard
            title="Task Discussion Thread"
            discordChannels={discordChannels}
            disabled={!isDiscordConnected}
          />

          {/* <DiscordNotificationSection */}
          {/*  sectionTitle="Tasks Notifications" */}
          {/*  titleEnable="Send a message a task is assigned to someone" */}
          {/*  titleConnect="Send a message a task is assigned to someone" */}
          {/*  filteredDiscordChannels={filteredDiscordChannels} */}
          {/*  discordNotificationConfigData={discordNotificationConfigData} */}
          {/* /> */}
          {/* <DiscordNotificationSection */}
          {/*  sectionTitle="Task Discussion Thread" */}
          {/*  titleEnable="Send a message that an issue discussion thread has been created" */}
          {/*  titleConnect="Send a message that an issue discussion thread has been created" */}
          {/*  filteredDiscordChannels={filteredDiscordChannels} */}
          {/*  discordNotificationConfigData={discordNotificationConfigData} */}
          {/* /> */}
        </GeneralSettingsIntegrationsBlock>
      </Grid>
    </SettingsWrapper>
  );
}

export default Notifications;
