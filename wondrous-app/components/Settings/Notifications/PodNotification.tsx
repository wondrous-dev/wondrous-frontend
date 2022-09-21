import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import Link from 'next/link';
import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import {
  GET_ORG_DISCORD_NOTIFICATION_CONFIGS,
  GET_POD_DISCORD_NOTIFICATION_CONFIGS,
  GET_CHANNELS_FROM_DISCORD,
  GET_POD_BY_ID,
} from 'graphql/queries';
import {
  DISABLE_POD_DISCORD_NOTIFICATION_CONFIG,
  ENABLE_POD_DISCORD_NOTIFICATION_CONFIG,
  MANUAL_DISCORD_POD_SETUP,
} from 'graphql/mutations';
import DropdownSelect from 'components/Common/DropdownSelect';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { NotificationOutlineSettings } from '../../Icons/notifications';
import { HeaderBlock } from '../headerBlock';
import { DiscordCardElementDiv, TableValueText, DiscordChannelInfoDiv } from './styles';
import Switch from '../../Common/Switch';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';
import { DiscordText, GeneralSettingsIntegrationsBlock, LabelBlock } from '../styles';
import { ErrorText } from '../../Common';

function PodNotification(props) {
  const { podId } = props;
  const [orgNotificationConfig, setOrgNotificationConfig] = useState(null);
  const [getChannelsFromDiscord, { data: discordChannelData }] = useLazyQuery(GET_CHANNELS_FROM_DISCORD);
  const [guildId, setGuildId] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [editChannel, setEditChannel] = useState(null);
  const [notificationOn, setNotificationOn] = useState(null);
  const [channelDeletedError, setChannelDeletedError] = useState(null);
  const [serverDisconnectedError, setServerDisconnectedError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [enableDiscordNotification] = useMutation(ENABLE_POD_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(true);
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error enabling notifications');
    },
  });
  const [disableDiscordNotification] = useMutation(DISABLE_POD_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(false);
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error disabling notifications');
    },
  });
  const [manualDiscordPodSetup, { error: saveDiscordPodError }] = useMutation(MANUAL_DISCORD_POD_SETUP, {
    onCompleted: () => {
      setEditChannel(null);
    },
  });

  const [getOrgDiscordNotificationConfig, { loading, called }] = useLazyQuery(GET_ORG_DISCORD_NOTIFICATION_CONFIGS, {
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

  const discordNotificationConfigData = data?.getPodDiscordNotificationConfig;

  useEffect(() => {
    setNotificationOn(discordNotificationConfigData?.disabledAt === null);
  }, [discordNotificationConfigData?.disabledAt]);

  useEffect(() => {
    setGuildId(discordNotificationConfigData?.guildId || orgNotificationConfig?.guildId);
  }, [orgNotificationConfig?.guildId, discordNotificationConfigData?.guildId]);

  useEffect(() => {
    if (guildId) {
      getChannelsFromDiscord({
        variables: {
          guildId,
        },
      });
    }
  }, [guildId]);

  useEffect(() => {
    if (orgId) {
      getOrgDiscordNotificationConfig({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId]);

  useEffect(() => {
    const channelName = discordNotificationConfigData?.channelInfo?.channelName;
    const guildName = discordNotificationConfigData?.channelInfo?.guildName;
    if (discordNotificationConfigData?.id && !channelName && !guildName) {
      setServerDisconnectedError(true);
    } else if (discordNotificationConfigData?.id && !channelName && guildName) {
      setChannelDeletedError(true);
    }
  }, [discordNotificationConfigData]);

  const discordChannels = discordChannelData?.getAvailableChannelsForDiscordGuild || [];
  const filteredDiscordChannels = discordChannels.map((channel) => ({
    value: channel.id,
    label: channel.name,
  }));

  const handleEditClick = () => {
    setEditChannel(true);
    setSelectedChannel(discordNotificationConfigData?.channelId);
  };

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
        variables: { podId },
      });
    }

    if (!notificationOn) {
      enableDiscordNotification({
        variables: { podId },
      });
    }
  };

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
        {called && !loading && !orgNotificationConfig?.guildId && (
          <ErrorText>
            Add wonder bot to discord server on the org{' '}
            <Link href={`/organization/settings/${orgId}/notifications`}>notification setting page</Link>
          </ErrorText>
        )}
        {orgNotificationConfig?.guildId && (
          <>
            {' '}
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
                      <TableValueText>{orgNotificationConfig?.channelInfo?.guildName}</TableValueText>
                    </StyledTableCell>
                    <StyledTableCell>
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
                    </StyledTableCell>
                    <StyledTableCell>
                      {' '}
                      <Switch size="medium" checked={notificationOn} onClick={handleEnableDisableSwitch} />
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
                    manualDiscordPodSetup({
                      variables: {
                        guildId,
                        podId,
                        channelId: selectedChannel,
                      },
                      refetchQueries: [GET_POD_DISCORD_NOTIFICATION_CONFIGS],
                    });
                  }}
                >
                  Save changes
                </CreateFormPreviewButton>
                {saveDiscordPodError && (
                  <ErrorText>
                    Failed to set up Discord for pod: {saveDiscordPodError?.message || saveDiscordPodError}
                  </ErrorText>
                )}
              </>
            )}
          </>
        )}
      </GeneralSettingsIntegrationsBlock>
    </SettingsWrapper>
  );
}

export default PodNotification;
