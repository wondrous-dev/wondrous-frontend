import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_ORG_BY_ID } from '../../../graphql/queries';
import {
  DISABLE_ORG_DISCORD_NOTIFICATION_CONFIG,
  ENABLE_ORG_DISCORD_NOTIFICATION_CONFIG,
} from '../../../graphql/mutations';

import { SettingsWrapper } from '../settingsWrapper';
import { NotificationOutlineSettings } from '../../Icons/notifications';
import { HeaderBlock } from '../headerBlock';
import { ConnectDiscordButton, TableValueText } from './styles';
import CheckMarkIcon from '../../Icons/checkMark';
import Switch from '../../Common/Switch';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';
import DiscordNotificationSetup from '../../../components/DiscordNotificationSetup';
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

const CurrentNotificationSetting = ({ discordNotificationConfigData, orgId }) => {
  const notificationEnabled = discordNotificationConfigData?.disabledAt === null;
  const [notificationOn, setNotificationOn] = useState(notificationEnabled);
  const [configurationError, setConfigurationError] = useState(null);
  const [channelDeletedError, setChannelDeletedError] = useState(null);
  const [serverDisconnectedError, setServerDisconnectedError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [enableDiscordNotification] = useMutation(ENABLE_ORG_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(true)
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error enabling notifications')
    },
  });
  const [disableDiscordNotification] = useMutation(DISABLE_ORG_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(false)
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error disabling notifications')
    },
  });

  useEffect(() => {
    setConfigurationError(null);
    setConfigurationError(null);
    setConfigurationError(null);
    const channelName = discordNotificationConfigData?.channelInfo?.channelName;
    const guildName = discordNotificationConfigData?.channelInfo?.guildName;
    if (discordNotificationConfigData?.id && !channelName && !guildName) {
      setConfigurationError('discord bot no longer connected to server');
      setServerDisconnectedError(true);
    } else if (discordNotificationConfigData?.id && !channelName && guildName) {
      setConfigurationError('the channel that the notificatoin was originally going to was deleted');
      setChannelDeletedError(true);
    }
  }, [discordNotificationConfigData]);
  const handleEnableDisableSwitch = async () => {
    setMutationError(null)
    if (notificationOn) {
      const confirmed = confirm('Are you sure you want to disable discord channel notfications?');
      if (!confirmed) {
        return;
      }
    }
    if (notificationOn) {
      disableDiscordNotification({
        variables: { orgId },
      });
    }

    if (!notificationOn) {
      enableDiscordNotification({
        variables: { orgId },
      });
    }
  };
  return (
    <>
      <StyledTableContainer
        style={{
          marginLeft: '-3%',
          width: '100%',
        }}
      >
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              {/* <StyledTableCell align="center" width={'10%'}>
                active
              </StyledTableCell> */}
              <StyledTableCell align="center" width={'45%'}>
                Connected Server
              </StyledTableCell>
              <StyledTableCell align="center" width={'45%'}>
                channel
              </StyledTableCell>
              <StyledTableCell align="center" width="10%">
                Enabled
              </StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            <StyledTableRow
              style={{
                width: '150%',
              }}
            >
              {/* <StyledTableCell align="center">
                <CheckMarkIcon />
              </StyledTableCell> */}
              <StyledTableCell>
                {serverDisconnectedError ? (
                  <ErrorText>
                    discord bot no longer connected to server, please add the bot back to the discord server
                  </ErrorText>
                ) : (
                  <TableValueText>{discordNotificationConfigData?.channelInfo?.guildName}</TableValueText>
                )}
              </StyledTableCell>
              <StyledTableCell>
                {channelDeletedError ? (
                  <ErrorText>the channel that the notificatoin was originally going to was deleted</ErrorText>
                ) : (
                  <TableValueText>{discordNotificationConfigData?.channelInfo?.channelName}</TableValueText>
                )}
              </StyledTableCell>
              <StyledTableCell>
                {' '}
                <Switch size="medium" checked={notificationOn} onChange={(e) => handleEnableDisableSwitch()} />
              </StyledTableCell>
            </StyledTableRow>
          </StyledTableBody>
        </StyledTable>
        {mutationError && <ErrorText>{mutationError}</ErrorText> }
      </StyledTableContainer>
    </>
  );
};

const Notifications = ({ orgId }) => {
  const [showInstructionPage, setShowInstructionPage] = useState(false);
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

  const discordNotificationConfigData = data?.getOrgDiscordNotificationConfig;

  return (
    <SettingsWrapper>
      <HeaderBlock
        icon={<NotificationOutlineSettings width="32" height="32" />}
        title="Notifications"
        description="Manage notifications"
      />
      <GeneralSettingsContainer></GeneralSettingsContainer>
      <GeneralSettingsIntegrationsBlock>
        <LabelBlock>Discord Integration</LabelBlock>
        {discordNotificationConfigData?.channelId && (
          <CurrentNotificationSetting discordNotificationConfigData={discordNotificationConfigData} orgId={orgId} />
        )}
        <ConnectDiscordButton
          style={{
            maxWidth: 'none',
            width: 'fit-content',
            borderRadius: '8px',
          }}
          buttonInnerStyle={{
            borderRadius: '8px',
          }}
          highlighted
          onClick={() => setShowInstructionPage(!showInstructionPage)}
        >
          <GeneralSettingsIntegrationsBlockButtonIcon />
          {showInstructionPage ? 'Hide' : 'See'} Discord Setup Instruction
        </ConnectDiscordButton>
        {showInstructionPage && (
          <>
            <br />
            <DiscordNotificationSetup orgUsername={orgData?.getOrgById?.username} />
          </>
        )}
      </GeneralSettingsIntegrationsBlock>
    </SettingsWrapper>
  );
};

export default Notifications;
