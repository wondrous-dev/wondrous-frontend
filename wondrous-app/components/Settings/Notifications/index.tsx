import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
  GET_ORG_BY_ID,
  GET_DISCORD_GUILD_FROM_INVITE_CODE,
} from '../../../graphql/queries';
import {
  DISABLE_ORG_DISCORD_NOTIFICATION_CONFIG,
  ENABLE_ORG_DISCORD_NOTIFICATION_CONFIG,
} from '../../../graphql/mutations';

import { SettingsWrapper } from '../settingsWrapper';
import { NotificationOutlineSettings } from '../../Icons/notifications';
import { HeaderBlock } from '../headerBlock';
import { ConnectDiscordButton, DiscordCard, DiscordCardElement, DiscordCardElementDiv, TableValueText } from './styles';
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
import DiscordNotificationSetup, { BOT_URL } from '../../../components/DiscordNotificationSetup';
import {
  AddGuildButton,
  DiscordText,
  GeneralSettingsContainer,
  GeneralSettingsIntegrationsBlock,
  GeneralSettingsIntegrationsBlockButtonIcon,
  LabelBlock,
  LabelBlockText,
} from '../styles';
import Link from 'next/link';
import { Grey800, HighlightBlue, White } from '../../../theme/colors';
import { ErrorText } from '../../Common';
import InputForm from '@components/Common/InputForm/inputForm';
import DropdownSelect from '@components/Common/DropdownSelect/dropdownSelect';

const CurrentNotificationSetting = ({ discordNotificationConfigData, orgId }) => {
  const notificationEnabled = discordNotificationConfigData?.disabledAt === null;
  const [notificationOn, setNotificationOn] = useState(notificationEnabled);
  const [configurationError, setConfigurationError] = useState(null);
  const [channelDeletedError, setChannelDeletedError] = useState(null);
  const [serverDisconnectedError, setServerDisconnectedError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [enableDiscordNotification] = useMutation(ENABLE_ORG_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(true);
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error enabling notifications');
    },
  });
  const [disableDiscordNotification] = useMutation(DISABLE_ORG_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(false);
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error disabling notifications');
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
    setMutationError(null);
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
        {mutationError && <ErrorText>{mutationError}</ErrorText>}
      </StyledTableContainer>
    </>
  );
};
let timeout;
const Notifications = ({ orgId }) => {
  const [showInstructionPage, setShowInstructionPage] = useState(false);
  const [discordInviteLink, setDiscordInviteLink] = useState('');
  const [discordInviteLinkError, setDiscordInviteLinkError] = useState('');
  const [discordChannels, setDiscordChannels] = useState([]);
  const [getDiscordGuildFromInviteCode] = useLazyQuery(GET_DISCORD_GUILD_FROM_INVITE_CODE);
  const [guildId, setGuildId] = useState(null);
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

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const inviteCodeArr = discordInviteLink.split('/');
      const inviteCode = inviteCodeArr[inviteCodeArr.length - 1];
      if (discordInviteLink) {
        if (inviteCode) {
          try {
            const guildData = await getDiscordGuildFromInviteCode({
              variables: {
                inviteCode,
              },
            });
            if (guildData?.error) {
              setDiscordInviteLinkError('Invalid invite link');
            } else if (guildData?.data) {
              setGuildId(guildData?.data?.getDiscordGuildFromInviteCode?.guildId);
            }
          } catch (err) {
            console.log('err', err);
            setDiscordInviteLinkError('Invalid invite link');
          }
        } else {
          setDiscordInviteLinkError('Invalid invite link');
        }
      }
    }, 1000);
  }, [discordInviteLink]);
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
        <DiscordCard container spacing={2}>
          <DiscordCardElement sm={4}>
            <DiscordCardElementDiv>
              <DiscordText>1. Paste invite link</DiscordText>
              <InputForm
                style={{
                  background: '#272729',
                }}
                value={discordInviteLink}
                onChange={(e) => setDiscordInviteLink(e.target.value)}
              />
              {!!discordInviteLinkError && <ErrorText>{discordInviteLinkError}</ErrorText>}
            </DiscordCardElementDiv>
          </DiscordCardElement>
          <DiscordCardElement sm={4}>
            <DiscordCardElementDiv>
              <DiscordText>2. Add bot</DiscordText>
              {guildId ? (
                <>
                  <AddGuildButton
                    style={{
                      border: '1px solid deepskyblue',
                      backgroundColor: '#272729',
                    }}
                    href={`${BOT_URL}&guild_id=${guildId}`}
                    target="_blank"
                  >
                    <DiscordText
                      style={{
                        color: White,
                        fontSize: '14px',
                        marginBottom: '0',
                      }}
                    >
                      Add Wonder bot
                    </DiscordText>
                  </AddGuildButton>
                </>
              ) : (
                <>
                  <AddGuildButton disabled>
                    <DiscordText
                      style={{
                        color: '#8b8b8c',
                        fontSize: '14px',
                        marginBottom: '0',
                      }}
                    >
                      Add Wonder bot
                    </DiscordText>
                  </AddGuildButton>
                </>
              )}
            </DiscordCardElementDiv>
          </DiscordCardElement>
          <DiscordCardElement sm={4}>
            <DiscordCardElementDiv>
              <DiscordText>3. Set channel</DiscordText>
              <DropdownSelect
                formSelectStyle={{
                  height: 'auto',
                }}
                innerStyle={{
                  marginTop: '0',
                  background: '#272729',
                }}
                options={discordChannels}
              ></DropdownSelect>
            </DiscordCardElementDiv>
          </DiscordCardElement>
        </DiscordCard>
        {discordNotificationConfigData?.channelId && (
          <CurrentNotificationSetting discordNotificationConfigData={discordNotificationConfigData} orgId={orgId} />
        )}
        {/* <ConnectDiscordButton
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
        )} */}
      </GeneralSettingsIntegrationsBlock>
    </SettingsWrapper>
  );
};

export default Notifications;
