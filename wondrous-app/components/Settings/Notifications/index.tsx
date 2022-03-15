import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_ORG_BY_ID } from '../../../graphql/queries';

import { SettingsWrapper } from '../settingsWrapper';
import { NotificationOutlineSettings } from '../../Icons/notifications';
import { HeaderBlock } from '../headerBlock';
import {
  GeneralSettingsContainer,
  GeneralSettingsIntegrationsBlock,
  GeneralSettingsIntegrationsBlockButtonIcon,
  LabelBlock,
  LabelBlockText,
} from '../styles';
import Link from 'next/link';
import { HighlightBlue } from '../../../theme/colors';
import { ErrorText } from '../../Common';

const Notifications = ({ orgId }) => {
  const [configurationError, setConfigurationError] = useState(null);
  const { data } = useQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS, {
    variables: {
      orgId,
    },
  });
  const { data: orgData } = useQuery(GET_ORG_BY_ID, {
    variables: {
      orgId,
    },
  });
  console.log(orgData)
  const discordNotificationConfigData = data?.getOrgDiscordNotificationConfig;
  useEffect(()=>{
    const channelName = discordNotificationConfigData?.channelInfo?.channelName
    const guildName = discordNotificationConfigData?.channelInfo?.guildName
    if (channelName) {
      setConfigurationError(null)
    } else if (!channelName && !guildName) {
      setConfigurationError('discord bot no longer connected to server')
    } else if (!channelName && !guildName) {
      setConfigurationError('the channel that the notificatoin was originally going to was deleted')
    }
  }, discordNotificationConfigData)
  console.log(discordNotificationConfigData)
  return (
    <SettingsWrapper>
      <HeaderBlock
        icon={<NotificationOutlineSettings width="32" height="32" />}
        title="Notifications"
        description="Manage notifications"
      />
      <GeneralSettingsContainer></GeneralSettingsContainer>
      <GeneralSettingsIntegrationsBlock>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <GeneralSettingsIntegrationsBlockButtonIcon />
          <LabelBlock>Discord Integration</LabelBlock>
        </div>
        <LabelBlockText>
          To post notifications in your Discord server, follow
          <Link href={{ pathname: '/discord-notification-setup', query: { orgUsername: orgData?.getOrgById?.username } }}>
            <a
              target="_blank"
              style={{
                color: HighlightBlue,
                marginLeft: '4px',
              }}
            >
              these instructions
            </a>
          </Link>
        </LabelBlockText>
        {discordNotificationConfigData && !configurationError && (
          <>
            <LabelBlockText>Currently notifications from your org is being sent to</LabelBlockText>
            <LabelBlockText>server: {discordNotificationConfigData?.channelInfo?.guildName}</LabelBlockText>
            <LabelBlockText>channel: {discordNotificationConfigData?.channelInfo?.channelName}</LabelBlockText>
          </>
        )}
        {configurationError && (
          <>
            <ErrorText>{configurationError}</ErrorText>
          </>
        )}
      </GeneralSettingsIntegrationsBlock>
    </SettingsWrapper>
  );
};

export default Notifications;
