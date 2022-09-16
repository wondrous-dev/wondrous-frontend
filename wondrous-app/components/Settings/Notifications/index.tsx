import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import EditIcon from 'components/Icons/editIcon';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_CHANNELS_FROM_DISCORD } from 'graphql/queries';
import palette from 'theme/palette';
import {
  DISABLE_ORG_DISCORD_NOTIFICATION_CONFIG,
  ENABLE_ORG_DISCORD_NOTIFICATION_CONFIG,
  MANUAL_DISCORD_ORG_SETUP,
} from 'graphql/mutations';

import DropdownSelect from 'components/Common/DropdownSelect/DropdownSelect';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { ErrorText } from 'components/Common';
import Switch from 'components/Common/Switch';
import { NotificationOutlineSettings } from 'components/Icons/notifications';
import { HeaderBlock } from 'components/Settings/headerBlock';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from 'components/Table/styles';
import { DiscordText, GeneralSettingsIntegrationsBlock, LabelBlock } from 'components/Settings/styles';
import AddWonderBotToDiscordConfig from 'components/Settings/Notifications/AddWonderBotToDiscordConfig';
import { DiscordCardElementDiv, TableValueText, DiscordChannelInfoDiv } from './styles';

function CurrentNotificationSetting({ discordNotificationConfigData, orgId, filteredDiscordChannels }) {
  const notificationEnabled = discordNotificationConfigData?.disabledAt === null;
  const [notificationOn, setNotificationOn] = useState(notificationEnabled);
  const [channelDeletedError, setChannelDeletedError] = useState(null);
  const [serverDisconnectedError, setServerDisconnectedError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [editChannel, setEditChannel] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [manualDiscordOrgSetup, { error: saveDiscordOrgError }] = useMutation(MANUAL_DISCORD_ORG_SETUP, {
    onCompleted: () => {
      setEditChannel(null);
    },
  });

  const handleEditClick = () => {
    setEditChannel(true);
    setSelectedChannel(discordNotificationConfigData?.channelId);
  };

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
    const channelName = discordNotificationConfigData?.channelInfo?.channelName;
    const guildName = discordNotificationConfigData?.channelInfo?.guildName;
    if (discordNotificationConfigData?.id && !channelName && !guildName) {
      setServerDisconnectedError(true);
    } else if (discordNotificationConfigData?.id && !channelName && guildName) {
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
              <StyledTableCell align="center" width="45%">
                Connected Server
              </StyledTableCell>
              <StyledTableCell align="center" width="45%">
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
                <>
                  {' '}
                  {!editChannel && discordNotificationConfigData?.channelInfo?.channelName && (
                    <DiscordChannelInfoDiv>
                      <TableValueText>{discordNotificationConfigData?.channelInfo?.channelName}</TableValueText>
                      <EditIcon
                        style={{ marginLeft: '15px', cursor: 'pointer', height: '15px' }}
                        onClick={handleEditClick}
                      />
                    </DiscordChannelInfoDiv>
                  )}
                  {(!discordNotificationConfigData?.channelInfo?.channelName || editChannel) && (
                    <DiscordCardElementDiv>
                      <DropdownSelect
                        value={selectedChannel}
                        setValue={setSelectedChannel}
                        formSelectStyle={{
                          height: 'auto',
                        }}
                        innerStyle={{
                          marginTop: '0',
                          background: palette.grey1000,
                        }}
                        options={filteredDiscordChannels}
                      />
                    </DiscordCardElementDiv>
                  )}
                  {channelDeletedError && (
                    <ErrorText>the channel that the notificatoin was originally going to was deleted</ErrorText>
                  )}
                </>
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
      {selectedChannel && (
        <>
          <CreateFormPreviewButton
            style={{
              float: 'right',
              marginTop: '24px',
            }}
            onClick={() => {
              manualDiscordOrgSetup({
                variables: {
                  guildId: discordNotificationConfigData?.guildId,
                  orgId,
                  channelId: selectedChannel,
                },
                refetchQueries: [GET_ORG_DISCORD_NOTIFICATION_CONFIGS],
              });
            }}
          >
            Save changes
          </CreateFormPreviewButton>
          {saveDiscordOrgError && (
            <ErrorText>
              Failed to set up Discord for organization: {saveDiscordOrgError?.message || saveDiscordOrgError}
            </ErrorText>
          )}
        </>
      )}
    </>
  );
}

function Notifications({ orgId }) {
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
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
  const filteredDiscordChannels = discordChannels.map((channel) => ({
    value: channel.id,
    label: channel.name,
  }));

  return (
    <SettingsWrapper>
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
        <LabelBlock>Discord Integration</LabelBlock>
        <DiscordText>For private channels, please ensure that the bot is added as a role</DiscordText>
        {!discordNotificationConfigData?.channelId && <AddWonderBotToDiscordConfig orgId={orgId} />}
        {discordNotificationConfigData?.channelId && (
          <CurrentNotificationSetting
            discordNotificationConfigData={discordNotificationConfigData}
            orgId={orgId}
            filteredDiscordChannels={filteredDiscordChannels}
          />
        )}
      </GeneralSettingsIntegrationsBlock>
    </SettingsWrapper>
  );
}

export default Notifications;
